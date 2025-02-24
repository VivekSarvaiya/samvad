import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { acceptRequest, deleteRequest, getRequests, sendRequest } from "./request.controller.js";

const router = Router();

// secured routes
router.use(verifyJWT)
router.route("/").post(sendRequest).get(getRequests);
router.route("/:requestId").delete(deleteRequest);
router.route("/:requestId").post(acceptRequest);

export default router;