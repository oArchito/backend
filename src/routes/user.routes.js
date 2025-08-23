import { Router } from "express";
import { register } from "../controllers/user.controller.js";
import { login, logout, refreshaccesstoken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.midlleware.js";


import { upload } from "../middlewares/multer.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        { name: 'avatar', maxCount: 2 },
        { name: 'coverImage', maxCount: 5 }

    ]),
    register);


    router.route("/login").post(login);

    //secured routes
    router.route("/logout").post(verifyJWT, logout);

    router.route("/refresh-token").post(refreshaccesstoken);


export default router;