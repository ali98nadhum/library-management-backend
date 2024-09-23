const router = require("express").Router();
const {createBook} = require("../controllers/BookController");
const photoUpload = require("../middlewares/photoUpload");




router.route("/")
.post(photoUpload.single("image") , createBook)


module.exports = router;