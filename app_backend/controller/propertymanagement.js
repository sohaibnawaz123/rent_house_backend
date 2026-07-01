const { users, addresses, properties: Property, propertyimages, propertydetails, reviews } = require("../db/models");
const { roles } = require("../db/models");
const {
    createToken,
    verifyAccessToken,
    createAccessToken,
} = require("../helper/helper");
const path = require("path");
const { Op } = require("sequelize");
const {
    errorResponse,
    successResponse,
} = require("../utils/responseHandler.js");
const { errorName, successName } = require("../utils/constants.js");
const getErrorCode = require("../utils/error.js");
const { sequelize } = require("../db/models/index.js");
const fs = require("fs/promises");

const PROPERTY_TYPES = new Set([
    "house",
    "villa",
    "apartment",
    "homestay",
    "guest_house",
    "hotel",
    "other",
]);
const PROPERTY_STATUSES = new Set(["rent", "sale"]);
const PRICE_PERIODS = new Set([
    "night",
    "week",
    "month",
    "year",
    "total",
]);

const HOME_PROPERTY_INCLUDE = [
    {
        model: propertyimages,
        as: "images",
        attributes: ["image_url"],
        separate: true,
        limit: 5,
        order: [["id", "ASC"]],
    },
    {
        model: users,
        as: "agent",
        attributes: ["id", "username", "email"],
    },
    {
        model: propertydetails,
        as: "details",
    },
    {
        model: addresses,
        as: "address",
        attributes: [
            "lat",
            "lon",
            "city",
            "state",
            "country",
            "zipcode",
            "addressline",
        ],
    },
    {
        model: reviews,
        as: "reviews",
        attributes: ["rating"],
    },
];

const parsePositiveInt = (value, fallback, max = 50) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isInteger(parsed) && parsed > 0
        ? Math.min(parsed, max)
        : fallback;
};

const paginate = (items, query, defaultLimit = 10) => {
    const page = parsePositiveInt(query.page, 1, 100000);
    const limit = parsePositiveInt(query.limit, defaultLimit);
    const offset = (page - 1) * limit;

    return {
        data: items.slice(offset, offset + limit),
        pagination: {
            total: items.length,
            page,
            limit,
            total_pages: Math.ceil(items.length / limit),
        },
    };
};

const parseJsonField = (value, fallback = {}) => {
    if (value == null || value === "") return fallback;
    if (typeof value === "object") return value;

    try {
        return JSON.parse(value);
    } catch (_error) {
        return fallback;
    }
};

const parseCreateField = (value, fallback, fieldName) => {
    if (value == null || value === "") return fallback;
    if (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    ) {
        return value;
    }

    try {
        const parsed = JSON.parse(value);
        if (
            typeof parsed !== "object" ||
            parsed === null ||
            Array.isArray(parsed)
        ) {
            throw new Error();
        }
        return parsed;
    } catch (_error) {
        const error = new Error(
            `${fieldName} must be a valid JSON object`
        );
        error.statusCode = 400;
        throw error;
    }
};

const toBoolean = (value, fallback = false) => {
    if (value == null || value === "") return fallback;
    if (typeof value === "boolean") return value;
    return ["true", "1", "yes"].includes(String(value).toLowerCase());
};

const getUploadedFiles = (req) =>
    Array.isArray(req.files)
        ? req.files
        : Object.values(req.files || {}).flat();

const cleanupUploadedFiles = async (files) => {
    await Promise.allSettled(
        files
            .filter((file) => file?.path)
            .map((file) => fs.unlink(file.path))
    );
};

const optionalNumber = (value, fieldName, options = {}) => {
    if (value == null || value === "") return null;

    const number = Number(value);
    const { min, max, integer = false } = options;
    const invalid =
        !Number.isFinite(number) ||
        (integer && !Number.isInteger(number)) ||
        (min != null && number < min) ||
        (max != null && number > max);

    if (invalid) {
        const error = new Error(`${fieldName} is invalid`);
        error.statusCode = 400;
        throw error;
    }

    return number;
};

