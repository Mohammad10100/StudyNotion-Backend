const Course = require('../models/Course')
const Category = require('../models/Category')
const User = require('../models/User')
const uploadToCloudinary = require('../utils/imageUpload')

exports.createCourse = async (req, res) => {
    try {
        // fetch data
        const { courseName, courseDescription, whatYouWillLearn, price, category } = req.body;

        // get thumbnail 
        const thumbnail = req.files.thumbnailImage

        // validation 
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail) {
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

        // check if given category is valid 
        const categoryDetails = await Category.findById({ category })
        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                messege: "Category Details Not Found"
            })
        }

        // upload image to cloudinary 
        const thumbnailImage = await uploadToCloudinary(thumbnail, process.env.FOLDER_NAME)

        // create course entry in db
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        // add course to category
        await Category.findByIdAndUpdate(categoryDetails._id,{
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

exports.getCourseDetails = async (req, res)=>{
    // fetch course id 
    // validate
    // check course
    // get course
    // populate 
    // populte
    // return 
    try {

        const {courseId} = req.body;

        const courseDetails = await Course.findById({_id:courseId})
        .populate({
            path:"instructor",
            populate:{
                path:"additionalDetails"
            }
        })
        .populate("category")
        .populate("ratingAndReviews")
        .populate({
            path:'courseContent',
            populate:{
                path:'subSection',
            }
            
        })

        if(!courseDetails){
            return res.status(404).json({
                success: false,
                messege: `Course with id ${courseId} does not exists`,
    
            })
        }

        
        return res.status(200).json({
            success: true,
            messege: "Course Details fetched succesfully",
            data:courseDetails,

        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            messege:"Error while fetching course details",
            error:error,
        })
    }
}