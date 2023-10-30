const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandlers");
const AsyncErrors = require("./AsyncErrors");
const User = require("../models/userModel")


exports.isAuthenticatiedUser = AsyncErrors(async (req, res, next) =>{

    const { token } = req.cookies

    if(!token) return next(new ErrorHandler("Please login to access this" , 401))

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)

    req.user = await User.findById(decodedData.id) //req.user is any js object consisting of all details of an user

    next()

})

exports.authorizedRoles = (...roles) =>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)) next(new ErrorHandler(`Role : ${req.user.role} is not allowed to access this`, 404))
        return next()
    }
}