const Category = require('../models/Category')
const Course = require('../models/Course')

// create category 
exports.createCategory = async (req, res) => {
    try {
        // fetch data 
        console.log('hhh');
        const { name, description } = req.body;
        console.log(name, description);

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                messege: "All fields are required"
            });
        }

        // create entry in db 
        const categoryDetails = await Category.create({
            name: name,
            description: description,
        })
        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            messege: "Category created successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: error.messege
        });
    }
}


exports.showAllCategories = async (req, res) => {
    try {
        // fetch from db 
        const allCategories = await Category.find({}, { name: true }, { description: true })
        console.log(allCategories);
        return res.status(200).json({
            success: true,
            data:allCategories,
            messege: "Category fetched successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: error.messege
        });
    }
}

exports.getCategoryPageDetails = async (req, res) => {
    try {
        // fetch category id
        const { categoryId } = req.body;

        // select courses from that category 
        const coursesOfCategrory = await Category.findById({ _id: categoryId })
            .populate('course')
            .exec()

        // validation
        if (!coursesOfCategrory) {
            return res.status(404).json({
                success: false,
                messege: "Data not found"
            });
        }

        const differentCategoryCourses = await Category.find({ _id: { $ne: categoryId } })
            .populate('course')
            .exec()

        
        // fetch top selling courses
        let courseWithTopSelling;
        try {
            courseWithTopSelling = await Course.find({}, {studentsEnrolled: {$size: '$studentsEnrolled'}}, {new:true})
            .sort({studentsEnrolled: -1})
            .limit(5)
        } catch (error) {
            console.log('error in courseWithTopSelling');
        }

        
        return res.status(200).json({
            success: true,
            data:{                
                coursesOfCategrory,
                differentCategoryCourses,
                courseWithTopSelling,
            },
            messege: "Fetched category page details"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: error.messege
        });
    }
}