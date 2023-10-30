const Product = require("../models/productModels")
const Order = require("../models/orderModel")
const ErrorHandler = require("../utils/errorHandlers");
const asyncErrors = require("../middleware/AsyncErrors");

//create order
exports.newOrder = asyncErrors(async (req,res,next) =>{
    const {
        shippingInfo ,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    const order = await Order.create({
        shippingInfo ,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        user : req.user.id,
        paidAt : Date.now()
        
    })

    res.status(200).json({
            success : true,
            order
    })
})

//get single order by id 
exports.getSingleOrder = asyncErrors(async(req,res,next) =>{

    const order = await Order.findById(req.params.id).populate("user" ,"name email") //populate function finds the corresponding name and email associated with the id. Here the user fiekd stores the user id

    if(!order) return next(new ErrorHandler("Order not found",404))

    res.status(200).json({
        success : true,
        order
    })


})

//get all orders of a user
exports.myOrder = asyncErrors(async(req,res,next) =>{
    const orders = await Order.find({user :req.user._id})

    if(!orders) return next(new ErrorHandler("No order found",404))

    res.status(200).json({
        success : true,
        orders
    })


})


//get all orders --admin
exports.allOrders = asyncErrors(async(req,res,next) =>{
    const orders = await Order.find()

    if(!orders) return next(new ErrorHandler("No order found",404))
    let totalAmount = 0

    orders.forEach((order) =>{
        totalAmount+= order.totalPrice
    })

    res.status(200).json({
        success : true,
        totalAmount,
        orders
    })


})

//update order --admin
exports.updateOrder = asyncErrors(async(req,res,next) =>{
    const order = await Order.findById(req.params.id)

    if(!order) return next(new ErrorHandler("No order found",404))

    if(order.orderStatus=="Delivered") return next(new ErrorHandler("order already delivered",404))

    order.orderItems.forEach( async (item) =>{
        await updateStock(item.product,item.quantity)
    })
    
    order.orderStatus = req.body.status

    if(req.body.status=="Delivered") order.deliveredAt = Date.now()

    order.save({validateBeforeSave : false})
   
    res.status(200).json({
        success : true,
        order
    })


})

//update stock 
async function updateStock(id,quantity)
{
    const product = await Product.findById(id)

    product.stocks-= quantity

    product.save({validateBeforeSave: false})
}

//delete order
exports.deleteOrder = asyncErrors(async(req,res,next) =>{
    const order = await Order.findById(req.params.id)

    if(!order) return next(new ErrorHandler("No order found with the given id",404))
    
    await order.deleteOne()

    res.status(200).json({
        success : true,
        order
    })


})



