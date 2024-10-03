const router = require("express").Router();
const {createBook, getAllBook, getBookById, deleteBook, updateBook, searchBook} = require("../controllers/BookController");
const photoUpload = require("../middlewares/photoUpload");
const {verifyToken} = require("../middlewares/verifyToken")




router.route("/")
.post(photoUpload.single("image") , createBook)
.get(verifyToken ,getAllBook)

router.route("/:id")
.get(getBookById)
.delete(deleteBook)
.patch(photoUpload.single("image") , updateBook)

router.route("/books/search")
.get(searchBook)


module.exports = router;