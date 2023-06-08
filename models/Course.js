const mongoose = require("mongoose")

const courseSchema = new mongoose.Schema(
    {
        courseName:{
            type:String,
            require:true,
        },
        courseDescription:{
            type:String,
            require:true,
        },
        instructor:{
            type:String,
            ref:"User",
            require:true,
        },
        whatYouWillLearn:{
            type:String,
        },
        courseContent:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
            }
        ],
        ratingAndReviews:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingAndReview",
            },
        ],
        price:{
            type:Number,
        },
        thumbnail:{
            type:Number,
        },
        tag: {
            type: [String],
            required: true,
        },
        Category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        },
        studentsEnrolled:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ]
    }
)

module.exports = mongoose.model("Course", courseSchema);