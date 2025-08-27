import { asynchandler } from "../utils/async.js";
import { Apierror } from "../utils/apierror.js";
import Apiresponse from "../utils/apiresponse.js";   // ✅ Missing import added
import { User } from "../models/user.model.js";
import { uploadImage } from "../utils/cludinary.js";
import jwt from "jsonwebtoken";

/* ------------------------------------------------------------------
   Generate Access & Refresh Tokens for a given userId
   ------------------------------------------------------------------ */
const generateRefreshandAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    // Generate both tokens using user schema methods
    const refreshtoken = user.generateRefreshToken();
    const accesstoken = user.generateAuthToken();

    // Save refresh token in DB for session management
    user.refreshToken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { refreshtoken, accesstoken };
  } catch (error) {
    throw new Apierror(500, "Token generation failed");
  }
};

/* ------------------------------------------------------------------
   REGISTER CONTROLLER
   - Handles new user registration
   - Uploads avatar & cover image to Cloudinary
   - Stores user in DB
   ------------------------------------------------------------------ */
const register = asynchandler(async (req, res) => {
  console.log("req.body:", req.body);   // ✅ Should contain text fields
  console.log("req.files:", req.files); // ✅ Should contain file paths from Multer

  const { fullName, username, email, password } = req.body || {};

  // Validate required fields
  if (!fullName || !username || !email || !password) {
    throw new Apierror(400, "All fields are required");
  }

  // Check if user already exists (either same email or username)
  const existeduser = await User.findOne({ $or: [{ email }, { username }] });
  if (existeduser) {
    throw new Apierror(400, "User already exists");
  }

  // Extract local paths from Multer uploaded files
  const avatarlocalpath = req.files?.avatar?.[0]?.path;
  const coverimagelocalpath = req.files?.coverImage?.[0]?.path;

  if (!avatarlocalpath) {
    throw new Apierror(400, "Avatar is required");
  }

  // Upload images to Cloudinary
  const avatar = await uploadImage(avatarlocalpath);
  const coverImage = await uploadImage(coverimagelocalpath);

  if (!avatar) {
    throw new Apierror(500, "Avatar upload failed");
  }

  // Create new user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || null,
  });

  // Fetch created user without sensitive fields
  const createduser = await User.findById(user._id).select(
    "-password -__v -refreshToken -watchhistory"
  );

  if (!createduser) {
    throw new Apierror(500, "User creation failed");
  }

  return res
    .status(201)
    .json(
      new Apiresponse(201, createduser, "User created successfully")
    );
});

/* ------------------------------------------------------------------
   LOGIN CONTROLLER
   - Validates user credentials
   - Generates tokens
   - Sets cookies
   ------------------------------------------------------------------ */
const login = asynchandler(async (req, res) => {
  const { email, username, password } = req.body || {};

  // At least email or username must be provided
  if (!email && !username) {
    throw new Apierror(400, "Username or email is required");
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });
  if (!user) {
    throw new Apierror(404, "User not found");
  }

  // Verify password
  const ispasswordmatch = await user.isPasswordMatch(password);
  if (!ispasswordmatch) {
    throw new Apierror(400, "Invalid credentials");
  }

  // Generate tokens
  const { accessToken, refreshToken } =
    await generateRefreshandAccessToken(user._id);

  // Fetch user info without sensitive fields
  const logedinuser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // Cookie options
  const options = {
    httpOnly: true, // ✅ Prevents XSS
    secure: true,   // ✅ Ensures cookies only sent over HTTPS
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new Apiresponse(
        200,
        { user: logedinuser, accessToken, refreshToken },
        "User logged in successfully"
      )
    );
});

/* ------------------------------------------------------------------
   LOGOUT CONTROLLER
   - Clears refreshToken from DB
   - Clears auth cookies
   ------------------------------------------------------------------ */
const logout = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } }, // ✅ Unset refreshToken field
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accesstoken", "", options)
    .cookie("refreshtoken", "", options)
    .json(new Apiresponse(200, null, "User logged out successfully"));
});

