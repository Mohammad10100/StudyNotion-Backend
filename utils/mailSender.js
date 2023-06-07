const nodemailer = require("nodemailer");
require("dotenv").config

exports.mailSender = async (email, title, body)=>{
    try {
        let trasnporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        });

        let info = trasnporter.sendMail({
            from:"StudyNotion",
            to:email,
            subject:title,
            html:body,
        })
        console.log(info);
        return info
        
    } catch (error) {
        console.log(error);
        res.status(500).json({

        })
    }
}