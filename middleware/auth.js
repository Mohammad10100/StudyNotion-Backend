const jwt = require('jsonwebtoken');
const User = require('../models/User')
require('dotenv').config();
require('cookie-parser')

// auth 
exports.auth=(req, res, next)=>{
    try {
        // const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "")
        const token =  req.header("Authorization").replace("Bearer ", "");
        // const token = req.cookies

        if(!token){
            return res.status(401).json({
                success:false,
                messege:"please provide token"
            })
        }
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user= payload
        } catch (error) {
            return res.status(401).json({
                success:false,
                messege:"token is invalid"
            })
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            success:false,
            messege:"Something went wrong while verifying the token"
        })
    }
}

exports.isStudent= async(req, res, next)=>{
    try {
        console.log(req.user.accountType);
        const user = await User.findOne({email:req.user.email})
        if(user.accountType!=='Student'){
            return res.status(401).json({
                success:false,
                messege:"This is a protected route for students"
            })
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            messege:"Roles do not match"
        })
    }
}


exports.isInstructor= async(req, res, next)=>{
    try {
        const user = await User.findOne({email:req.user.email})
        if(user.accountType!=='Instructor'){
            return res.status(401).json({
                success:false,
                messege:"This is a protected route for instructor"
            })
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            messege:"Roles do not match"
        })
    }
}


exports.isAdmin= async(req, res, next)=>{
    try {
        // console.log(req.user);

        const userD=await User.findOne({email:req.user.email});
        // console.log(userD.email,req.user.email) ;
        if(userD.accountType!=='Admin'){
            return res.status(401).json({
                success:false,
                messege:"This is a protected route for admins"
            })
        }
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            messege:"Roles do not match"
        })
    }
}
