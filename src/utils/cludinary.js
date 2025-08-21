import { v2 as cloudinary  } from 'cloudinary'
import fs from 'fs'    //file system module

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret:process.env.CLOUDINARY_API_SECRET
});

 const uploadImage = async (filePath) => {
    try{
        if(!localfilePath) {
            throw new Error('File path is required');
            //upload the file on cloudnary
            const response= await cloudinary.uploader.upload(filePath, {
                resource_type: 'auto',})
                //file uploaded sucessfully
                console.log('File uploaded successfully',response.url);
                return response.url; //return the URL of the uploaded image
               }
    }
    catch (error) {
        fs.unlink(localfilePath) // this will delete the file from the local system
        return null; // return null if there is an error
    }
}
export { uploadImage}