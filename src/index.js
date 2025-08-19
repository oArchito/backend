//require('dotenv').config({path: './env'})

import dotenv from "dotenv"
dotenv.config({
    path: './env'
})




import {connectDB} from "./db/index.js";
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000 ,()=>{
        console.log(`App is listening on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.log("DB CONNECTION ERROR",error)
    process.exit(1)
})  

import express from "express";
const app = express();
//DB IS CONNECTE DHERE































































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