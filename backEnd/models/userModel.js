const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        minLength: [4, "Name must be more than 4 characters"],
        maxLength: [20, "Name must be within 20 characters"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minLength: [8, "Password must be atleast 8 characters"],
        select: false
    },
    avatar: {

        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },

    role: {
        type : String,
        default : "user"
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date
});



//This is a pre-save middleware function that will be executed before saving a document of the user schema to the database.
userSchema.pre("save", async function (next){

    //If the password hasn't been modified (for example, when updating other fields), the middleware will skip processing and move to the next middleware or save operation.
    if(!this.isModified("password")){
        next(); 
    }

    this.password = await bcrypt.hash(this.password,10); //10 determines the complexity of hash calculation

});

//if a function is defined with arrow function
//this method generates a JWT token for a user document with the user's _id . The token is signed using a secret key and has an expiration time defined by the JWT_EXPIRE environment variable.
userSchema.methods.getJWTToken = function () {
    return jwt.sign({id : this._id} ,process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRE
    })
}

//authenticate password
userSchema.methods.comparePassword = async function (password) {
    
    return await bcrypt.compare(password,this.password)
}

//generating reset password token
userSchema.methods.getResetPasswordToken = function() {

    //This line generates a random sequence of bytes (length: 20) and then converts it into a hexadecimal string. This token will serve as the unique identifier for the password reset request.
    const resetToken = crypto.randomBytes(20).toString("hex")

    
    

    //resetToken is hashed using the SHA-256 algorithm. The resulting hash is stored in the resetPasswordToken field of the user's document in the database. Storing the hash rather than the original token adds an extra layer of security.The digest function is used to compute the final hash value after feeding the input data into a hash function
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")

    this.resetPasswordExpire = Date.now() + 15* 60 * 1000


    return resetToken

}

module.exports = mongoose.model("User",userSchema)