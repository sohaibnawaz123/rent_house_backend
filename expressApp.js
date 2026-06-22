const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const path = require("path");
const app = express();

function setupApp() {
  // Apply rate limiting middleware
  app.use(
    rateLimit({
      windowMs: 2 * 60 * 1000,
      max: 100,
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
      },
    })
  );
  app.use(compression());
  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
  app.use("/public", express.static(__dirname + "/public"));
  app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
          message: "File size should not exceed 10MB",
        });
      } else if (err.name === "MulterError") {
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
          return res.status(400).json({
            message: "Unexpected field in form data",
          });
        }
      }
      return res.status(400).json({ message: err.message });
    }
    next(err);
  });
}
setupApp();
module.exports = app;