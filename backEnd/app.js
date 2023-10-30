const express = require("express")
const app = express();
const cookie = require("cookie-parser")

const ErrorMiddleWare = require("./middleware/error")


// It's used to parse incoming JSON data from request bodies (usually a POST or PUT request), this middleware will parse that JSON data and make it available in the req.body
app.use(express.json())
app.use(cookie())


//route Imports
const product = require("./routes/productRoute")
const user = require("./routes/userRouter")
const order = require("./routes/orderRoute")


//In Express.js, the app.use() function is used to add middleware to your application's request . Middleware functions in Express are functions that have access to the request (req), response (res), and next function. They can perform various tasks such as modifying the request or response, handling errors, and more.

app.use("/api/v1",product) // /api/vi path is added additionaly , all the routes defined in producRoutes file can be accessed by adding this prefix to it.
app.use("/api/v1",user)
app.use("/api/v1",order)

//middleware for error handling
//this makes sure that our req res cycle goes through middleware/error.js
app.use(ErrorMiddleWare) //Here err  is the error object (errorHandler) that was passed to next() . It extracts the status code and message from the error object and sends an appropriate response to the client


module.exports = app