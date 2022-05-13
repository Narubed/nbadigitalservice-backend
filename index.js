require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const connection = require("./config/db");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const deleteImage = require("./routes/deleteImage");
const transportsRoutes = require("./routes/transports");
const representativeRoutes = require("./routes/representatives");
const newsRoutes = require("./routes/news");
const advertRoutes = require("./routes/advert");

// const { google } = require("googleapis");
// const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
// const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
// const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
// const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

// const oauth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     REDIRECT_URI
// );
// oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// const drive = google.drive({
//     version: "v3",
//     auth: oauth2Client,
// });

// database connection
connection();

// middlewares
app.use(express.json());
app.use(cors());

// routes
app.use("/api/nbadigitalservice/deleteImage", deleteImage);
app.use("/api/nbadigitalservice/auth", authRoutes);
app.use("/api/nbadigitalservice/users", userRoutes);
app.use("/api/nbadigitalservice/transports", transportsRoutes);
app.use("/api/nbadigitalservice/representatives", representativeRoutes);
app.use("/api/nbadigitalservice/news", newsRoutes)
app.use("/api/nbadigitalservice/advert", advertRoutes)
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
