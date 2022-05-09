

const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Advert, validate } = require("../models/advert.model");
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


exports.findAll = (req, res) => {
    try {
        Advert.find()
            .then(data => {
                res.send({ data, message: 'success' });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving tutorials."
                });
            });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

exports.update = async (req, res) => {
    try {
        let upload = multer({ storage: storage }).single("avatar");
        upload(req, res, function (err) {
            if (!req.file) {
                return res.send("Please select an image to upload");
            } else if (err instanceof multer.MulterError) {
                return res.send(err);
            } else if (err) {
                return res.send(err);
            }
            uploadFile(req, res);
        });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};
async function uploadFile(req, res) {
    const filePath = req.file.path;
    let fileMetaData = {
        name: req.file.originalname,
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
        generatePublicUrl(response.data.id);
        const id = req.params.id
        Advert.findByIdAndUpdate(id,({ ...req.body, advert_image: response.data.id }), { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot update Advert with id=${id}. Maybe Advert was not found!`
                });
            } else res.send({ message: "Advert was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Advert with id=" + id
            });
        });
    } catch (error) {
        console.log(error.massage);
    }
}
async function generatePublicUrl(res) {
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
    } catch (error) {
        console.log(error.message);
    }
}

