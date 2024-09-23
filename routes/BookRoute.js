const router = require("express").Router();
const {createBook, getAllBook} = require("../controllers/BookController");
const photoUpload = require("../middlewares/photoUpload");




router.route("/")
.post(photoUpload.single("image") , createBook)
.get(getAllBook)


module.exports = router;