const router = require("express").Router();
const {createBook, getAllBook, getBookById, deleteBook} = require("../controllers/BookController");
const photoUpload = require("../middlewares/photoUpload");




router.route("/")
.post(photoUpload.single("image") , createBook)
.get(getAllBook)

router.route("/:id")
.get(getBookById)
.delete(deleteBook)


module.exports = router;