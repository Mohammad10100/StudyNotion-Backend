const Course = require('../models/Course')
const Tag = require('../models/Tag')
const User = require('../models/User')
const UploadImageToCloudinary = require('../utils/imageUploader')

exports.createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, tag } = req.body;

        // get thumbnail 
        const thumbnail = req.files.thumbnailImage

        // validation 
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail) {
            return res.status(400).json({
                success: false,
                messege: "All fields are mandatory"
            })
        }

        // checking for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId)
        console.log("instructor details ", instructorDetails);

        if (!instructorDetails) {
            return res.status(400).json({
                success: false,
                messege: "Instructor not found"
            })
        }

        // check if given tag is valid 
        const tagDetails = await Tag.findById({ tag })
        if (!tagDetails) {
            return res.status(400).json({
                success: false,
                messege: "Tag Details Not Found"
            })
        }

        // upload image to cloudinary 
        const thumbnailImage = await UploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // create course entry in db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag: tagDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        // add course to tag
        await Tag.findByIdAndUpdate(tagDetails._id,{
            $push:{
                course:newCourse._id,
            }
        }, {new:true})

        // add the course to instructors user 
        await User.findByIdAndUpdate(instructorDetails._id,{
            $push:{
                courses:newCourse._id,
            }
        }, {new:true})

        return res.status(200).json({
            success: true,
            messege: "Course created successfully",
            error:error,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot create course, please try again",
            error:error,
        })
    }

}


// show all course 
exports.showAllCourses = async (req, res) =>{
    try {
        const allCourses = Course.find({}, {
            courseName:true,
            courseDescription:true,
            price:true,
            thumbnail:true,
            instructor:true,
        })
        .populate('instructor')
        .exec();

        return res.status(200).json({
            success: true,
            messege: "All courses fetched",
            data:allCourses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot create course, please try again",
            error:error,
        })
    }
}