import { asynchandler } from "../utils/async.js";
import { Apierror } from "../utils/apierror.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
try {
    const token =  req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

if (!token) {
    return res.status(401).json({ message: "Access token is required" });
  }
  
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
    const user = await User.findById(decoded.id).select("-password -refreshToken")
    if (!user) {
      throw new Apierror(404, "User not found");
    }

    req.user = user;
    next();
}
catch (error) { 

throw new Apierror(401, "Invalid or expired token");

}



    });
