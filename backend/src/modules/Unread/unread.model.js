import mongoose, { Schema, Types } from "mongoose";

const unreadSchema = new Schema({
   unread: {
      type: Number,
      default: 0,
   },
   active: {
      type: Boolean,
      default: false,
   },
   user: {
      type: Types.ObjectId,
      ref: "User",
   },
   chat: {
      type: Types.ObjectId,
      ref: "Chat",
   },
}, { timestamps: true })

export const Unread = mongoose.model("Unread", unreadSchema);