const Profile = require("../models/Profile");
const User = require("../models/User");
const {uploadToCloudinary} = require('../utils/imageUpload')

exports.updateProfile = async (req, res) => {
    try {
        // fetch details to update 
        console.log('from profile controller before');
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
        console.log('from profile controller');
        const userDetails = await User.findById(id );
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById( profileId )
        console.log(userDetails);

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
            profileDetails,
            image:userDetails.image,
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
        console.log(req.user.id);
        const id = req.user.id;

        // check if user exists
        const userDetails = await User.findById(id)
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
        // const profileId= userDetails.;
        await Profile.findByIdAndDelete(userDetails.additionalDetails)

        // TODO 
        // TODO 
        // TODO 
        // TODO 
        // unroll user from all courses

        // IF THE USER IS TEACHER
        // DO NOT DELETE THE COURSES

        // delete user from db
        await User.findByIdAndDelete(id)

        return res.status(200).json({
            success: true,
            messege: "Account Deleted Successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            messege: "Cannot delete profile, please try again",
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
exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id
      const image = await uploadToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
        1000,
        1000
      )
      console.log(image)
      let updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )

      updatedProfile.password=undefined
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};
  
exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      const userDetails = await User.findOne({
        _id: userId,
      })
        .populate("courses")
        .exec()
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
};