const normalizeCreatePropertyPayload = (body) => {
    const name = String(body.name || "").trim();
    const price = Number(body.price_per_month);
    const status = String(body.status || "rent").toLowerCase();
    const propertyType = String(
        body.property_type || "house"
    ).toLowerCase();
    const pricePeriod = String(
        body.price_period || "month"
    ).toLowerCase();
    const currency = String(body.currency || "USD").trim().toUpperCase();

    if (!name) {
        const error = new Error("Property name is required");
        error.statusCode = 400;
        throw error;
    }
    if (!Number.isFinite(price) || price <= 0) {
        const error = new Error(
            "price_per_month must be a number greater than 0"
        );
        error.statusCode = 400;
        throw error;
    }
    if (!PROPERTY_STATUSES.has(status)) {
        const error = new Error("status must be rent or sale");
        error.statusCode = 400;
        throw error;
    }
    if (!PROPERTY_TYPES.has(propertyType)) {
        const error = new Error(
            `property_type must be one of: ${[...PROPERTY_TYPES].join(", ")}`
        );
        error.statusCode = 400;
        throw error;
    }
    if (!PRICE_PERIODS.has(pricePeriod)) {
        const error = new Error(
            `price_period must be one of: ${[...PRICE_PERIODS].join(", ")}`
        );
        error.statusCode = 400;
        throw error;
    }
    if (!/^[A-Z]{3}$/.test(currency)) {
        const error = new Error(
            "currency must be a 3-letter code such as USD"
        );
        error.statusCode = 400;
        throw error;
    }

    return {
        name,
        description: body.description
            ? String(body.description).trim()
            : null,
        price_per_month: price,
        status,
        property_type: propertyType,
        currency,
        price_period: pricePeriod,
        is_featured: toBoolean(body.is_featured),
        is_recommended: toBoolean(body.is_recommended),
        recommendation_score:
            optionalNumber(
                body.recommendation_score,
                "recommendation_score",
                { min: 0 }
            ) ?? 0,
    };
};

const normalizePropertyDetails = (details) => ({
    bedrooms:
        optionalNumber(details.bedrooms, "details.bedrooms", {
            min: 0,
            integer: true,
        }) ?? 0,
    bathrooms:
        optionalNumber(details.bathrooms, "details.bathrooms", {
            min: 0,
            integer: true,
        }) ?? 0,
    area_sqft: optionalNumber(details.area_sqft, "details.area_sqft", {
        min: 0,
    }),
    parking: toBoolean(details.parking),
    furnished: toBoolean(details.furnished),
});

const normalizePropertyAddress = (address) => {
    const lat = optionalNumber(address.lat, "address.lat", {
        min: -90,
        max: 90,
    });
    const lon = optionalNumber(address.lon, "address.lon", {
        min: -180,
        max: 180,
    });

    if ((lat == null) !== (lon == null)) {
        const error = new Error(
            "address.lat and address.lon must be provided together"
        );
        error.statusCode = 400;
        throw error;
    }

    return {
        lat,
        lon,
        city: address.city ? String(address.city).trim() : null,
        state: address.state ? String(address.state).trim() : null,
        country: address.country ? String(address.country).trim() : null,
        zipcode: address.zipcode ? String(address.zipcode).trim() : null,
        addressline: address.addressline
            ? String(address.addressline).trim()
            : null,
        countrycode: address.countrycode
            ? String(address.countrycode).trim().toUpperCase()
            : null,
        provincecode: address.provincecode
            ? String(address.provincecode).trim().toUpperCase()
            : null,
    };
};

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const values = [lat1, lon1, lat2, lon2].map(Number);
    if (values.some((value) => !Number.isFinite(value))) return null;

    const [fromLat, fromLon, toLat, toLon] = values;
    const radiusKm = 6371;
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const latDifference = toRadians(toLat - fromLat);
    const lonDifference = toRadians(toLon - fromLon);
    const a =
        Math.sin(latDifference / 2) ** 2 +
        Math.cos(toRadians(fromLat)) *
            Math.cos(toRadians(toLat)) *
            Math.sin(lonDifference / 2) ** 2;

    return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const formatPropertyCard = (property, coordinates = null) => {
    const data = property.toJSON ? property.toJSON() : property;
    const reviewRatings = (data.reviews || [])
        .map((review) => Number(review.rating))
        .filter(Number.isFinite);
    const averageRating = reviewRatings.length
        ? reviewRatings.reduce((sum, rating) => sum + rating, 0) /
            reviewRatings.length
        : 0;
    const distanceKm = coordinates
        ? calculateDistanceKm(
            coordinates.lat,
            coordinates.lon,
            data.address?.lat,
            data.address?.lon
        )
        : null;

    return {
        id: data.id,
        name: data.name,
        description: data.description,
        property_type: data.property_type,
        status: data.status,
        price: Number(data.price_per_month),
        price_per_month: Number(data.price_per_month),
        currency: data.currency,
        price_period: data.price_period,
        is_featured: data.is_featured,
        is_recommended: data.is_recommended,
        recommendation_score: Number(data.recommendation_score || 0),
        views_count: data.views_count || 0,
        rating: Number(averageRating.toFixed(1)),
        reviews_count: reviewRatings.length,
        distance_km:
            distanceKm == null ? null : Number(distanceKm.toFixed(1)),
        image: data.images?.[0]?.image_url || null,
        images: (data.images || []).map((image) => image.image_url),
        address: data.address || null,
        details: data.details || null,
        agent: data.agent || null,
    };
};

