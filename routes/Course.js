// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers
const { createCourse, getAllCourses, getCourseDetails, editCourse, deleteCourse, getFullCourseDetails, getInstructorCourses, } = require("../controller/Course");
const { showAllCategories, createCategory, getCategoryPageDetails, } = require("../controller/Category");
const { createSection, updateSection, deleteSection} = require("../controller/Section")
const { createSubSection, updateSubSection, deleteSubSection, } = require("../controller/SubSection")
const { createRating, getAvgRating, getAllRatingReview, getReviewsByCourse }
 = require("../controller/RatingAndReview")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
const {updateCourseProgress} = require('../controller/courseProgress');


// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
router.post("/editCourse", auth, isInstructor, editCourse)
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)
router.post("/addSection", auth, isInstructor, createSection)
router.post("/updateSection", auth, isInstructor, updateSection)
router.post("/deleteSection", auth, isInstructor, deleteSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/addSubSection", auth, isInstructor, createSubSection)
router.get("/showAllCourses", getAllCourses)
router.post("/getCourseDetails", getCourseDetails)
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", getCategoryPageDetails)




router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAvgRating)
router.get("/getReviews", getAllRatingReview)
router.get("/getReviewsByCourse", getReviewsByCourse)

module.exports = router