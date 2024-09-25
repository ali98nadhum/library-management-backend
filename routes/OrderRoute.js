const router = require("express").Router();
const {createOrder, getAllOrder, getOrderById, deleteOrder} = require("../controllers/OrderController")


router.route("/")
.post(createOrder)
.get(getAllOrder)

router.route("/:id")
.get(getOrderById)
.delete(deleteOrder)

module.exports = router;