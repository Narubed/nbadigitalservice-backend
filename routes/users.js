const router = require("express").Router();
// const { User, validate } = require("../models/user");
// const bcrypt = require("bcrypt");

const users = require("../controllers/user.controller")

router.post("/", users.create)

router.get("/", users.findAll);

router.get("/:id", users.findOne);

router.put("/:id", users.update);

router.delete("/:id", users.delete);

router.delete("/all", users.deleteAll);

module.exports = router;
