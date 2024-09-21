const router = require("express").Router();
const {createCategory} = require("../controllers/CategoryController");

router.route("/")
.post(createCategory)

module.exports = router;