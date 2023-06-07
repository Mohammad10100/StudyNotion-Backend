const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async (req, res) => {
    try {
        // fetch details to update 
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        // get user id (from auth middleware )
        const id = req.user.id;
        // validate
        if (!id || !contactNumber || !gender) {
            return res.status(400).json({
                success: false,
                messege: "Missing properties",
            })
        }
        // find porfile id
        const userDetails = await User.findById({ id });
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById({ profileId })

        // update profile in db
        profileDetails.dateOfBirth = dateOfBirth
        profileDetails.contactNumber = contactNumber
        profileDetails.about = about
        profileDetails.gender = gender

        await profileDetails.save();


        // return response 
        return res.status(200).json({
            success: true,
            messege: "Profile Updated Successfully",
            profileDetails
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot update profile, please try again",
            error: error,
        })
    }
}


exports.deleteAccount = async (req, res) => {
    try {
        // fetch id 
        const id = req.user.id;

        // check if user exists
        const userDetails = await User.findById({ id })
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                messege: "User does not exists",
            })
        }

        // Verification 
        // (Due to the middlewares the account is already logged in )
        // (that means he will not be able to pass another person's id)

        // delete profile 
        const profileId= userDetails.accountType;
        await Profile.findByIdAndDelete({profileId})

        // TODO 
        // TODO 
        // TODO 
        // TODO 
        // unroll user from all courses

        // IF THE USER IS TEACHER
        // DO NOT DETAILS THE COURSES

        // delete user from db
        await User.findByIdAndDelete({id})

        return res.status(200).json({
            success: true,
            messege: "Account Deleted Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot update profile, please try again",
            error: error,
        })
    }
}

exports.getAllUserDetails = async (req, res)=>{
    try {
        const id = req.user.id 

        const userDetails = User.findById({id}).populate("additionalDetails").exec()

        // get other details too??

        return res.status(200).json({
            success: true,
            messege: "Details fetched Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Could Not Fetch Details",
            error: error,
        })
    }
}