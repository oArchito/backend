import express from "express";
import cors from "cors";
import cookies from "cookie-parser";


const app = express();





// Middleware setup
app.use(cors({
    origin: process.env.CLIENT_URL ,
    credentials: true
}));
app.use(cookies());
app.use(express.static("public"));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//routes
import userRoutes from "./routes/user.routes.js";

//route setup
app.use("/api/v1/users", userRoutes);


export { app };
