const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = ()=>{
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
    })
    .then(()=> console.log("DB connection successfull"))
    .catch((error)=> {
        console.log("error in DB connection");
        console.error(error.message);
        process.exit(1);
    })
}

module.exports = dbConnect;