const router = require("express").Router();
const {createNewInvoice, deleteInvoice} = require("../controllers/InvoiceController")


router.route("/")
.post(createNewInvoice)

router.route("/:id")
.delete(deleteInvoice)


module.exports = router;