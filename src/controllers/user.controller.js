  import { asynchandler }  from "../utils/async.js";
  import { apierror } from "../utils/apierror.js";
  import { User } from "../models/user.model.js";
  import { uploadImage } from "../utils/cludinary.js";
  import { Apiresponse } from "../utils/Apiresponse.js";

  const register =asynchandler( async (req, res) => {
    // Registration logic here
    // get user details from frontend
    // validate the data
    // check if user already exists: username and email
    //check for images
    //check for avatar
    //uplaod to cloudinary, avatar
    //create user in database
    // remove password from response and token
    //check for user creation
    // return response to frontend



    const { fullName ,username, email, password } = req.body;
    console.log(req.body);

    if (!fullName || !username || !email || !password) {
      throw new apierror(400, "All fields are required");
    }

    const existeduser = User.findOne({ $or: [{ email }, { username }] })
    if (existeduser) {
      throw new apierror(400, "User already exists");
    }
 
      const avatarlocalpath = req.body?.avatar[0]?.path
     const coverimagelocalpath = req.body?.coverImage[0]?.path

     if (!avatarlocalpath) {
      throw new apierror(400, "Avatar is required");
      }


      const avatar= await uploadImage(avatarlocalpath);
      const coverImage =  await uploadImage(coverimagelocalpath);

      if (!avatar) {
        throw new apierror(500, "Avatar upload failed");
      }


      const user=  await User.create({
        fullName,
        username,
        email,
        password,
        avatar : avatar.url,
        coverImage : coverImage?.url || null
      });
      //check for user creation and remove password token and history
      const createduser = await User.findById(user._id).select("-password -__v -refreshToken -watchhistory");

      if (!createduser) {
        throw new apierror(500, "User creation failed");
      } 

      return res.status(201).json(new Apiresponse(201, createduser, "User created successfully")); 






  })


 
  export { register };