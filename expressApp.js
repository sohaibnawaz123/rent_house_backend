const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const multer = require("multer");
const path = require("path");
const app = express();

const parseTrustProxy = (value) => {
  if (value === undefined) return 1;
  if (value === "true") return true;
  if (value === "false") return false;

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? value : numericValue;
};

function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size should not exceed 10MB",
      });
    }

    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        message: `Unexpected file field${err.field ? `: ${err.field}` : ""}`,
      });
    }

    return res.status(400).json({ message: err.message });
  }

  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ message: err.message });
  }

  next(err);
}

function setupApp() {
  app.set("trust proxy", parseTrustProxy(process.env.TRUST_PROXY));

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
  app.use("/property-images", express.static("public/property-images"));
}
setupApp();
app.multerErrorHandler = multerErrorHandler;
module.exports = app;
