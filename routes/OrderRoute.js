const router = require("express").Router();
const {createOrder, getAllOrder} = require("../controllers/OrderController")


router.route("/")
.post(createOrder)
.get(getAllOrder)



module.exports = router;