const formatExploreCard = (card) => {
    const { details, agent, ...exploreCard } = card;
    return exploreCard;
};

const fetchActivePropertyCards = async (coordinates = null) => {
    const properties = await Property.findAll({
        where: { is_active: true },
        include: HOME_PROPERTY_INCLUDE,
        order: [["created_at", "DESC"]],
    });

    return properties.map((property) =>
        formatPropertyCard(property, coordinates)
    );
};

const sortRecommended = (cards) =>
    [...cards].sort(
        (a, b) =>
            Number(b.is_recommended) - Number(a.is_recommended) ||
            Number(b.is_featured) - Number(a.is_featured) ||
            b.recommendation_score - a.recommendation_score ||
            b.rating - a.rating ||
            b.views_count - a.views_count
    );

const sortPopular = (cards) =>
    [...cards].sort(
        (a, b) =>
            b.views_count - a.views_count ||
            b.rating - a.rating ||
            b.reviews_count - a.reviews_count ||
            b.recommendation_score - a.recommendation_score
    );

const buildTopLocations = (cards, limit) => {
    const locations = new Map();

    cards.forEach((card) => {
        const city = card.address?.city;
        if (!city) return;

        const key = [
            city,
            card.address?.state || "",
            card.address?.country || "",
        ].join("|").toLowerCase();
        const existing = locations.get(key);

        if (existing) {
            existing.properties_count += 1;
            if (!existing.image && card.image) existing.image = card.image;
            return;
        }

        locations.set(key, {
            city,
            state: card.address?.state || null,
            country: card.address?.country || null,
            image: card.image,
            properties_count: 1,
        });
    });

    return [...locations.values()]
        .sort(
            (a, b) =>
                b.properties_count - a.properties_count ||
                a.city.localeCompare(b.city)
        )
        .slice(0, limit);
};

const createProperty = async (req, res) => {
    let transaction;
    let committed = false;
    const uploadedFiles = getUploadedFiles(req);

    try {
        const { id } = req.user;
        const body = req.body || {};
        const propertyPayload = normalizeCreatePropertyPayload(body);
        const rawDetails = parseCreateField(body.details, {
            bedrooms: body.bedrooms,
            bathrooms: body.bathrooms,
            area_sqft: body.area_sqft,
            parking: body.parking,
            furnished: body.furnished,
        }, "details");
        const rawAddress = parseCreateField(body.address, {
            lat: body.lat,
            lon: body.lon,
            city: body.city,
            state: body.state,
            country: body.country,
            zipcode: body.zipcode,
            addressline: body.addressline,
            countrycode: body.countrycode,
            provincecode: body.provincecode,
        }, "address");
        const hasDetails = Object.values(rawDetails).some(
            (value) => value != null && value !== ""
        );
        const hasAddress = Object.values(rawAddress).some(
            (value) => value != null && value !== ""
        );
        const details = hasDetails
            ? normalizePropertyDetails(rawDetails)
            : null;
        const address = hasAddress
            ? normalizePropertyAddress(rawAddress)
            : null;

        transaction = await sequelize.transaction();
        const property = await Property.create({
            ...propertyPayload,
            user_id: id,
        }, { transaction });

        if (details) {
            await propertydetails.create({
                property_id: property.id,
                ...details,
            }, { transaction });
        }

        if (address) {
            await addresses.create({
                ...address,
                user_id: id,
                property_id: property.id,
            }, { transaction });
        }

        if (uploadedFiles.length > 0) {
            const images = uploadedFiles.map((file) => ({
                property_id: property.id,
                image_url: `/property-images/${file.filename}`,
            }));

            await propertyimages.bulkCreate(images, { transaction });
        }

        const createdProperty = await Property.findByPk(property.id, {
            include: HOME_PROPERTY_INCLUDE,
            transaction,
        });

        await transaction.commit();
        committed = true;

        return res.status(201).json({
            message: "Property created successfully",
            data: formatPropertyCard(createdProperty),
        });
    } catch (err) {
        if (transaction && !transaction.finished) {
            await transaction.rollback();
        }
        if (!committed) {
            await cleanupUploadedFiles(uploadedFiles);
        }

        const statusCode =
            err.statusCode ||
            (err.name === "SequelizeValidationError" ? 400 : 500);

        return res.status(statusCode).json({
            message:
                statusCode === 500
                    ? "Unable to create property"
                    : err.message,
            ...(process.env.NODE_ENV !== "production" && statusCode === 500
                ? { error: err.message }
                : {}),
        });
    }
};

