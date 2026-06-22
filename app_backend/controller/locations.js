const { locations } = require("../db/models");
const { successName, errorName } = require("../utils/constants");
const getErrorCode = require("../utils/error");
const { errorResponse, successResponse } = require("../utils/responseHandler");
const {Op} = require("sequelize");

const getLocations = async (req, res) => {
  try {
    const locationsData = await locations.findAll();
    return successResponse(res, successName.SUCCESS, { data: locationsData });
  } catch (error) {
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const createLocations = async (req, res) => {
  try {
    const requiredFields = ["name", "country_id", "city_id"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return (
        res.status(400).
        json({
          message: `Missing required field(s): ${missingFields.join(",")}`,
        })
      );
    }
    const { name, country_id, city_id } = req.body;

    const existingLocation = await locations.findOne({
      where: {
        name: {
            [Op.iLike]: name //exact match ignoring case
        }
      }
    });
    
    if (existingLocation) {
      return res.status(400).json({ message: "Location already exists" });
    }

    const location = await locations.create({ name, country_id, city_id });
    return res
      .status(200)
      .json({ message: "location created successfully", data: location });
    // if(!name || !country_id || !city_id){
    //     return res.status(400).json({ message: "location name, country and city are required." });
    // }
  } catch (error) {
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

const updateLocations = async (req, res) => {
  try {
    const { id } = req.params;
    const requiredFields = ["name", "country_id", "city_id"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return (
        res.status(400).
        json({
          message: `Missing required field(s): ${missingFields.join(",")}`,
        })
      );
    }

    const {name, country_id, city_id } = req.body;

   const existingLocation = await locations.findOne({
      where: {
        name: {
            [Op.iLike]: name //exact match ignoring case
        }
      }
    });

     if (existingLocation) {
      return res.status(400).json({ message: "Location already exists" });
    }

    const [updated] = await locations.update({name, country_id, city_id}, {where: {id}});

    if(updated === 0){
        return res.status(404).json({message: "Location Not Found"});
    }
    return res.status(200).json({message: "Location updated"});

  } catch (error) {
    return errorResponse(res, getErrorCode(errorName.INTERNALSERVER));
  }
};

module.exports = {
  getLocations,
  createLocations,
  updateLocations,
};