//nya check krna refresh token valid hai ya nhi
const refreshaccesstoken = asynchandler(async (req, res) => {
     const incomingrefreshtoken = req.cookies
     .refreshToken || req.body.refreshToken

     if (!incomingrefreshtoken) { 
      throw new Apierror(400, "Refresh token is required");
     }

    try{ const decodedtoken = jwt.verify(incomingrefreshtoken,
       process.env.JWT_SECRET)

    const user = await User.findById(decodedtoken?.id) 
       
    if(!user){
      throw new Apierror(404, "User not found");
    }
  //compare kra nya refresh ko purane se
    if(user.refreshToken !== incomingrefreshtoken){
      throw new Apierror(401, "Invalid refresh token");
    }
//agar match kr gya to naya access and refresh token generate kro
    const options = {
      httpOnly: true,
      secure: true,
    };
     const {accessToken, newrefreshToken} = await generateRefreshandAccessToken(user._id);

     return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newrefreshToken, options)
      .json(
        new Apiresponse(
          200,
          { accessToken, refreshToken: newrefreshToken },
          "Access token refreshed successfully"
        )
      );}
      catch(error){
        throw new Apierror(401, "Invalid or expired refresh token");
      }
     


  })

const changecurrentpassword = asynchandler(async (req, res) => {
 
  const {oldpassword, newpassword, confpassword} = req.body
  if(!oldpassword || !newpassword){
    throw new Apierror(400, "All fields are required");
  
  }
  if(newpassword !== confpassword){
    throw new Apierror(400, "New password and confirm password do not match");
  }

  const user = await User.findById(req.user._id)

const ispassordcorrect = await user.isPasswordMatch(oldpassword)
 if(!ispassordcorrect){
  throw new Apierror(400, "Old password is incorrect");
 }

  user.password = newpassword
  await user.save({validateBeforeSave: false})

  return res
  .status(200)
  .json(new Apiresponse(200, null, "Password changed successfully"))

 

  
});

const getcurrentuser = asynchandler(async (req, res) => {
  return res
  .status(200)
  .json(new Apiresponse(200, req.user, "Current user fetched successfully"))
});
 
const updateaccount = asynchandler(async (req, res) => {
  const { fullName, email }= req.body || {}
  
  if(!fullName || !email){
    throw new Apierror(400, "All fields are required");
  }

const user = await User.findByIdAndUpdate(
  req.user._id,
  {
    $set: {
      fullName,
      email:email
    } //mongodb ka set operator
  },
  {new: true}

).select("-password ")


return res
.status(200)  
.json(new Apiresponse(200, user, "User updated successfully"))
});

const updateuseravatar = asynchandler(async (req, res) => {
 
  const avatarlocalpath = req.file?.path;
  if(!avatarlocalpath){
    throw new Apierror(400, "Avatar file is required");
  }
  const avatar = await uploadImage(avatarlocalpath);
  if(!avatar.url){  
    throw new Apierror(500, "Avatar upload failed");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        avatar: avatar.url
      }
    },
    {new: true}
  ).select("-password ")

  return res  
  .status(200)
  .json(new Apiresponse(200, null, "User avatar updated successfully")) 
});

const updateusercoverimage = asynchandler(async(req,res)=>{
    const coverimagelocalpath  = req.file?.path;
  if(!coverimagelocalpath){
    throw new Apierror(400, "CoverImage file is required");
  }
  const coverImage = await uploadImage(coverimagelocalpath);
  if(!coverImage.url){  
    throw new Apierror(500, "coverImage upload failed");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        coverImage: coverImage.url
      }
    },
    {new: true}
  ).select("-password ")

  return res  
  .status(200)
  .json(new Apiresponse(200, null, "User coverImage updated successfully"))
})  

//subscriber wala controller bna skte hai jisme sirf wo user apni details dekh paye jo usko follow krta ho

const getwatchhistory = asynchandler(async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id) // Match logged-in user
      }
    },
    {
      $lookup: {
        from: "video",                  // target collection
        localField: "watchhistory",     // User.watchhistory (array of videoIds)
        foreignField: "_id",            // match with Video._id
        as: "watchhistory",             // replace watchhistory with full video docs
        pipeline: [
          {
            $lookup: {
              from: "user",             // target collection (users)
              localField: "owner",      // Video.owner (ObjectId of User)
              foreignField: "_id",      // match with User._id
              as: "owner",              // result will be an array of matched User docs
              pipeline: [
                {
                  $project: {           // only keep these fields from User
                    fullName: 1,
                    username: 1,
                    avatar: 1
                  }
                }
              ]
            }
          },
          {
            $addFields: {
              owner: { $first: "$owner" } // flatten owner array into single object
            }
          }
        ]
      }
    }
  ])

  return res
    .status(200)
    .json(new Apiresponse(
      200,
      user[0].watchhistory,
      "Watch history fetched successfully"
    ))
});


export { 
   register,
   login, 
   logout, 
   refreshaccesstoken,
   changecurrentpassword, 
   getcurrentuser, 
   updateaccount, 
   updateuseravatar,
  updateusercoverimage,
  getwatchhistory
};


 
