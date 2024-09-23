const router = require("express").Router();
const {createCategory, getAllCategory, deleteCategory, getOneCategory} = require("../controllers/CategoryController");

router.route("/")
.post(createCategory)
.get(getAllCategory)


router.route("/:id")
.delete(deleteCategory)
.get(getOneCategory);


module.exports = router;