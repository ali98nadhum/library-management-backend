const router = require("express").Router();
const {createNewInvoice} = require("../controllers/InvoiceController")


router.route("/")
.post(createNewInvoice)


module.exports = router;