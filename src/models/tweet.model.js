import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";
const playlistSchema = new Schema({

    content:{type:String, required:true},
    owenerId:{type:Schema.Types.ObjectId, ref:"User", required:true},


},{timestamps:true})
export const Tweet = model("Tweet", playlistSchema);
