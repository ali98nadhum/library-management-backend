const router = require("express").Router();
const {createUser} = require("../controllers/UserController")


router.route("/add-user")
.post(createUser)



module.exports = router;