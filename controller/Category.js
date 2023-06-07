const Category =require('../models/Category')

// create category 
exports.createCategory = async (req, res)=>{
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
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        })
        console.log(categoryDetails);

        res.status(200).json({
            success: true,
            messege: "Category created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            messege: error.messege
        });
    }
}


exports.showAllCategories = async (req, res)=>{
    try {
        // fetch from db 
        const allCategories = await Category.find({}, {name:true}, {description:true})
        console.log(allCategories);
        res.status(200).json({
            success: true,
            messege: "Category created successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            messege: error.messege
        });
    }
}