import { Router } from "express";
import { register } from "../controllers/user.controller.js";


import { upload } from "../middlewares/multer.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'images', maxCount: 5 }

    ]),
    register);



export default router;