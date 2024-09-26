const mongoose = require("mongoose");
const joi = require("joi");


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 1024
    }
},{timestamps: true})


const UserModel= mongoose.model("UserModel", UserSchema);


module.exports = {
    UserModel,
}