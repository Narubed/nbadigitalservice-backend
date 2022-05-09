const router = require("express").Router();

const advert = require("../controllers/advert.controller")

router.get("/", advert.findAll);

router.put("/:id", advert.update);

module.exports = router;
