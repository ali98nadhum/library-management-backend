const router = require("express").Router();
const {createCategory, getAllCategory} = require("../controllers/CategoryController");

router.route("/")
.post(createCategory)
.get(getAllCategory)

module.exports = router;