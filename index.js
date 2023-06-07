const express = require("express");
const app = express();

// load config from env 
require('dotenv').config();
const PORT = process.env.PORT || 4000;

// middleware to parse json request body 
app.use(express.json())

// importing the routes 
// const  = require('./routes/')

// mounting the api routes 
// app.use('/api/v1/', )


app.listen(PORT,()=>{
    console.log(`server started successfully on port ${PORT}`);
})

const dbConnect = require('./config/database')
dbConnect();

app.get('/', (req, res)=>{
    res.send('<h1>StudyNotion</h1>')
})