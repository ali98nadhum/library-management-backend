const router = require("express").Router();
const {createOrder} = require("../controllers/OrderController")


router.route("")
.post(createOrder)



module.exports = router;