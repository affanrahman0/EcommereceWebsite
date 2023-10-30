const express = require("express");
const { registerUser, loginUser, logOutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUsersDetails, getOneUserDetails, updateRole, deleteUser } = require("../controllers/userController");
const { isAuthenticatiedUser, authorizedRoles } = require("../middleware/authenication");


const router = express.Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logOutUser)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword) //put for updating database
router.route("/me").get(isAuthenticatiedUser,getUserDetails)
router.route("/password/update").put(isAuthenticatiedUser, updatePassword)
router.route("/profile/update").put(isAuthenticatiedUser, updateProfile)

router.route("/admin/users/detail").get(isAuthenticatiedUser, authorizedRoles("admin"),getAllUsersDetails)
router.route("/admin/user/detail/:id").get(isAuthenticatiedUser, authorizedRoles("admin"),getOneUserDetails).put(isAuthenticatiedUser, authorizedRoles("admin"),updateRole).delete(isAuthenticatiedUser, authorizedRoles("admin"),deleteUser)
module.exports = router