const Tag =require('../models/Tag')

// create tag 
exports.createTag = async (req, res)=>{
    try {
        // fetch data 
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                messege: "All fields are required"
            });
        }

        // create entry in db 
        const tagDetails = await Tag.create({
            name:name,
            description:description,
        })
        console.log(tagDetails);

        res.status(200).json({
            success: true,
            messege: "Tag created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            messege: error.messege
        });
    }
}


exports.showAllTags = async (req, res)=>{
    try {
        // fetch from db 
        const allTags = await Tag.find({}, {name:true}, {description:true})
        console.log(allTags);
        res.status(200).json({
            success: true,
            messege: "Tag created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            messege: error.messege
        });
    }
}