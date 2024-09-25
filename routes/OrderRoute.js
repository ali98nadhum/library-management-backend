const router = require("express").Router();
const {createOrder, getAllOrder, getOrderById} = require("../controllers/OrderController")


router.route("/")
.post(createOrder)
.get(getAllOrder)

router.route("/:id")
.get(getOrderById)

module.exports = router;