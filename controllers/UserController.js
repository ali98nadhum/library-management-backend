const asyncHandler = require("express-async-handler");
const {UserModel}  = require("../models/UserModel");



// ==================================
// @desc Create a new User
// @route /api/user/add-user
// @method POST
// @access private (only admin)
// ==================================
