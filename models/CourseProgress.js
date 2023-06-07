const mongoose = require("mongoose")

const courseProgressSchema = new mongoose.Schema(
    {

        courseId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        },
        completedVideos:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"SubSection"
            },
        ],
        about:{
            type:String,
            trim:true,
        },
        contactNumber:{
            type:Number,
            trim:true,
        },

    }
)

module.exports = mongoose.model("CourseProgress", courseProgressSchema);