
//this function is taking another function (thefunc) as parameter , first it's trying to execute the func through resolve method, upon failing it's calling the catch block to take over

module.exports = (thefunc) => (req,res,next) =>{
    Promise.resolve(thefunc(req,res,next)).catch(next)
}