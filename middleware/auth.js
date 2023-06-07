const jwt = require('jsonwebtoken');
require('dotenv').config();

// auth 
exports.auth=(req, res, next)=>{
    try {
        const token = req.body.token || req.cookies.token || req.header("Authorization").replace("Bearer ", "");

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
        return res.status(401).json({
            success:false,
            messege:"Something went wrong while verifying the token"
        })
    }
}

exports.isStudent= async(req, res, next)=>{
    try {
        console.log(req.user.role);
        if(await User.findOne({email}).accountType!=='Student'){
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
        console.log(req.user.role);

        if(await User.findOne({email}).accountType!=='Instructor'){
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


exports.isAdmin= async(req, res, next)=>{
    try {
        console.log(req.user.role);

        if(await User.findOne({email}).accountType!=='Student'){
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

// is instructor 

// is student 

// is admin