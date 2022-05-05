const router = require("express").Router();
// const { User, validate } = require("../models/user");
// const bcrypt = require("bcrypt");

const news = require("../controllers/news.controller")

router.post("/", news.create)

router.get("/", news.findAll);

// router.get("/:id", users.findOne);

// router.put("/:id", transports.update);

router.delete("/:id", news.delete);

// router.delete("/all", users.deleteAll);

module.exports = router;
