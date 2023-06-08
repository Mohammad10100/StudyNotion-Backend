const { default: mongoose } = require('mongoose')
const { instance } = require('../config/razorpay')
const Course = require('../models/Course')
const User = require('../models/User')
const mailSender = require('../utils/mailSender')
// const {courseEnrollmentEmail} = require('../mail/templete/courseEnrollmentEmail')

// capture the payment and initiate Razorpay order 
exports.capturePayment = async (req, res) => {

    try {

        // fetch course id , userid 
        const { courseId } = req.body;
        const userId = req.user.id;

        // validation
        if (!userId || !courseId) {
            return res.status(400).json({
                success: false,
                messege: "Missing details",
            })
        }
        // valid course id
        let course = Course.findById({ courseId })
        try {
            if (!course) {
                return res.status(400).json({
                    success: false,
                    messege: "Could not find the course",
                })
            }

            const uid = new mongoose.Schema.Types.ObjectId(userId)
            // check if user already has bought the course
            if (course.studentsEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    messege: "Student is already enrolled",
                })
            }
        } catch (error) {
            return res.status(400).json({
                success: false,
                messege: "Could not find the course",
            })
        }
        // create order 
        const amount = course.price
        const currency = "INR"

        const option = {
            amount: amount * 100,
            currency,
            receipt: Math.random(Date.now().toString()),
            notes: {
                courseId,
                userId,
            }
        }
        try {
            const paymentProcess = await instance.orders.create(options)
            console.log(paymentProcess);

            return res.status(200).json({
                success: true,
                messege: "Payment initiated successfully",
                courseName: course.name,
                courseDescription: courseDescription,
                thumnail: course.thubnail,
                orderId: paymentProcess.id,
                currency: paymentProcess.currency,
                amount: paymentProcess.amount,

            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                messege: "Could not initiate payment",
                error: error,
            })
        }


    } catch (error) {
        return res.status(500).json({
            success: false,
            messege: "Student is already enrolled",
            error: error,
        })
    }
}


exports.verifySignature = async (req, res) => {
    try {
        const webhookSecret = 'batman;'

        const signature = req.headers['x-razorpay-signature']

        const shasum = crypto.createHmac('sha256', webhookSecret)
        shasum.update(JSON.stringify(req.body))
        const digest = shasum.digest('hex')

        if (signature === digest) {
            console.log('Payment is authorized');

            const { courseId, userId } = req.body.payload.payment.entity.notes
            try {
                // fulfill the action

                // enroll the student in course and user db
                const enrolledCourse = await Course.findByIdAndUpdate({ _id: courseId }, {
                    $push: {
                        studentsEnrolled: userId
                    }
                }, { new: true })
                if (!enrolledCourse) {
                    return res.status(500).json({
                        success: false,
                        messege: "Course could not be found",
                        error: error,
                    })
                }

                const enrolledStudent = await User.findByIdAndUpdate({ _id: userId }, {
                    $push: {
                        courses: courseId
                    }
                }, { new: true })

                console.log(enrolledStudent);

                const emailResponse = await mailSender(enrolledStudent.email,
                    'congratulations from studynotion',
                    'congratulations you are onboard into your new course from studynotion'
                )

                console.log(emailResponse);

                return res.status(200).json({
                    success: true,
                    messege: "Signature verified and course added",
                })

            }
            catch (error) {
                console.log(error);
                return res.status(500).json({
                    success: false,
                    messege: error.messege,
                })
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            messege: "invalid request",
            error:error
        })
    }
}