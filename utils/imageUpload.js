const cloudinary = require("cloudinary").v2

exports.uploadToCloudinary = async (file, folder, height, quality)=>{
    const options = {folder}
    if(height){
        console.log('hight');
        options.height= height;
    }
    if(quality){
        console.log('qual');
        options.quality= quality;
    }
    
    options.resource_type = 'auto'
    const result =  await cloudinary.uploader.upload(file.tempFilePath, options)
    return result
}