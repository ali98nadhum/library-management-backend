const router = require("express").Router();
const {createBook, getAllBook, getBookById, deleteBook, updateBook} = require("../controllers/BookController");
const photoUpload = require("../middlewares/photoUpload");




router.route("/")
.post(photoUpload.single("image") , createBook)
.get(getAllBook)

router.route("/:id")
.get(getBookById)
.delete(deleteBook)
.patch(photoUpload.single("image") , updateBook)


module.exports = router;