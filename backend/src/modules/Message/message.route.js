import { Router } from "express";
import { verifyJWT } from "../../middlewares/auth.middleware.js";
import { deleteMessage, editMessage, getMessages, getPaginatedMessages, sendMessage } from "./message.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

// secured routes
router.use(verifyJWT)
router.route("/:chatId").get(getMessages);
router.route("/getPaginatedMessages/:chatId").get(getPaginatedMessages);
router.route("/:chatId").post(
   upload.fields([
      {
         name: "attachments",
         maxCount: 1
      }
   ]),
   sendMessage
);

router.route("/:messageId").put(editMessage);
router.route("/:messageId").delete(deleteMessage);

export default router;