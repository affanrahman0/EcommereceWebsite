// After a user successfully logs in, a JWT token is generated. This token contains information about the user's identity and authentication status. Rather than sending the JWT token directly in the response body, the code stores it in a secure HTTP cookie named "token."

// When the browser receives the cookie from the server, it automatically includes the cookie in all subsequent requests to the same domain. This means that with each request to your server, the JWT token is sent along as a cookie.

// The server can read the JWT token from the cookie included in the request header.
// The server can then verify the token's authenticity and extract information from it to determine the user's identity and permissions. This process allows the server to authenticate the user and authorize access to protected routes or resources.
// Stateless Authentication:

// By using cookies to store the JWT token, the server can maintain authentication state without relying on server-side sessions or databases. This is often referred to as "stateless authentication" because the server doesn't need to remember individual user sessions.

// httpOnly flag is set to true, which means the cookie is only accessible via HTTP(S) requests and cannot be accessed through JavaScript in the browser. This enhances security by preventing client-side scripts from accessing the cookie.





const sendToken = (user, statusCode, res) => {
    const token = user.getJWTToken() //this token is generated only after successfull verification
    
    //The options object contains settings for the cookie.
    const options = {
        expires : new Date(
            Date.now() + process.env.Expire_Cookie * 24 * 60 * 60 * 1000 //converting to miliseconds
        ),
        httpOnly : true
    }
    
    //The res.cookie() method is used to set the cookie in the response. here we are setting the cookie name as token and we are storing the generated token . Option is the setting of the cookie
    res.status(statusCode).cookie("token", token,options).json({
        success : true,
        user,
        token
    })
}

module.exports = sendToken