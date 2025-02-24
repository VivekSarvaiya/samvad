import mongoose from "mongoose";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Chat } from "../Chat/chat.model.js";
import { Message } from "./message.model.js";
import { io } from "../../main.js";
import { Unread } from "../Unread/unread.model.js";
import { CHAT_MESSAGES_LIMIT } from "../../constants.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";

const getMessages = asyncHandler(async (req, res) => {
   const { chatId } = req.params;

   if (!mongoose.isValidObjectId(chatId)) {
      throw new ApiError(404, `Chat not found`);
   }

   const chat = await Chat.findById(chatId);

   if (!chat) {
      throw new ApiError(404, `Chat not found`);
   }

   const session = await mongoose.startSession();
   await session.withTransaction(async () => {

      await Unread.updateMany(
         { user: req.user._id, active: true }, // Query
         { $set: { active: false } }, // Update
         { new: true, session } // Options
      );

      const unread = await Unread.findOneAndUpdate(
         { user: req.user._id, chat: chat._id }, // Query
         { $set: { active: true, unread: 0 } }, // Update
         { new: true, session } // Options
      );

      if (!unread) {
         throw new ApiError(500, `Something went wrong while fetching messages`);
      }

      const updatedChat = await Chat.findById(chatId).populate("members lastMessage unread").session(session);

      if (!updatedChat) {
         throw new ApiError(500, `Something went wrong while fetching messages`);
      }

      const messages = (await Message.find({ chat: chatId }).populate("sender").sort({ createdAt: -1 }).limit(CHAT_MESSAGES_LIMIT).session(session)).reverse()

      res.status(200).json(
         new ApiResponse(200, { messages, chat: updatedChat }, "All messages fetched successfully")
      )
   })
   await session.endSession();
})

const getPaginatedMessages = asyncHandler(async (req, res) => {
   const { chatId } = req.params;
   const { page } = req.query;
   const limit = CHAT_MESSAGES_LIMIT;
   const skip = page ? page - 1 : 1;

   if (!mongoose.isValidObjectId(chatId)) {
      throw new ApiError(404, `Chat not found`);
   }

   const chat = await Chat.findById(chatId);

   if (!chat) {
      throw new ApiError(404, `Chat not found`);
   }

   const messages = (await Message.find({ chat: chatId }).populate("sender").sort({ createdAt: -1 }).limit(limit).skip(skip * limit)).reverse()

   return res.status(200).json(
      new ApiResponse(200, { messages, noMessagesRemaining: messages.length === 0 }, "All messages fetched successfully")
   )
})

const sendMessage = asyncHandler(async (req, res) => {
   const { chatId } = req.params;
   const { text } = req.body;

   if (!text || !text.trim()) {
      throw new ApiError(400, `message cannot be empty`);
   }

   if (!mongoose.isValidObjectId(chatId)) {
      throw new ApiError(404, `Chat not found`);
   }

   const chat = await Chat.findById(chatId);

   if (!chat) {
      throw new ApiError(404, `Chat not found`);
   }

   // const attachmentLocalPath = req.files?.attachments[0]?.path;

   // if (!attachmentLocalPath) {
   //    throw new ApiError(400, "Avatar image is required");
   // }

   // // upload avatar image to cloudinary
   // const attachments = await uploadOnCloudinary(attachmentLocalPath);

   // if (!attachments) {
   //    throw new ApiError(500, "Couldn't upload avatar");
   // }

   const newMessage = await Message.create({
      text,
      chat: chat._id,
      sender: req.user._id,
   })

   if (!newMessage) {
      throw new ApiError(500, `Unable to send message`);
   }

   const message = await newMessage.populate("sender");

   if (!message) {
      throw new ApiError(500, `Unable to send message`);
   }

   const session = await mongoose.startSession();
   await session.withTransaction(async () => {

      const result = await Unread.updateMany(
         { chat: chatId, active: false }, // Query to match documents where active is false
         { $inc: { unread: 1 } }, // Increment unread by 1
         { new: true, session }
      );

      const updatedChat = await Chat.findByIdAndUpdate(
         chatId,
         { $set: { lastMessage: message._id } },
         { new: true, session }
      ).populate("members lastMessage unread");

      chat.members.forEach((member) => {
         io.to(member.toString()).emit("new-message", { message });
      })

      chat.members.forEach((member) => {
         io.to(member.toString()).emit("new-message-chat", { chat: updatedChat });
      })

      res.status(201).json(
         new ApiResponse(201, { chat, message }, "Message sent successfully")
      )
   })
   await session.endSession();
})

const editMessage = asyncHandler(async (req, res) => {
   const { messageId } = req.params;
   const { text } = req.body;

   const message = await Message.findById(messageId).populate("chat");

   if (!message) {
      throw new ApiError(404, `Message not found`);
   }

   if (!message.sender.equals(req.user._id)) {
      throw new ApiError(403, `you cannot update this message`);
   }

   const updatedMessage = await Message.findByIdAndUpdate(messageId, { $set: { text: text } }, { new: true }).populate("sender");

   if (!updatedMessage) {
      throw new ApiError(500, `Unable to update message`);
   }

   message.chat.members.forEach((member) => {
      io.to(member.toString()).emit("updated-message", { message: updatedMessage });
   })

   return res.status(200).json(
      new ApiResponse(200, { message: updatedMessage }, "Message updated successfully")
   )
})

const deleteMessage = asyncHandler(async (req, res) => {
   const { messageId } = req.params;

   const message = await Message.findById(messageId).populate("chat");

   if (!message) {
      throw new ApiError(404, `Message not found`);
   }

   if (!message.sender.equals(req.user._id)) {
      throw new ApiError(403, `you cannot delete this message`);
   }

   const session = await mongoose.startSession();
   await session.withTransaction(async () => {

      const deletedMessage = await Message.findByIdAndDelete(messageId, { session });

      if (!deletedMessage) {
         throw new ApiError(500, `Unable to delete message`);
      }

      const chat = await Chat.findById(deletedMessage.chat).session(session);

      if (!chat) {
         throw new ApiError(404, `Chat not found`);
      }

      const lastMessage = await Message.findOne({}).sort({ createdAt: -1 }).limit(1).session(session);

      let updatedChat;

      if (lastMessage) {
         updatedChat = await Chat.findByIdAndUpdate(chat._id, { $set: { lastMessage: lastMessage._id } }, { new: true, session }).populate("members lastMessage unread")
      }
      else {
         updatedChat = await Chat.findByIdAndUpdate(chat._id, { $unset: { lastMessage: 1 } }, { new: true, session }).populate("members lastMessage unread")
      }

      if (!updatedChat) {
         throw new ApiError(500, `Unable to update last message`);
      }

      message.chat.members.forEach((member) => {
         io.to(member.toString()).emit("deleted-message", { message: deletedMessage });
      })

      message.chat.members.forEach((member) => {
         io.to(member.toString()).emit("new-message-chat", { chat: updatedChat });
      })

      res.status(200).json(
         new ApiResponse(200, { messageId: deletedMessage, chat: updatedChat }, "Message deleted successfully")
      )
   })
   await session.endSession();
})

export {
   getMessages,
   sendMessage,
   getPaginatedMessages,
   editMessage,
   deleteMessage,
}