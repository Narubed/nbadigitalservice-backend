require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const connection = require("./config/db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const deleteImage = require("./routes/deleteImage");
const representativeRoutes = require("./routes/representatives");
const newsRoutes = require("./routes/news");
const advertRoutes = require("./routes/advert");
connection();

// middlewares

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("src"));
app.use("/api/nbadigitalservice/static", express.static("src"));
// routes
// routes
app.use("/api/nbadigitalservice/first-page", require("./routes/first.page"));
app.use(
  "/api/nbadigitalservice/images/first-page",
  require("./routes/images.first.page")
);

app.use("/api/nbadigitalservice/deleteImage", deleteImage);
app.use("/api/nbadigitalservice/auth", authRoutes);
app.use("/api/nbadigitalservice/users", userRoutes);
app.use("/api/nbadigitalservice/representatives", representativeRoutes);
app.use("/api/nbadigitalservice/news", newsRoutes);
app.use("/api/nbadigitalservice/advert", advertRoutes);
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
