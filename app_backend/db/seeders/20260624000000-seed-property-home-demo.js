"use strict";

const bcrypt = require("bcrypt");

const DEMO_EMAILS = [
    "demo.agent@hously.test",
    "demo.reviewer1@hously.test",
    "demo.reviewer2@hously.test",
    "demo.reviewer3@hously.test",
];

const PROPERTY_NAMES = [
    "Avana Homestay",
    "Bali Komang Guest House",
    "Maharani Villa Yogyakarta",
    "Apartement Iandem",
    "Takatea Homestay",
    "Ubud Garden Villa",
    "Malang City Apartment",
    "Nusa Penida Ocean House",
];

const now = () => new Date();

const selectRows = async (
    queryInterface,
    sql,
    replacements = {},
    transaction = null
) => {
    const [rows] = await queryInterface.sequelize.query(sql, {
        replacements,
        transaction,
    });
    return rows;
};

const removeDemoData = async (queryInterface, Sequelize, transaction) => {
    const users = await selectRows(
        queryInterface,
        `SELECT id FROM users WHERE email IN (:emails)`,
        { emails: DEMO_EMAILS },
        transaction
    );
    const userIds = users.map((user) => user.id);

    const properties = userIds.length
        ? await selectRows(
            queryInterface,
            `SELECT id FROM properties WHERE user_id IN (:userIds)`,
            { userIds },
            transaction
        )
        : [];
    const propertyIds = properties.map((property) => property.id);

    if (propertyIds.length) {
        await queryInterface.bulkDelete(
            "reviews",
            { property_id: { [Sequelize.Op.in]: propertyIds } },
            { transaction }
        );
        await queryInterface.bulkDelete(
            "property_images",
            { property_id: { [Sequelize.Op.in]: propertyIds } },
            { transaction }
        );
        await queryInterface.bulkDelete(
            "property_details",
            { property_id: { [Sequelize.Op.in]: propertyIds } },
            { transaction }
        );
        await queryInterface.bulkDelete(
            "addresses",
            { property_id: { [Sequelize.Op.in]: propertyIds } },
            { transaction }
        );
        await queryInterface.bulkDelete(
            "properties",
            { id: { [Sequelize.Op.in]: propertyIds } },
            { transaction }
        );
    }

    if (userIds.length) {
        await queryInterface.bulkDelete(
            "reviews",
            { user_id: { [Sequelize.Op.in]: userIds } },
            { transaction }
        );
        await queryInterface.bulkDelete(
            "addresses",
            { user_id: { [Sequelize.Op.in]: userIds } },
            { transaction }
        );
        await queryInterface.bulkDelete(
            "users",
            { id: { [Sequelize.Op.in]: userIds } },
            { transaction }
        );
    }
};

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await removeDemoData(
                queryInterface,
                Sequelize,
                transaction
            );

            const roles = await selectRows(
                queryInterface,
                `SELECT id, name FROM roles WHERE name IN ('agent', 'user')`,
                {},
                transaction
            );
            const roleByName = Object.fromEntries(
                roles.map((role) => [role.name, role.id])
            );

            if (!roleByName.agent || !roleByName.user) {
                throw new Error(
                    "Run the roles seeder first; agent and user roles are required."
                );
            }

            const password = await bcrypt.hash("Demo@123", 10);
            const timestamp = now();

            await queryInterface.bulkInsert(
                "users",
                [
                    {
                        username: "Hously Demo Agent",
                        email: DEMO_EMAILS[0],
                        password,
                        role_id: roleByName.agent,
                        email_verified: true,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                    },
                    ...DEMO_EMAILS.slice(1).map((email, index) => ({
                        username: `Demo Reviewer ${index + 1}`,
                        email,
                        password,
                        role_id: roleByName.user,
                        email_verified: true,
                        createdAt: timestamp,
                        updatedAt: timestamp,
                    })),
                ],
                { transaction }
            );

            const demoUsers = await selectRows(
                queryInterface,
                `SELECT id, email FROM users WHERE email IN (:emails)`,
                { emails: DEMO_EMAILS },
                transaction
            );
            const userByEmail = Object.fromEntries(
                demoUsers.map((user) => [user.email, user.id])
            );
            const agentId = userByEmail[DEMO_EMAILS[0]];

            const propertyRows = [
                {
                    name: PROPERTY_NAMES[0],
                    description:
                        "A bright tropical homestay with a private garden.",
                    price_per_month: 310,
                    property_type: "homestay",
                    currency: "USD",
                    price_period: "month",
                    status: "rent",
                    is_featured: true,
                    is_recommended: true,
                    recommendation_score: 98,
                    views_count: 1840,
                },
                {
                    name: PROPERTY_NAMES[1],
                    description:
                        "Comfortable guest house near Bali beaches and cafes.",
                    price_per_month: 280,
                    property_type: "guest_house",
                    currency: "USD",
                    price_period: "month",
                    status: "rent",
                    is_featured: true,
                    is_recommended: true,
                    recommendation_score: 95,
                    views_count: 1610,
                },
                {
                    name: PROPERTY_NAMES[2],
                    description:
                        "Modern family villa in a quiet Yogyakarta neighborhood.",
                    price_per_month: 320,
                    property_type: "villa",
                    currency: "USD",
                    price_period: "month",
                    status: "rent",
                    is_featured: false,
                    is_recommended: true,
                    recommendation_score: 92,
                    views_count: 1430,
                },
                {
                    name: PROPERTY_NAMES[3],
                    description:
                        "Central apartment with city access and secure parking.",
                    price_per_month: 320,
                    property_type: "apartment",
                    currency: "USD",
                    price_period: "month",
                    status: "rent",
                    is_featured: false,
                    is_recommended: false,
                    recommendation_score: 82,
                    views_count: 1320,
                },
                {
                    name: PROPERTY_NAMES[4],
                    description:
                        "Peaceful homestay with a pool and spacious living area.",
                    price_per_month: 120,
                    property_type: "homestay",
                    currency: "USD",
                    price_period: "night",
                    status: "rent",
                    is_featured: false,
                    is_recommended: true,
                    recommendation_score: 89,
                    views_count: 1190,
                },
                {
                    name: PROPERTY_NAMES[5],
                    description:
                        "Private Ubud villa surrounded by gardens and rice fields.",
                    price_per_month: 410,
                    property_type: "villa",
                    currency: "USD",
                    price_period: "month",
                    status: "rent",
                    is_featured: true,
                    is_recommended: true,
                    recommendation_score: 94,
                    views_count: 1510,
                },
                {
                    name: PROPERTY_NAMES[6],
                    description:
                        "Compact city apartment close to Malang attractions.",
                    price_per_month: 240,
                    property_type: "apartment",
                    currency: "USD",
                    price_period: "month",
                    status: "rent",
                    is_featured: false,
                    is_recommended: false,
                    recommendation_score: 76,
                    views_count: 870,
                },
                {
                    name: PROPERTY_NAMES[7],
                    description:
                        "Ocean-view house ideal for a relaxed island stay.",
                    price_per_month: 190,
                    property_type: "house",
                    currency: "USD",
                    price_period: "night",
                    status: "rent",
                    is_featured: true,
                    is_recommended: true,
                    recommendation_score: 91,
                    views_count: 1375,
                },
            ].map((property) => ({
                ...property,
                user_id: agentId,
                is_active: true,
                created_at: timestamp,
                updated_at: timestamp,
            }));

            await queryInterface.bulkInsert(
                "properties",
                propertyRows,
                { transaction }
            );

            const properties = await selectRows(
                queryInterface,
                `SELECT id, name FROM properties
                 WHERE user_id = :agentId AND name IN (:names)`,
                { agentId, names: PROPERTY_NAMES },
                transaction
            );
            const propertyByName = Object.fromEntries(
                properties.map((property) => [
                    property.name,
                    property.id,
                ])
            );

            const details = [
                [PROPERTY_NAMES[0], 3, 2, 1850, true, true],
                [PROPERTY_NAMES[1], 2, 2, 1320, true, true],
                [PROPERTY_NAMES[2], 4, 3, 2400, true, true],
                [PROPERTY_NAMES[3], 2, 1, 980, true, true],
                [PROPERTY_NAMES[4], 3, 2, 1720, true, true],
                [PROPERTY_NAMES[5], 4, 4, 2750, true, true],
                [PROPERTY_NAMES[6], 1, 1, 720, false, true],
                [PROPERTY_NAMES[7], 3, 2, 1600, true, true],
            ].map(
                ([
                    name,
                    bedrooms,
                    bathrooms,
                    areaSqft,
                    parking,
                    furnished,
                ]) => ({
                    property_id: propertyByName[name],
                    bedrooms,
                    bathrooms,
                    area_sqft: areaSqft,
                    parking,
                    furnished,
                    created_at: timestamp,
                    updated_at: timestamp,
                })
            );

            await queryInterface.bulkInsert(
                "property_details",
                details,
                { transaction }
            );

            const addressData = [
                [
                    PROPERTY_NAMES[0],
                    -7.7956,
                    110.3695,
                    "Yogyakarta",
                    "Special Region of Yogyakarta",
                    "Indonesia",
                    "Jl. Malioboro, Yogyakarta",
                ],
                [
                    PROPERTY_NAMES[1],
                    -8.4095,
                    115.1889,
                    "Bali",
                    "Bali",
                    "Indonesia",
                    "Jl. Raya Ubud, Bali",
                ],
                [
                    PROPERTY_NAMES[2],
                    -7.8014,
                    110.3647,
                    "Yogyakarta",
                    "Special Region of Yogyakarta",
                    "Indonesia",
                    "Jl. Jendral Sudirman, Yogyakarta",
                ],
                [
                    PROPERTY_NAMES[3],
                    -6.2088,
                    106.8456,
                    "Jakarta",
                    "Jakarta",
                    "Indonesia",
                    "Jl. Tenera Pelajar, Jakarta",
                ],
                [
                    PROPERTY_NAMES[4],
                    -6.2146,
                    106.8451,
                    "Jakarta",
                    "Jakarta",
                    "Indonesia",
                    "Jl. Tenera Pelajar No. 47, Jakarta",
                ],
                [
                    PROPERTY_NAMES[5],
                    -8.5069,
                    115.2625,
                    "Bali",
                    "Bali",
                    "Indonesia",
                    "Jl. Monkey Forest, Ubud",
                ],
                [
                    PROPERTY_NAMES[6],
                    -7.9666,
                    112.6326,
                    "Malang",
                    "East Java",
                    "Indonesia",
                    "Jl. Ijen, Malang",
                ],
                [
                    PROPERTY_NAMES[7],
                    -8.7278,
                    115.5444,
                    "Nusa Penida",
                    "Bali",
                    "Indonesia",
                    "Jl. Ped, Nusa Penida",
                ],
            ].map(
                ([
                    name,
                    lat,
                    lon,
                    city,
                    state,
                    country,
                    addressline,
                ]) => ({
                    user_id: agentId,
                    property_id: propertyByName[name],
                    lat,
                    lon,
                    city,
                    state,
                    country,
                    zipcode: null,
                    addressline,
                    countrycode: "ID",
                    provincecode: null,
                    created_at: timestamp,
                    updated_at: timestamp,
                })
            );

            await queryInterface.bulkInsert(
                "addresses",
                addressData,
                { transaction }
            );

            const imageData = {
                [PROPERTY_NAMES[0]]: [
                    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
                ],
                [PROPERTY_NAMES[1]]: [
                    "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=1200&q=80",
                ],
                [PROPERTY_NAMES[2]]: [
                    "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
                ],
                [PROPERTY_NAMES[3]]: [
                    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
                ],
                [PROPERTY_NAMES[4]]: [
                    "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=1200&q=80",
                ],
                [PROPERTY_NAMES[5]]: [
                    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
                ],
                [PROPERTY_NAMES[6]]: [
                    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
                ],
                [PROPERTY_NAMES[7]]: [
                    "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80",
                ],
            };
            const images = Object.entries(imageData).flatMap(
                ([name, urls]) =>
                    urls.map((imageUrl) => ({
                        property_id: propertyByName[name],
                        image_url: imageUrl,
                        created_at: timestamp,
                        updated_at: timestamp,
                    }))
            );

            await queryInterface.bulkInsert(
                "property_images",
                images,
                { transaction }
            );

            const reviewerIds = DEMO_EMAILS.slice(1).map(
                (email) => userByEmail[email]
            );
            const ratingsByProperty = [
                [PROPERTY_NAMES[0], [5, 5, 4]],
                [PROPERTY_NAMES[1], [5, 4, 5]],
                [PROPERTY_NAMES[2], [5, 4, 4]],
                [PROPERTY_NAMES[3], [5, 5, 4]],
                [PROPERTY_NAMES[4], [5, 4, 5]],
                [PROPERTY_NAMES[5], [5, 5, 5]],
                [PROPERTY_NAMES[6], [4, 4, 5]],
                [PROPERTY_NAMES[7], [5, 4, 5]],
            ];
            const reviews = ratingsByProperty.flatMap(
                ([name, ratings]) =>
                    ratings.map((rating, index) => ({
                        property_id: propertyByName[name],
                        user_id: reviewerIds[index],
                        rating,
                        comment:
                            rating === 5
                                ? "Excellent place and a wonderful stay."
                                : "Comfortable property in a good location.",
                        created_at: timestamp,
                        updated_at: timestamp,
                    }))
            );

            await queryInterface.bulkInsert(
                "reviews",
                reviews,
                { transaction }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();

        try {
            await removeDemoData(
                queryInterface,
                Sequelize,
                transaction
            );
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },
};
