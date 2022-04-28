const router = require("express").Router();
// const { User, validate } = require("../models/user");
// const bcrypt = require("bcrypt");

const representatives = require("../controllers/representative.controller")

router.post("/", representatives.create)

router.get("/", representatives.findAll);

router.put("/:id", representatives.update);

router.get("/:id", representatives.findOne);


router.delete("/:id", representatives.delete);

// router.delete("/all", users.deleteAll);

module.exports = router;
