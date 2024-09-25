const mongoose = require("mongoose");
const joi = require("joi");


// Order Schema
const OrderSchema = new mongoose.Schema({
    custmerName: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },

    status: { 
        type: String, 
        required: true,
        enum: ['جاري التجهيز', 'تم التجهيز' , 'تم الالغاء'], 
        default: 'جاري التجهيز' 
    },

    totalPrice:{
        type: Number,
        required: true
    },

    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BookModel',
        required: true
    }]
} , {timestamps:true})


const OrderModel = mongoose.model("OrderModel", OrderSchema);

module.exports = {
    OrderModel
}
