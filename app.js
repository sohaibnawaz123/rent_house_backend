require("dotenv").config();
const createHttpServer = require("./httpServer.js");
const app = require("./expressApp.js");
const fs = require("fs");
const mainRouter = require("./app_backend/routes/routes.js"); // Import the main router
const path = require("path");
const baseDirectory = "public";
const directories = {
  user: [],
  logistic: [],
  business: [],
  "property-images": []
};
for (const [mainDir, subDirs] of Object.entries(directories)) {
  const mainPath = path.join(__dirname, baseDirectory, mainDir);
  // Create main directory if it doesn't exist
  if (!fs.existsSync(mainPath)) {
    fs.mkdirSync(mainPath, { recursive: true });
    console.log(`Created: ${mainPath}`);
  }
  // Create subdirectories
  for (const subDir of subDirs) {
    const subPath = path.join(mainPath, subDir);
    if (!fs.existsSync(subPath)) {
      fs.mkdirSync(subPath, { recursive: true });
      console.log(`Created: ${subPath}`);
    }
  }
}
// === Step 2: Express Middleware & Routes ===
app.use("/api", mainRouter);
app.use(app.multerErrorHandler);
app.get("/", (req, res) => { res.status(200).send("Hously-Backend") });
(async () => {
  try {
    const httpServer = createHttpServer(app);
    const PORT = process.env.PORT || 9090;
    const HOST = process.env.LOCAL_IP || "http://192.168.0.106";
    await new Promise((resolve, reject) =>
      httpServer.listen(PORT, (err) => {
        if (err) return reject(err);
        resolve();
      })
    );
    console.log(` Server ready at ${HOST}:${PORT || 9090}`);
  } catch (err) {
    console.error(`Server error: ${err.message}`);
  }
})();
