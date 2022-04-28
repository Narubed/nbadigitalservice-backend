const router = require("express").Router();
// const { User, validate } = require("../models/user");
// const bcrypt = require("bcrypt");

const transports = require("../controllers/transport.controller")

// router.post("/", users.create)

router.get("/", transports.findAll);

// router.get("/:id", users.findOne);

router.put("/:id", transports.update);

// router.delete("/:id", users.delete);

// router.delete("/all", users.deleteAll);

module.exports = router;
