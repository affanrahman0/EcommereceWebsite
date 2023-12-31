const ErrorHandler = require("../utils/errorHandlers"); 


module.exports = (err,req,res,next) =>{

    statusCode = err.statusCode || 500
    message = err.message || "Internal Server Error"

    //mongodb id error.Change in  format or length of id will result in this king of error
    if(err.name == "CastError"){
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);
    }
    

    //mongodb duplicate key error (for unique fields)
    if(err.code == 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message,400);
    }

    if(err.name == "jsonWebTokenError"){
        const message = `Json web token is invalid . Try again`;
        err = new ErrorHandler(message,400);
    }

    if(err.name == "TokenExpiredError"){
        const message = `Json web token is invalid . Try again`;
        err = new ErrorHandler(message,400);
    }
    
    

    res.status(statusCode).json({
        success : false,
        message : err.message
    })

}