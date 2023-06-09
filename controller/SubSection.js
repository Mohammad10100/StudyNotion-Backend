const Section = require('../models/Section')
const SubSection = require('../models/SubSection')
const { uploadToCloudinary } = require('../utils/imageUpload')

exports.createSubSection = async (req, res) => {
    try {

        // fetch details 
        const { sectionId, title, timeDuration, description } = req.body;

        // extract video file
        const video = req.files.video;
        // validate
        if (!sectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                messege: "All fields are mandatory",
            })
        }
        // validate video type and settings 
        const fileType = video.name.split('.')[1]
        const supportedTypes = ['mov', 'mp4'];
        if (!supportedTypes.includes(fileType)) {
            return res.status(500).json({
                success: false,
                messege: "File Type not supported, please try mov or mp4",
            })
        }
        // upload video to cloudinary
        const uploadDetails = await uploadToCloudinary(video, process.env.FOLDER_NAME, null, 60)

        // create entry in db
        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: timeDuration,
            description: description,
            videoUrl: uploadDetails.secure_url
        })
        // update section in db
        const updatedSection = await Section.findByIdAndUpdate(sectionId, {
            $push: {
                subSection: subSectionDetails._id
            }
        }, { new: true })
            .populate("subSection")
            .exec();

        console.log(updatedSection);

        return res.status(200).json({
            success: true,
            messege: "Sub section created successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            messege: "Cannot create subsection, please try again",
        })
    }
}

// ToDo Update vido in cloudinar 
// ToDo Update vido in cloudinar 
// ToDo Update vido in cloudinar 
// ToDo Update vido in cloudinar 
exports.updateSubSection = async (req, res) => {
    try {
        // fetch details 
        const { subSectionId, title, timeDuration, description } = req.body;

        // thought??
        // const toUpdate={}
        // if(title){toUpdate.title=title}
        // if(timeDuration){toUpdate.timeDuration=timeDuration}
        // if(description){toUpdate.description=description}

        // validate 
        if (!subSectionId || !title || !timeDuration || !description) {
            return res.status(400).json({
                success: false,
                messege: "Missing property",
            })
        }
        if (!await SubSection.findById({ subSectionId })) {
            return res.status(400).json({
                success: false,
                messege: "SubSection with this id does not exists",
            })
        }
        // update in db
        const updatedSubSection = await SubSection.findByIdAndUpdate({ subSectionId }, {
            title: title,
            timeDuration: timeDuration,
            description: description
        }, { new: true })

        // delete video from cloudinary
        // TODO 


        return res.status(200).json({
            success: true,
            messege: "Sub section updated successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot update sub section, please try again",
            error: error,
        })
    }
}

exports.deleteSubSection = async (req, res) => {
    try {
        // fetch details 
        // const { subSectionId, sectionId } = req.body;
        const { subSectionId } = req.params;

        // validate 
        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                messege: "Missing property subsection id",
            })
        }

        if (!await subSectionId.findById({ subSectionId })) {
            return res.status(400).json({
                success: false,
                messege: "SubSection with this id does not exists",
            })
        }

        // delete from db
        await SubSection.findByIdAndDelete({subSectionId});

        // ToDo
        // pull (delete) section from course
        // const updatedSection = await Section.findByIdAndUpdate({sectionId}, {
        //     $pull:{
        //         subSection:subSectionId
        //     }
        // }, {new:true});
        // console.log(updatedSection);


        return res.status(200).json({
            success: true,
            messege: "Subsection deleted successfully",
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Cannot delete sub section, please try again",
            error: error,
        })
    }

}