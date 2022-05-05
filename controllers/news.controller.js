

const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { News, validate } = require("../models/news.model");
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
        News.find()
            .then(data => {
                console.log(data)
                res.send({ data, message: 'success News' });
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while News."
                });
            });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

exports.delete = (req, res) => {
    const id = req.params.id;
    console.log(id);
    News.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: `Cannot delete News with id=${id}. Maybe News was not found!`
                });
            } else {
                res.send({
                    message: "News was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete News with id=" + id
            });
        });
};
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
        console.log(Date.now());
    },
});

exports.create = async (req, res) => {
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
            console.log(req.body);
            uploadFileCreate(req, res);
        });

        async function uploadFileCreate(req, res) {
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
                const { error } = validate(req.body);
                if (error)
                    return res.status(400).send({ message: error.details[0].message });
                await new News({ ...req.body, news_image: response.data.id }).save();
                res.status(201).send({ message: "News created successfully" });
            } catch (error) {
                res.status(500).send({ message: "Internal Server Error" });
            }
        };
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
        console.log(result.data);
    } catch (error) {
        console.log(error.message);
    }
}