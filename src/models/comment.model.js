import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";


const commentSchema = new Schema({
content:{type:String, required:true},
videoId:{type:Schema.Types.ObjectId, ref:"Video", required:true},
owenerId:{type:Schema.Types.ObjectId, ref:"User", required:true},
}, 
{timestamps:true});


commentSchema.plugin(mongoosePaginate);

export const Comment = model("Comment", commentSchema);