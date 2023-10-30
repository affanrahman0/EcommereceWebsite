const app = require("./app")

// using dotenv, you can ensure that sensitive information is kept separate from your codebase and provide a more secure and manageable way to handle configuration settings for your application, such as port no, apikey,url etc
// it allows you to load environment variables from a .env file into the process.env object. In your application's entry point (such as index.js), require and configure dotenv to load the environment variables from the .env file:. Then it can be used from any where
const dotenv = require("dotenv") 
const connectDatabase = require("./config/database")


//Handling Uncaught Excptions
//Errors Like use of undeclared variable will be caught here
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Closing the server due to Uncaught Exceptions");
    process.exit(1);
})


dotenv.config({path:"backEnd/config/config.env"})

connectDatabase()

//This method used to start a web server and listen for incoming HTTP requests on a specific port. 
const server = app.listen(process.env.PORT, ()=>{

    console.log(`Server is running on http://localhost:${process.env.PORT}`)
})


//unhandled promise rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Closing the server due to unhandled promise rejection");

    server.close(()=>{
        process.exit(1)
    })
})