import { Router } from "express";
import { changecurrentpassword, getcurrentuser, getUserchannelProfile, register, updateaccount, updateuseravatar, updateusercoverimage, getwatchhistory } from "../controllers/user.controller.js";
import { login, logout, refreshaccesstoken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.midlleware.js";


import { upload } from "../middlewares/multer.js";
import { get } from "mongoose";

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
router.route("/change-password").post(verifyJWT,
    changecurrentpassword)
router.route("/change-user").post(verifyJWT,
    getcurrentuser)
router.route("/change-user").post(verifyJWT,
    updateaccount)
router.route("/avatar").patch(verifyJWT,
        upload.single('avatar'),updateuseravatar)
router.route("/coverImage").patch(verifyJWT,
        upload.single('coverImage'),updateusercoverimage )

router.route("/c/:username").get(verifyJWT, getUserchannelProfile);        

router.route("/watch-history").get(verifyJWT, getwatchhistory);
   

export default router;