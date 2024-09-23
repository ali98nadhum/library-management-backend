const router = require("express").Router();
const {createCategory, getAllCategory, deleteCategory, getOneCategory , updateCategory} = require("../controllers/CategoryController");

router.route("/")
.get(getAllCategory)
.post(createCategory)


router.route("/:id")
.get(getOneCategory)
.patch(updateCategory)
.delete(deleteCategory)


module.exports = router;