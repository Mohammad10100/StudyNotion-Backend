const RatingAndReviews = require("../models/RatingAndReview");
const Course = require('../models/Course')
const User = require('../models/User');
const { default: mongoose } = require("mongoose");

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id

        const { rating, review, courseId } = req.body;

        const courseDetails = await Course.findOne(
            { _id: courseId, studentsEnrolled: { $elemMathc: { $eq: userId } } }
        )

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                messege: `Course with id ${courseId} does not exists`,

            })
        }

        const alreadyReviewd = await RatingAndReviews.findOne({
            _id: userId,
            course: courseId,
        })
        if (alreadyReviewd) {
            return res.status(200).json({
                success: false,
                messege: `User already reviewed this course`,

            })
        }

        const ratingReview = await RatingAndReviews.create({
            user: userId,
            course: courseId,
            rating: rating,
            review: review
        })

        const updatedCourseDetails = await Course.findByIdAndUpdate({ courseId }, {
            $push: {
                ratingAndReviews: ratingReview._id
            }
        }, { new: true })
        console.log(updatedCourseDetails);


        return res.status(200).json({
            success: true,
            messege: `Review posted successfully`,

        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: `Error posting the review, please try again`,
            error: error
        })
    }
}


exports.getAvgRating = async (req, res) => {
    try {
        // get course id
        const courseId = req.body.courseId
        // calc avg rating
        const result = await RatingAndReviews.aggregate([  //ARRAY
            {
                $match: {
                    course: new mongoose.Schema.Types.ObjectId(courseId)
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating: {$avg: "$rating"}, //REF
                }
            }

        ])
        // return avg rating
        if(result.length>0){
            return res.status(200).json({
                success: true,
                averageRating:result[0].averageRating, //result is an array (returning only 1 element and under that elem there is a field averageRating that is to be selected) refer the field above in REF
            })
        }else{
            return res.status(200).json({
                success: true,
                messege:"No ratings found",
                averageRating:0,
            })
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            messege:"Error fetching the avg ratings",
            averageRating:0,
        })
    }
}


exports.getAllRatingReview = async (req, res)=>{
    try {
        const allRatings = await RatingAndReviews.find({})
        .sort({rating:'desc'})
        .populate({
            path:'user',
            select:"firstName lastName email"
        })
        .populate({
            path:'course',
            select:"courseName"
        })
        .exec()
        

        return res.status(200).json({
            success: false,
            allRatings:allRatings,
            messege:"Fetched all the reviews",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege:"Error fetching the reviews",
        })
    }
}


exports.getAllRatingReviewsByCourse = async (req, res)=>{
    try {
        const {courseId} = await req.body;
        const ratingsOfCourse = await RatingAndReviews.find({course:courseId})
        .sort({rating:'desc'})
        .populate({
            path:'user',
            select:"firstName lastName email"
        })
        .populate({
            path:'course',
            select:"courseName"
        })
        .exec()
        

        return res.status(200).json({
            success: false,
            ratingsOfCourse:ratingsOfCourse,
            messege:"Fetched all the reviews for that course",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege:"Error fetching the reviews of the course",
        })
    }
}