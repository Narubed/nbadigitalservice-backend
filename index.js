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
const representativeRoutes = require("./routes/representatives")

const { google } = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
    version: "v3",
    auth: oauth2Client,
});
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

// const filePath = path.join(__dirname, 'NBA2.png')


async function uploadFile(req, res) {
    // const filePath = req.file.path;
    const filePath = path.join(__dirname, 'NBA2.png')
    let fileMetaData = {
        // name: req.file.originalname,
        parents: ["1_UNPHTT6Q9ZPrzWQMHmWTKES8KOreGb8"],
    };
    let media = {
        body: fs.createReadStream(filePath),
    };
    try {
        const response = await drive.files.create({
            resource: fileMetaData,
            media: media,
        });
        console.log(response.data)
        generatePublicUrl(response.data.id);
    } catch (error) {
        console.log(error.massage);
    }
}
async function generatePublicUrl(res) {
    console.log(res);
    try {
        const fileId = res;
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: "reader",
                type: "anyone",
            },
        });
        const result = await drive.files.get({
            fileId: fileId,
            fields: "webViewLink, webContentLink",
        });
        console.log(result.data);
    } catch (error) {
        console.log(error.message);
    }
}
// uploadFile()
const port = process.env.PORT || 8080;
app.listen(port, console.log(`Listening on port ${port}...`));
