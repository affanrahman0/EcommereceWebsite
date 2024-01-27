// http://localhost:4000/api/v1/products?keywords=guava // anything after ? is the querystr and query is an instance of product defined by the monggose schema 
//If the value associated with key is a primitive type (e.g., a string, number, boolean), modifying the value in the shallow copy will not affect the original object. This is because primitive values are copied by value, and changes in the copy do not impact the original. but if the value of key is another nested object,it's value will be changed on modifying the copied nested object 
class ApiFeatures {
    constructor(query, querystr) {
        this.query = query
        this.querystr = querystr
    }
    //We could have directlty searched using qyuery.find({name : "apple"}) but this will return us only those item that will match exactly with name but here all keywords that has apple as prefix will also be returned
    search() {
        
        const keyword = this.querystr.keyword ? {
            name: {
                $regex: this.querystr.keyword,
                $options: "i" //case insensitive
            }
        }
            : {


            }
        
        console.log(keyword)    
        this.query = this.query.find({...keyword}) // storing the resultant product in this.query and return the object. (...keyword) means creating a shallow copy of keyword
        return this   
    }
    filter()
    {
        const queryCopy = {...this.querystr} // using shallowcopy otherwise it will be a refrence

        const removeFields = ["keyword","page","limit"];
        
        //we are removing the keys from queryCopy only since its a shallow copy, this.querstr remains same
        removeFields.forEach((key) => delete queryCopy[key])


        console.log(queryCopy)

        //filters for price and ratings in a range
        let queryString = JSON.stringify(queryCopy) //converting into string
        
        // //every attribute of mongodb objects have $ in the starting of their name, so we are adding one after converting them into string
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g,(key) => `$${key}`)
        

        this.query = this.query.find(JSON.parse(queryString)) //this case sensitive search
        
       // console.log(queryString)

        return this;
    }
    pagination(pagesPerResult) // no .of products to be displayed per page
    {
        const currentPages = Number(this.querystr.page) || 1

        const skip = pagesPerResult * (currentPages - 1) // no. of products to be skipped before start displaying in a particular page 

        this.query = this.query.limit(pagesPerResult).skip(skip) 

        return this;
    }
};

module.exports = ApiFeatures