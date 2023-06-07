const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
    {

        firstName:{
            type:String,
            required:true,
            trim:true,
        },
        lastName:{
            type:String,
            required:true,
            trim:true,
        },
        email:{
            type:String,
            required:true,
            trim:true,
        },
        password:{
            type:String,
            required:true,
            trim:true,
        },
        accountType:{
            type:String,
            enum:["Admin","Student","Instructor",],
            trim:true,
        },
        additionalDetails:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Profile',
        },
        courses:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Course',
            }
        ],
        image:{
            type:String,
            required:true,
        },
        courseProgress:[
            {
            type:mongoose.Schema.Types.ObjectId,
            ref:'CourseProgress',
            }
        ],


    }
)

// a function to send email
async function sendPasswordUpdate(doc){
    try {
        const mailResponse = mailSender(doc.email, "Your StudyNotion Password has been updated successfully")
        console.log("Mail sent successfully ", mailResponse);
    } catch (error) {
        console.log("error occurred while sending verification email ", error);
    }
}

// there might be something wrong with update password trigger
userSchema.post("findAndUpdate", async function(next){
    if(this.password.update){
        await sendPasswordUpdate(doc);
    }
    next();
})

module.exports = mongoose.model("User", userSchema);