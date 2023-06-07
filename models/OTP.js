const mongoose = require("mongoose");
const { mailSender } = require("../utils/mailSender");

const otpSchema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
        },
        otp:{
            type:String,
            required:true,
        },
        createdAt:{
            type:Date,
            default:Date.now(),
            expires:5*60,
        }
    }

)

// send email
async function sendVerificationEmail(email, otp){
    try {
        const mailResponse = mailSender(email, "Verification email from StudyNotion", otp)
        console.log("Mail sent successfully ", mailResponse);
    } catch (error) {
        console.log("error occurred while sending verification email ", error);
    }
}
module.exports = mongoose.model("OTP", otpSchema);