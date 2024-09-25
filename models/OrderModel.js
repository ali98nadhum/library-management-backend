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


const validateCreateOrder = (orderData) => {
    const schema = joi.object({
        custmerName: joi.string()
            .min(5)
            .max(50)
            .required()
            .messages({
                'string.base': 'اسم العميل يجب أن يكون نصًا.',
                'string.empty': 'اسم العميل مطلوب.',
                'string.min': 'اسم العميل يجب أن يحتوي على 5 أحرف على الأقل.',
                'string.max': 'اسم العميل يجب ألا يزيد عن 50 حرفًا.',
                'any.required': 'اسم العميل مطلوب.'
            }),
        status: joi.string()
            .valid('جاري التجهيز', 'تم التجهيز', 'تم الالغاء')
            .default('جاري التجهيز')
            .messages({
                'any.only': 'الحالة يجب أن تكون إما "جاري التجهيز" أو "تم التجهيز" أو "تم الالغاء".',
            }),
        totalPrice: joi.number(),
        books: joi.array()
            .items(joi.string().regex(/^[0-9a-fA-F]{24}$/).messages({
                'string.pattern.base': 'معرّف الكتاب غير صالح. يجب أن يكون من نوع ObjectId.',
                'string.base': 'معرّف الكتاب يجب أن يكون نصًا.'
            }))
            .required()
            .messages({
                'array.base': 'الكتب يجب أن تكون في شكل مصفوفة.',
                'any.required': 'قائمة الكتب مطلوبة.'
            })
    });

    return schema.validate(orderData, { abortEarly: false }); // استخدام abortEarly: false لعرض جميع الأخطاء بدلاً من التوقف عند أول خطأ
};

module.exports = {
    OrderModel,
    validateCreateOrder
}
