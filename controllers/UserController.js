const asyncHandler = require("express-async-handler");
const {UserModel}  = require("../models/UserModel");



// ==================================
// @desc Create a new User
// @route /api/user/add-user
// @method POST
// @access private (only admin)
// ==================================
module.exports.createUser = asyncHandler(async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "المستخدم مسجل بالفعل" });
    }

    const newUser = await UserModel.create(req.body);
    res.status(201).json({ message: "تم إضافة المستخدم بنجاح", user: newUser });
});
