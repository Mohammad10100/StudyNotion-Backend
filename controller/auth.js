const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")


// sendOTP
exports.sendOTP = async (req,res)=>{
    try {
        let {email} = req.body;

        // if user already exists 
        const exists = User.findOne({email})

        if(exists){
            return res.status(401).json({
                success:false,
                messege:"User already exists"
            })
        }

        // # this method is not optimized 
        // generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        })

        const result = await OTP.findOne({otp:otp});
        
        while(result){
            var otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            })
    
            const result = await OTP.findOne({otp:otp});
        }

        const otpPayload = {email, otp}

        // create an entry in DB
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);


        res.status(200).json({
            success:true,
            messege:"OTP Generated and saved to DB successfully",
            otp,
        })


    } catch (error) {
        console.log("error in sendOTP function of controller ",error);
        res.status(500).json({
            success:false,
            messege:error.messege,
        })
    }

}



// signUp

exports.signUp = async (req, res)=>{
    try {
        // fetch all data
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;

        // check all required fields are presents
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            res.status(403).json({
                success:false,
                messege:"All fields are mandatory"
            })
        }

        //  check if user already exists
        const exists = User.findOne({email})
        if(exists){
            return res.status(401).json({
                success:false,
                messege:"User already exists"
            })
        }

        // check if confirm password matches
        if(password!==confirmPassword){
            res.status(400).json({
                success:false,
                messege:"Password and confirm password does not match, please try again"
            })
        }


        // OTP VERIFICATION

        // find most recent otp for that account 
        const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);

        if(recentOtp.length==0){
            res.status(400).json({
                success:false,
                messege:"OTP Not found"
            })
        }else if(otp !== recentOtp){
            // invalid otp
            res.status(400).json({
                success:false,
                messege:"Invalid OTP"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // entry in DB
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,
            additionalDetails:profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        res.status(200).json({
            success:true,
            messege:"Signed Up Successfully",
            user
        })
    } catch (error) {
        console.log("User cannot be regesterd, Please try again. Error in signUp controller ",error);
        res.status(500).json({
            success:false,
            messege:error.messege,
        })
    }
}

// login

// changepassword