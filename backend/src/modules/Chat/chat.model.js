import mongoose, { Schema, Types } from "mongoose";

const chatSchema = new Schema({
   members: {
      type: [Types.ObjectId],
      ref: "User",
   },
   lastMessage: {
      type: Types.ObjectId,
      ref: "Message",
   },
   unread: {
      type: [Types.ObjectId],
      ref: "Unread",
   },
   type: {
      type: String,
      trim: true,
      lowercase: true,
      default: "normal",
      enum: ["normal", "group"],
   },
   groupName: {
      type: String,
      trim: true,
      lowercase: true,
   },
   groupIcon: {
      type: String,
   },
   creator: {
      type: Types.ObjectId,
      ref: "User"
   }
}, { timestamps: true })

export const Chat = mongoose.model("Chat", chatSchema);