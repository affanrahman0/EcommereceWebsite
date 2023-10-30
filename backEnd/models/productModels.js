const mongoose  = require("mongoose")



//creating schema of products
const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Please enter product name"],
        trim : true
    },
    description:{
        type: String,
        required: [true,"PLease enter product description"]
    },
    price:{
        type: Number,
        required : [true,"Please enter product price"],
        maxLength : [8,"Price can't exceed 8 characters"]
    },
    ratings:{
        type: Number,
        default: 0
    },
    images:[
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],
    category:{
        type: String,
        required : true
    },
    stocks:{
        type: Number,
        required : [true, "Please enter the no. of product available in the stock"],
        default : 1
    },
    numOfreviews:{
        type: Number,
        default : 0
    },
    reviews:[
        {
            user :{
                type : mongoose.Schema.ObjectId,
                ref : "User",
                required : true
            },
            name:{
                type: String,
                required: true
            },
            rating:{//ratings provided by individual customer
                type: Number,
                required: true
            },
            Comment:{
                type: String,
                required: true
            }
        }
    ],
    user :{
        type : mongoose.Schema.ObjectId,
        ref : "User",
        required : true
    },
    createdAT:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("product",productSchema)