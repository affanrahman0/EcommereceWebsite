const ErrorHandler = require("../utils/errorHandlers");
const asyncErrors = require("../middleware/AsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/JWTtoken");
const sendMail = require("../utils/sendEmail");
const crypto = require("crypto")
const cloudinary = require("cloudinary");


exports.registerUser = asyncErrors(async (req,res,next) =>{
    //the user is trying to upload an image through an api call. It's present in the users req.body.avatar. The below func is used to upload the image in the cloudinary. The 2nd parameter is specifying folder and other things in the cloudinary. After successful uploading its returning an object with some member variables like (public_id, secure_url)
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
    
    const {name, email , password, role} = req.body;
    //console.log()
    const user = await User.create({
        name, email, password, role,
        avatar:{
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        }
    });
     
    // Generate a JWT token for the user and store it in the cookie
    sendToken(user,201,res)
});

//login user
exports.loginUser = asyncErrors(async (req,res,next) =>{

    const {email, password} = req.body
    
    //Check if email and password are provided
    if(!email || !password) return next(new ErrorHandler("Please enter your email and password",400))


    //The select("+password") part is used to include the password field (which is usually excluded by default) so that it can be used for password comparison.
    const user = await User.findOne({email}).select("+password")
    

    //If no user is found, return an error
    if(!user) return next(new ErrorHandler("Invalid email or password",401));

    const passwordMatched = await user.comparePassword(password)

    if(!passwordMatched) return next(new ErrorHandler("Invalid email or password",401));
    
    // Generate a JWT token for the user and store it in the cookie
    sendToken(user,200,res)

})

//log out
exports.logOutUser = asyncErrors(async (req,res,next) =>{
    res.cookie("token" , null ,{
        expires : new Date(Date.now()),
        httpOnly : true
    })
    res.status(200).json({
        success : true,
        message : "logged out successfully"
    })
})

//forgot password
exports.forgotPassword = asyncErrors(async (req,res,next) =>{

    const user  = await User.findOne({email : req.body.email})

    if(!user) return next(new ErrorHandler("User not found",404))


    const resetToken = user.getResetPasswordToken() //defined models/userModel

    await user.save({validateBeforeSave : false}) //in getResetPasswordtoken() we are changing some variables of user, those are needed to be updated in the database 

    const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`

    const message = `Follow the url to reset your password : \n\n ${resetPasswordUrl} \n\n If u haven't requested it , ignore it `

   try {
    //defined in utils/sendEmail
    await sendMail({
        email : user.email,
        subject : `Password Recovery`,
        message

    })
    res.status(201).json({
        success: true,
        message : `mail sent to ${user.email} successfully`
    })
    
   } catch (error) {
    //in getResetPasswordtoken() we were changing some variables of user, those were also  updated in the database on failure/success they need to be assigned their original value and update the database
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({validateBeforeSave : false})

    return next(new ErrorHandler(error.message,500))
    
   }
})

//reset password
exports.resetPassword = asyncErrors(async (req,res,next) =>{

    //console.log(req.params.token)
    
    resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")



    const user  = await User.findOne({
        resetPasswordToken, 
        resetPasswordExpire: { $gt: Date.now() }
    })

    if(!user) return next(new ErrorHandler("Reset password token is invalid or has expired", 404))
   
    if(req.body.password!=req.body.confirmPassword) return next(new ErrorHandler("Password doesn't match", 400))


    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined


    await user.save()
    sendToken(user,200,res) // store cookies
})


//get profile details of your own
exports.getUserDetails = asyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id)

    res.status(200).json({
        success : true,
        user
    })
})


//update password after log in 
exports.updatePassword = asyncErrors(async(req,res,next) =>{
    
    const user = await User.findById(req.user.id).select("+password")
    
    const passwordMatched = await user.comparePassword(req.body.password)
    
    if(!passwordMatched) return next(new ErrorHandler("Wrong Password",401));
   
    if(req.body.newPassword != req.body.confirmPassword) return next(new ErrorHandler("Password doesn't match"))
    
    user.password = req.body.newPassword

    await user.save()
    sendToken(user,200,res) // store cookies
})


//Update Profile (not password)
exports.updateProfile = asyncErrors(async(req,res,next) =>{

    updatedData = {
        name : req.body.name,
        email : req.body.email
    }
    if(req.body.avatar !=="")
    {
        const user = await User.findById(req.user.id)
        const imageId = user.avatar.public_id;

        await cloudinary.v2.uploader.destroy(imageId);
    
        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
          folder: "avatars",
          width: 150,
          crop: "scale",
        });
    
        updatedData.avatar = {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id,updatedData,{
        new: true,
        runValidators : true,
        useFindAndModify : false
    })

    res.status(200).json({
        success: true,
        user
    })

})

//get details of all users (admin)

exports.getAllUsersDetails = asyncErrors(async (req,res,next) =>{

    const users = await User.find()

    res.status(200).json({
        success : true,
        users
    })
})

//get Detail of an user by ID (admin)

exports.getOneUserDetails = asyncErrors(async (req,res,next) =>{

    const user = await User.findById(req.params.id)

    if(!user) return next(new ErrorHandler("User not found" , 400));

    res.status(200).json({
        success : true ,
        user 
    })
})


//update roles --admin
exports.updateRole = asyncErrors(async(req,res,next) =>{

    updatedData = {
        name : req.body.name,
        email : req.body.email,
        role : req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id,updatedData,{
        new: true,
        runValidators : true,
        useFindAndModify : false
    })

    if(!user) return next(new ErrorHandler("user not found",400))

    res.status(200).json({
        success: true,
        user
    })

})


//delete user --admin

exports.deleteUser = asyncErrors(async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler("User not found", 400));
        }
        user.deleteOne() // Make sure the user object is a Mongoose document

        res.status(200).json({
            success: true,
            message :"Deleted Successfully"
        });
    } catch (error) {
        next(error); // Pass the error to the next error handler
    }
});

