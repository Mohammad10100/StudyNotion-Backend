const User = require("../models/User")
const Profile = require("../models/Profile")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')


// sendOTP
exports.sendOTP = async (req, res) => {
    try {
        let {email} = req.body;
        console.log(email);

        // if user already exists 
        const exists = await User.findOne({ email })
        console.log(exists);

        if (exists) {
            return res.status(401).json({
                success: false,
                messege: "User already exists"
            })
        }

        // # this method is not optimized 
        // generate otp
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        })

        const result = await OTP.findOne({ otp: otp });

        while (result) {
            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            })

            const result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp }

        // create an entry in DB
        const otpBody = await OTP.create(otpPayload);


        return res.status(200).json({
            success: true,
            messege: "OTP Generated and saved to DB successfully",
            otp,
        })


    } catch (error) {
        console.log("error in sendOTP function of controller ", error);
        return res.status(500).json({
            success: false,
            messege: error.messege,
        })
    }

}



// signUp

exports.signUp = async (req, res) => {
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
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            res.status(403).json({
                success: false,
                messege: "All fields are mandatory"
            })
        }

        //  check if user already exists
        const exists = await User.findOne({ email })
        if (exists) {
            return res.status(401).json({
                success: false,
                messege: "User already exists"
            })
        }

        // check if confirm password matches
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                messege: "Password and confirm password does not match, please try again"
            })
        }


        // OTP VERIFICATION

        // find most recent otp for that account 
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                messege: "OTP Not found"
            })
        }
        console.log(otp, " " ,recentOtp[0].otp);
        if (otp !== recentOtp[0].otp) {
            console.log("invalid");
            // invalid otp
            return res.status(400).json({
                success: false,
                messege: "Invalid OTP"
            })
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log(hashedPassword);

        // entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })
        console.log(profileDetails);
        
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })
        console.log(user);
        
        return res.status(200).json({
            success: true,
            messege: "Signed Up Successfully",
            user
        })
    } catch (error) {
        console.log("User cannot be regesterd, Please try again. Error in signUp controller ", error);
        return res.status(500).json({
            success: false,
            messege: error.messege,
        })
    }
}



// login
exports.login = async (req, res) => {
    try {
        //extract information from body
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).json(
                {
                    success: false,
                    messege: "Please enter email and password"
                }
            )
        }
        // check if user already exists 
        let user = await User.findOne({ email }).populate("additionalDetails");
        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    messege: "User does not exist"
                }
            );
        }
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        }

        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            )
            user = user.toObject()
            user.token = token;
            user.password = undefined;

            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            // testing the cookies 
            return res.cookie("token", token, options).status(200).json(
                {
                    success: true,
                    token,
                    user,
                    messege: "Logged in successfully"
                }
            );

        } else {
            return res.status(401).json(
                {
                    success: false,
                    messege: "You entered wrong credentials",
                }
            );
        }

    } catch (error) {
        return res.status(500).json(
            {
                success: false,
                data: "Login failed, please try again",
                messege: error.messege
            }
        );
    }
}



// changepassword

exports.changePassword = async (req, res) => {
    try {
        // fetch data from body
        // get oldPass, NewPass, ConfirmNewPass
        const { email, oldPass, NewPass, confirmPassword } = req.body;
        if (!email || !oldPass || NewPass || confirmPassword) {
            return res.status(500).json(
                {
                    success: false,
                    messege: "All fields are mandatory"
                }
            )
        }
        if (NewPass !== confirmPassword) {
            return res.status(400).json({
                success: false,
                messege: "Password and confirm password does not match, please try again"
            })
        }

        // validation
        const user = User.find({ email })
        if (!user) {
            return res.status(404).json(
                {
                    success: false,
                    messege: "User does not exist"
                }
            );
        }
        const payload = {
            email: user.email,
            id: user._id,
            accountType: user.accountType
        }
        if (await bcrypt.compare(oldPass, user.password)) {
            const hashedPassword = await bcrypt.hash(NewPass, 10)

            // update in DB 
            // send Mail - password updated (post middleware)
            const user = await User.findOneAndUpdate(email, {
                $set: { password: hashedPassword }
            })

            let token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            )
            user = user.toObject()
            user.token = token;
            user.password = undefined;

            const options = {
                expiresIn: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            

            // return response
            return res.cookie("token", token, options).status(200).json(
                {
                    success: true,
                    token,
                    user,
                    messege: "Logged in successfully"
                }
            );

        } else {
            return res.status(401).json(
                {
                    success: false,
                    messege: "You entered wrong credentials",
                }
            );
        }




    } catch (error) {

    }
}