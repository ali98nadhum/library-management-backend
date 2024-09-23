const mongoose = require("mongoose");
const joi = require("joi");

// Book schema
const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 50,
    },

    author: {
      type: String,
      minlength: 5,
      maxlength: 50,
    },

    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    bookststatus: {
      type: String,
      required: true,
      enum: ["مستعمل", "جديد"],
    },

    totalpage: {
      type: Number,
      required: true,
    },

    publishedDate: {
      type: Number,
    },

    image: {
      type: Object,
      required: [true, "الصوره مطلوبه"],
      default: {
        url: "",
        publicId: null,
      },
    },
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "CategoryModel",
      required: true,
    },
  },
  { timestamps: true }
);

const BookModel = mongoose.model("BookModel", BookSchema);


function ValidateCreateBook(obj) {
    const schema = joi.object({
        title: joi.string()
            .min(3)
            .max(50)
            .required()
            .messages({
                'string.empty': 'عنوان الكتاب مطلوب',
                'string.min': 'عنوان الكتاب يجب أن يتكون من 3 أحرف على الأقل',
                'string.max': 'عنوان الكتاب يجب أن لا يتجاوز 50 حرفًا',
            }),
        
        author: joi.string()
            .min(5)
            .max(50)
            .messages({
                'string.min': 'اسم المؤلف يجب أن يتكون من 5 أحرف على الأقل',
                'string.max': 'اسم المؤلف يجب أن لا يتجاوز 50 حرفًا',
            }),
        
        price: joi.number()
            .required()
            .messages({
                'number.base': 'السعر مطلوب ويجب أن يكون رقمًا',
            }),

        quantity: joi.number()
            .required()
            .messages({
                'number.base': 'الكمية مطلوبة ويجب أن تكون رقمًا',
            }),

        bookststatus: joi.string()
            .valid("مستعمل", "جديد")
            .required()
            .messages({
                'any.only': 'حالة الكتاب يجب أن تكون "مستعمل" أو "جديد"',
            }),

        totalpage: joi.number()
            .required()
            .messages({
                'number.base': 'عدد الصفحات مطلوب ويجب أن يكون رقمًا',
            }),

        publishedDate: joi.number()
            .messages({
                'number.base': 'تاريخ النشر يجب أن يكون رقمًا',
            }),

        category: joi.string()
            .required()
            .messages({
                'string.empty': 'الفئة مطلوبة',
            }),
    });

    return schema.validate(obj);
}

function ValidateUpdateBook(obj) {
    const schema = joi.object({
        title: joi.string()
            .min(3)
            .max(50)
            .messages({
                'string.min': 'عنوان الكتاب يجب أن يتكون من 3 أحرف على الأقل',
                'string.max': 'عنوان الكتاب يجب أن لا يتجاوز 50 حرفًا',
            }),
        
        author: joi.string()
            .min(5)
            .max(50)
            .messages({
                'string.min': 'اسم المؤلف يجب أن يتكون من 5 أحرف على الأقل',
                'string.max': 'اسم المؤلف يجب أن لا يتجاوز 50 حرفًا',
            }),

        bookststatus: joi.string()
            .valid("مستعمل", "جديد")
            .messages({
                'any.only': 'حالة الكتاب يجب أن تكون "مستعمل" أو "جديد"',
            }),

        totalpage: joi.number()
            .messages({
                'number.base': 'عدد الصفحات مطلوب ويجب أن يكون رقمًا',
            }),

        publishedDate: joi.number()
            .messages({
                'number.base': 'تاريخ النشر يجب أن يكون رقمًا',
            }),

        category: joi.string()
            .messages({
                'string.empty': 'الفئة مطلوبة',
            }),
    });

    return schema.validate(obj);
}

module.exports = {
    BookModel,
    ValidateCreateBook,
};


