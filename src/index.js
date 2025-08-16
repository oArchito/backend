//require('dotenv').config({path: './env'})

import dotenv from "dotenv"



dotenv.config({
    path: './env'
})



/*APPROACH @2*/
import { connectDB } from "./db/index.js";

connectDB();































































/* APPROaCH 1
import express from "express";
const app = express();

( async ()=>{

    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERR: ",errorr);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on port ${process.env.PORT}`)
        })

    } catch (error) {
        console.log("ERROR: ",error)
        throw err
    }
})
    */