const Section = require('../models/Section')
const Course = require('../models/Course')

exports.createSection = async (req,res)=>{
    try {
        // fetch details 
        const {sectionName, courseId} = req.body;

        // data validation 
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                messege: "Pleas enter the name of the section",
                error:error,
            })
        }

        // create section in db
        const section = await Section.create({sectionName:sectionName})

        // push section in course
        const updatedCourse = await Course.findByIdAndUpdate({courseId}, {
            $push:{
                courseContent:section._id
            }
        }, {new:true});

        console.log(updatedCourse);


        return res.status(200).json({
            success: true,
            messege: "Section created successfully",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot create section, please try again",
            error:error,
        })
    }
}

exports.updateSection = async (req,res)=>{
    try {
        // fetch details 
        const {sectionName, sectionId} = req.body;

        // data validation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                messege: "Missing properties",
                error:error,
            })
        }
        if (!await Section.findById({ sectionId })) {
            return res.status(400).json({
                success: false,
                messege: "section with this id does not exists",
            })
        }

        // update section in db
        const section = await Section.findByIdAndUpdate({sectionId},{sectionName:sectionName}, {new:true});
        console.log(section);

        return res.status(200).json({
            success: true,
            messege: "Section updated successfully",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot update section, please try again",
            error:error,
        })
    }
}


exports.deleteSection = async (req,res)=>{
    try {
        // fetch details 
        // fetch id from params 
        // const {sectionId, courseId} = req.params or req.body;
        const {sectionId} = req.params;

        // data validation 
        if(!sectionId){
            return res.status(400).json({
                success: false,
                messege: "section id missing",
                error:error,
            })
        }

        if (!await Section.findById({ sectionId })) {
            return res.status(400).json({
                success: false,
                messege: "Section with this id does not exists",
            })
        }
        // delete section from db
        const section = await Section.findByIdAndDelete({sectionId})

        // ToDo
        // pull (delete) section from course
        // const updatedCourse = await Course.findByIdAndUpdate({courseId}, {
        //     $pull:{
        //         courseContent:section._id
        //     }
        // }, {new:true});

        // console.log(updatedCourse);


        return res.status(200).json({
            success: true,
            messege: "Section deleted successfully",
        })
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot delete section, please try again",
            error:error,
        })
    }
}