const getProperties = async (req, res) => {
    try {
        const page = parsePositiveInt(req.query.page, 1, 100000);
        const limit = parsePositiveInt(req.query.limit, 10);
        const offset = (page - 1) * limit;
        const result = await Property.findAndCountAll({
            limit,
            offset,
            distinct: true,
            order: [["created_at", "DESC"]],
            include: [
                {
                    model: propertyimages,
                    as: "images",
                    attributes: ["image_url"],
                },
                {
                    model: users,
                    as: "agent",
                    attributes: ["id", "username", "email"],
                },
            ],
        });
        const formattedData = result.rows.map((property) => {
            const data = property.toJSON();
            data.images = data.images.map((image) => image.image_url);
            return data;
        });

        return res.status(200).json({
            message: "Properties fetched successfully",
            data: formattedData,
            pagination: {
                total: result.count,
                page,
                limit,
                total_pages: Math.ceil(result.count / limit),
            },
        });
    } catch (err) {
        console.log("ERROR:", err);
        return res.status(err.statusCode || 500).json({
            message: err.statusCode
                ? err.message
                : "Unable to fetch properties",
        });
    }
};
const getPropertyDetail = async (req, res) => {
    try {
        const id = Number.parseInt(req.query.id, 10);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "A valid property id query parameter is required",
            });
        }

        const property = await Property.findByPk(id, {
            include: [
                {
                    model: propertyimages,
                    as: "images",
                    attributes: ["image_url"], // only needed field
                },
                {
                    model: users,
                    as: "agent",
                    attributes: ["id", "username", "email"],
                },
                {
                    model: propertydetails,
                    as: "details",
                },
                {
                    model: reviews,
                    as: "reviews",
                },
                {
                    model: addresses,
                    as: "address",
                },
            ],
        });

        if (!property) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        // 🔥 convert images to array of strings
        await property.increment("views_count");

        const formattedProperty = property.toJSON();
        formattedProperty.views_count =
            Number(formattedProperty.views_count || 0) + 1;

        formattedProperty.images = formattedProperty.images.map(
            (img) => img.image_url
        );
        const ratings = formattedProperty.reviews
            .map((review) => Number(review.rating))
            .filter(Number.isFinite);
        formattedProperty.rating = ratings.length
            ? Number(
                (
                    ratings.reduce((sum, rating) => sum + rating, 0) /
                    ratings.length
                ).toFixed(1)
            )
            : 0;
        formattedProperty.reviews_count = ratings.length;

        res.status(200).json({
            message: "Property detail fetched",
            data: formattedProperty,
        });

    } catch (err) {
        console.log("ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

const getRecommendedProperties = async (req, res) => {
    try {
        const cards = await fetchActivePropertyCards();
        const result = paginate(sortRecommended(cards), req.query);

        return res.status(200).json({
            message: "Recommended properties fetched successfully",
            ...result,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getNearbyProperties = async (req, res) => {
    try {
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);
        const radiusKm = Number(req.query.radius_km || 50);

        if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
            return res.status(400).json({
                message: "Valid lat and lon query parameters are required",
            });
        }

        const cards = await fetchActivePropertyCards({ lat, lon });
        const nearby = cards
            .filter(
                (card) =>
                    card.distance_km != null &&
                    (!Number.isFinite(radiusKm) ||
                        card.distance_km <= radiusKm)
            )
            .sort(
                (a, b) =>
                    a.distance_km - b.distance_km ||
                    b.rating - a.rating
            );
        const result = paginate(nearby, req.query);

        return res.status(200).json({
            message: "Nearby properties fetched successfully",
            ...result,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getTopLocations = async (req, res) => {
    try {
        const cards = await fetchActivePropertyCards();
        const locations = buildTopLocations(cards, Number.MAX_SAFE_INTEGER);
        const result = paginate(locations, req.query);

        return res.status(200).json({
            message: "Top locations fetched successfully",
            ...result,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getPopularProperties = async (req, res) => {
    try {
        const cards = await fetchActivePropertyCards();
        const result = paginate(sortPopular(cards), req.query);

        return res.status(200).json({
            message: "Popular properties fetched successfully",
            ...result,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getHomeExplore = async (req, res) => {
    try {
        const rawType = String(req.query.type || "")
            .trim()
            .toLowerCase();
        const type = rawType.replace(/_/g, "-");

        if (!type) {
            return res.status(400).json({
                message:
                    "type query parameter is required. Use recommended, nearby, top-locations, or popular",
            });
        }

        if (type === "recommended") {
            const cards = await fetchActivePropertyCards();
            const result = paginate(
                sortRecommended(cards).map(formatExploreCard),
                req.query
            );

            return res.status(200).json({
                message: "Recommended properties fetched successfully",
                ...result,
            });
        }

        if (type === "nearby") {
            const lat = Number(req.query.lat);
            const lon = Number(req.query.lon);
            const radiusKm = Number(req.query.radius_km || 50);

            if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
                return res.status(400).json({
                    message:
                        "Valid lat and lon query parameters are required for type=nearby",
                });
            }

            const cards = await fetchActivePropertyCards({ lat, lon });
            const nearby = cards
                .filter(
                    (card) =>
                        card.distance_km != null &&
                        (!Number.isFinite(radiusKm) ||
                            card.distance_km <= radiusKm)
                )
                .sort(
                    (a, b) =>
                        a.distance_km - b.distance_km ||
                        b.rating - a.rating
                )
                .map(formatExploreCard);
            const result = paginate(nearby, req.query);

            return res.status(200).json({
                message: "Nearby properties fetched successfully",
                ...result,
            });
        }

        if (type === "top-locations") {
            const cards = await fetchActivePropertyCards();
            const locations = buildTopLocations(cards, Number.MAX_SAFE_INTEGER);
            const result = paginate(locations, req.query);

            return res.status(200).json({
                message: "Top locations fetched successfully",
                ...result,
            });
        }

        if (type === "popular") {
            const cards = await fetchActivePropertyCards();
            const result = paginate(
                sortPopular(cards).map(formatExploreCard),
                req.query
            );

            return res.status(200).json({
                message: "Popular properties fetched successfully",
                ...result,
            });
        }

        return res.status(400).json({
            message:
                "Invalid type. Use recommended, nearby, top-locations, or popular",
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

const getHomeData = async (req, res) => {
    try {
        const sectionLimit = parsePositiveInt(req.query.limit, 5, 20);
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);
        const radiusKm = Number(req.query.radius_km || 50);
        const hasCoordinates = Number.isFinite(lat) && Number.isFinite(lon);
        const cards = await fetchActivePropertyCards(
            hasCoordinates ? { lat, lon } : null
        );
        const nearby = hasCoordinates
            ? [...cards]
                .filter(
                    (card) =>
                        card.distance_km != null &&
                        (!Number.isFinite(radiusKm) ||
                            card.distance_km <= radiusKm)
                )
                .sort((a, b) => a.distance_km - b.distance_km)
                .slice(0, sectionLimit)
            : [];

        return res.status(200).json({
            message: "Home data fetched successfully",
            data: {
                recommended: sortRecommended(cards).slice(0, sectionLimit),
                nearby,
                top_locations: buildTopLocations(cards, sectionLimit),
                popular_for_you: sortPopular(cards).slice(0, sectionLimit),
            },
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

module.exports = {
    createProperty,
    getPropertyDetail,
    getProperties,
    getHomeExplore,
    getRecommendedProperties,
    getNearbyProperties,
    getTopLocations,
    getPopularProperties,
    getHomeData,
};
