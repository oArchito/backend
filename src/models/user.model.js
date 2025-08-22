import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";





const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, // url to the avatar image
            required: true
        },
        coverImage: {
            type: String // url to the cover image
        },
        watchhistory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Video"
            }
        ], // ✅ FIXED: array of video IDs
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [6, "Password must be at least 6 characters long"]
        },
        refreshToken: {
            type: String, // for JWT refresh token
            default: null
        }
    },
    { timestamps: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    // Hash the password before saving
    this.password = await bcrypt.hash(this.password, 10);
    next();
}   

);


userSchema.methods.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAuthToken = function () {
    return  jwt.sign({ id: this._id, email:this.email,username:this.username, fullName: this.fullName }, process.env.JWT_SECRET, {
        expiresIn: "1d"
    }
)};

userSchema.methods.generateRefreshToken = function () {
    return token = jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "7d"
    });
    this.refreshToken = token;  
    
    return token;
}



export const User = mongoose.model("User", userSchema);
