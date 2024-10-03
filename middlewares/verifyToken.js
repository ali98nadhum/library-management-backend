const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


module.exports.verifyToken = asyncHandler(async(req , res , next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token){
        return res.status(401).json({message: "قم بتسجيل الدخول"})
    }

    const decoded = jwt.verify(token , process.env.JWT_SECRET)
    next()
})