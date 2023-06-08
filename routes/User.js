// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const { login, signUp, sendOTP, changePassword } = require('../controller/Auth')
const { resetPasswordToken, resetPassword } = require("../controller/ResetPassword")

const { auth } = require("../middleware/auth")

// Routes for Login, Signup, and Authentication, change password
router.post("/login", login)
router.post("/signup", signUp)
router.post("/sendotp", sendOTP)
router.post("/changepassword", auth, changePassword)


// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)
// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router