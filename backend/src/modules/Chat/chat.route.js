import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { createGroup, editGroup, getChats } from "./chat.controller.js";

const router = Router();

// secured routes
router.use(verifyJWT)
router.route("/").get(getChats);
router.route("/createGroup").post(createGroup);
router.route("/editGroup/:groupId").put(editGroup);

export default router;