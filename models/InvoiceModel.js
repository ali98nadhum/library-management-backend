const mongoose = require("mongoose");
const joi = require("joi");

const InvoiceSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrderModel",
      required: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    paid: {
      type: String,
      required: true,
      enum: ["مدفوع", "الدفع عن الاستلام"],
    },
  },
  { timestamps: true }
);


const InvoiceModel= mongoose.model("invoiceModel", InvoiceSchema);




module.exports = {
    InvoiceModel
}