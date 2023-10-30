const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails, createProductReview, deleteReview, getAllReviews } = require("../controllers/productController"); // ../ denotes go to the parent directory
const { isAuthenticatiedUser, authorizedRoles } = require("../middleware/authenication");

const router = express.Router();


router.route("/products").get(getAllProducts)

router.route("/admin/product/new").post(isAuthenticatiedUser, authorizedRoles("admin"), createProduct)//this can only be done when logged in , isauthenticatedUser makes sure of this by checking cookie. authorizedRoles function makes sure that the user should be admin to use this functionlities(create , delete , update)




//the colon (:) in a route path is used to define a route parameter. Route parameters are placeholders in the URL path that capture values and make them available to your route handler function. The values captured by route parameters can be accessed using the req.params object in your route handler.
router.route("/admin/product/:id").put(isAuthenticatiedUser, authorizedRoles("admin"), updateProduct).delete(isAuthenticatiedUser, authorizedRoles("admin"), deleteProduct)


router.route("/product/:id").get(getProductDetails)

router.route("/review").put(isAuthenticatiedUser, createProductReview )

router.route("/reviews").delete(isAuthenticatiedUser,deleteReview).get(getAllReviews)

module.exports = router
