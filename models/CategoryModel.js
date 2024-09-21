const mongoose = require("mongoose");
const joi = require("joi");

// Category Schema
const CategorySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique:true,
            minlength: 5,
            maxlength: 50
        },
    },
    {timestamps: true}
)

const CategoryModel = mongoose.model("CategoryModel" , CategorySchema);

function ValidateCreateCategory(obj) {
    const schema = joi.object({
        title: joi.string().trim().required().min(5).max(50).message({
            "string.base": `يجب ان تكون اسم الماده نص.`,
            "string.empty": `اسم الماده مطلوب.`,
            "string.min": `الاسم قصير جدا.`,
            "string.max": `الاسم طويل جدا.`,
            "any.required": `اسم الماده مطلوب.`
        })
    })

    return schema.validate(obj);
}

function ValidateUpdateCategory(obj) {
    const schema = joi.object({
        title: joi.string().trim().min(5).max(50).message({
            "string.base": `يجب ان تكون اسم الماده نص.`,
            "string.min": `الاسم قصير جدا.`,
            "string.max": `الاسم طويل جدا.`,
        })
    })

    return schema.validate(obj);
}


module.exports = {
    CategoryModel,
    ValidateCreateCategory,
    ValidateUpdateCategory,
}