const router = require("express").Router();
const first = require("../controllers/first.page.controller");

router.get("/", first.findAll);
router.get("/:id", first.findOne);

router.post("/", first.create);

router.delete("/:id", first.delete);
router.put("/:id", first.update);

module.exports = router;
