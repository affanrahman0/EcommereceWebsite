const mongoose  = require("mongoose")


// mongodb://localhost:27017/Ecommerce
//Ecommerce is the name of the database
// 27017  is the default port number at which MongoDB listens for incoming connections. 
// localhost is the hostname of the machine where the MongoDB server is running. In this case, it's set to "localhost," which means the MongoDB server is expected to be running on the same machine as the application that's trying to connect to it.


const connectDatabase = () =>{
    console.log(process.env.DB_URI)
    mongoose.connect(process.env.DB_URI,{useNewUrlParser: true,useUnifiedTopology : true}).then((data)=>{
        console.log(`connected with server : ${data.connection.host}`)
})
}

module.exports = connectDatabase