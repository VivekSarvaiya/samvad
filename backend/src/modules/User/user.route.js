import { Router } from "express";
import { getLoggedInUserDetail, getUserFriends, getUsersByUsername, loginUser, sendOtp, verifyOtp } from "./user.controller.js";
import { verifyJWT } from "../../middlewares/auth.middleware.js";

const router = Router();

router.route("/sendOtp").post(sendOtp);
router.route("/verifyOtp").post(verifyOtp);
router.route("/login").post(loginUser);

// secured routes
router.route("/getMyProfile").get(verifyJWT, getLoggedInUserDetail);
router.route("/getUsersByUsername").get(verifyJWT, getUsersByUsername);
router.route("/getUserFriends").get(verifyJWT, getUserFriends);

export default router;