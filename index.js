const express = require("express");
const app = express();

const cloudinaryConfig = require('./config/cloudinary');
const fileUpload= require('express-fileupload')
const dbConnect = require('./config/database')
const cookieParser = require('cookie-parser')
const cors = require('cors')

require('dotenv').config()
const PORT = process.env.PORT || 4000;

// importing the routes 
const userRoutes = require('./routes/User')
const profileRoutes = require('./routes/Profile')
const paymentRoutes = require('./routes/Payment')
const courseRoutes = require('./routes/Course')

// mounting the api routes 
app.use('/api/v1/auth', userRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/course', courseRoutes)
app.use('/api/v1/payment', paymentRoutes)

// middleware to parse json request body 
app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        origin:'http://localhost:3000',
        credentials:true,
    }))
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:'/tmp',
    })
)

cloudinaryConfig()
dbConnect();

app.get('/', (req, res)=>{
    res.send('<h1>StudyNotion</h1>')
})
app.listen(PORT,()=>{
    console.log(`server started successfully on port ${PORT}`);
})