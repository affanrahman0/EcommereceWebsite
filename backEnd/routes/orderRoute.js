const express = require("express");
const { isAuthenticatiedUser, authorizedRoles } = require("../middleware/authenication");
const { newOrder, getSingleOrder, myOrder, allOrders, updateOrder, deleteOrder } = require("../controllers/orderController");


const router = express.Router();
router.route("/order/new").post(isAuthenticatiedUser,newOrder)
router.route("/order/:id").get(isAuthenticatiedUser,getSingleOrder)
router.route("/myorder").get(isAuthenticatiedUser,myOrder)
router.route("/admin/orders").get(isAuthenticatiedUser,authorizedRoles("admin"),allOrders)
router.route("/admin/order/:id").put(isAuthenticatiedUser,authorizedRoles("admin"),updateOrder).delete(isAuthenticatiedUser,authorizedRoles("admin"),deleteOrder)
module.exports = router

//last 3 functions are yet to be tested