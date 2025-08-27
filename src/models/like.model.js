import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";

const likeSchema = new Schema({
    videoId:{type:Schema.Types.ObjectId, ref:"Video", required:true},
    owenerId:{type:Schema.Types.ObjectId, ref:"User", required:true},
    commentId:{type:Schema.Types.ObjectId, ref:"Comment"},
    like:{type:Schema.Types.ObjectId, ref:"User"},


},{timestamps:true});

export const Like = model("Like", likeSchema);