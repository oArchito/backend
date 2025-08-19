import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";





const userSchema = new mongoose.Schema({
    videofile: {
        type: String, // URL to the video file
        required: true,},
    thumbnail: {
        type: String, // URL to the video thumbnail
        required: true},
    title: {
        type: String,
        required: true},
    description: {
        type: String,
        required: true},
    duration: {
        type: Number, // duration in seconds
        required: true},
    views: {
        type: Number,
        default: 0},
    isPublic: {
        type: Boolean,
        default: true // public or private video
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"}, // reference to the User model

    },{ timestamps: true });


videoSchema.plugin(mongooseAggregatePaginate);

    export const Video = mongoose.model("Video", videoSchema);