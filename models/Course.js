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
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            require:true,
        },
        instructions:{
            type:Array,
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
            type:String,
        },
        tag: {
            type: [String],
            // required: true,
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        },
        studentsEnrolled:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User"
            }
        ],
        status:{
            type:String,
            enum:['Draft', 'Published']
        },
        createdAt: {
            type:Date,
            default:Date.now
        },
    }
)

module.exports = mongoose.model("Course", courseSchema);