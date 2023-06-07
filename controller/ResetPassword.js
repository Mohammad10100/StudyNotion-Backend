const User = require("../models/User")
const mailSender =require('../utils/mailSender')
const bcrypt = require('bcrypt')

// reset password through email link 
exports.ResetPassword = async (req, res)=>{
    try {
        // get email from body
        const {email} = req.body;

        // check if user exists
        const exists = User.findOne({email:email});
        if(!exists){
            return res.json({
                success: false,
                messege: "User does not exists with this email",
            });
        }

        // generate token
        const token = crypto.randomUUID();
        // update User by adding token and expiration time
        const updatedUser = User.findOneAndUpdate({email:email},{
            token:token,
            resetTokenExpires: Date.now() + 2*60*1000
        }, {new:true})

        // create url
        const url = `http://localhost:3000/update-password/${token}`

        // send mail containing the url
        const mailResponse = await mailSender(email, "Password reset link to StudyNotion", 
        `<h2>Your password reset link, Please do not share it with anyone</h2>
        <a href="${url}">Click To Reset Password</a>`
        )

        // response
        res.status(200).json(
            {
                success: true,
                data: email,
                messege: `Password reset link sent to the email ${email}`
            }
        );
        
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                data: "Something went wrong, please try again",
                messege: error.messege
            }
        );
    }
}



exports.ResetPasswordPage = async (req, res)=>{
    try {
        // get email from body
        const {password, confirmPassword, tokenFromUser} = req.body;

        if(password!==confirmPassword){
            return res.json({
                success: false,
                messege: "Passwords do not match",
            });
        }

        const userDetails = await User.findOne({token:tokenFromUser});
        // check if user exists
        if(!userDetails){
            return res.json({
                success: false,
                messege: "Token is invalid",
            });
        }
        if(userDetails.resetTokenExpires < Date.now()){
            return res.json({
                success: false,
                messege: "Token is invalid",
            });
        }

        // hash password
        const hashedPassword = bcrypt.hash(password, 10);

        // update in db
        const updatedResponse = await User.findOne({toke:tokenFromUser},{
            password:hashedPassword,
            token:null
        }, {new:true})
        // send response mail 
        // response
        res.status(200).json(
            {
                success: true,
                data: email,
                messege: `Password reset link sent to the email ${email}`
            }
        );
        
    } catch (error) {
        res.status(500).json(
            {
                success: false,
                data: "Something went wrong, please try again",
                messege: error.messege
            }
        );
    }
}

