const router = require("express").Router();
const {createCategory, getAllCategory, deleteCategory} = require("../controllers/CategoryController");

router.route("/")
.post(createCategory)
.get(getAllCategory)

router.route("/:id")
.delete(deleteCategory)

module.exports = router;