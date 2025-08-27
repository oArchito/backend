import mongoose from "mongoose";
const { Schema, model } = mongoose;
import mongoosePaginate from "mongoose-paginate-v2";
const playlistSchema = new Schema({
    name:{type:String, required:true},
    owenerId:{type:Schema.Types.ObjectId, ref:"User", required:true},
    description:{type:String},
    videos:[{type:Schema.Types.ObjectId, ref:"Video"}],
},
    {timestamps:true})


 export const Playlist = model("Playlist", playlistSchema);   