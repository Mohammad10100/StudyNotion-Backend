const Category = require('../models/Category')
const Course = require('../models/Course')

// create category 
exports.createCategory = async (req, res) => {
    try {
        // fetch data 
        const { name, description } = req.body;

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
        return res.status(200).json({
            success: true,
            data: allCategories,
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
            .populate({
                path: 'course',
                populate: [{
                    path: 'ratingAndReviews',
                    model: 'RatingAndReview'
                }]
            })
            .exec()

        // validation
        if (!coursesOfCategrory) {
            return res.status(404).json({
                success: false,
                messege: "Data not found"
            });
        }
        const differentCategoryCourses = await Category.find({ _id: { $ne: categoryId } })
            .populate({
                path: 'course',
                populate: [{
                    path: 'ratingAndReviews',
                    model: 'RatingAndReview'
                }]
            })
            .exec()


        // fetch top selling courses
        // let courseWithTopSelling;
        // try {
        //     courseWithTopSelling = await Course.find({}, { studentsEnrolled: { $size: '$studentsEnrolled' } }, { new: true })
        //         .sort({ studentsEnrolled: -1 })
        //         .limit(5)
        // } catch (error) {
        //     console.log('error in courseWithTopSelling');
        // }

        // OR 
        const allCategories = await Category.find()
            .populate({
                path: "course",
                match: { status: "Published" },
                populate: {
                    path: "instructor",
                },
                populate: [{
                    path: 'ratingAndReviews',
                    model: 'RatingAndReview'
                }]
            })
            .exec()
        const allCourses = allCategories.flatMap((category) => category.course)
        const mostSellingCourses = allCourses
            .sort((a, b) => b.sold - a.sold)
            .slice(0, 10)

        return res.status(200).json({
            success: true,
            data: {
                coursesOfCategrory,
                differentCategoryCourses,
                // courseWithTopSelling,
                mostSellingCourses
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