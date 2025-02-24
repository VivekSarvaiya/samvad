import mongoose, { Schema, Types } from "mongoose";

const messageSchema = new Schema({
   text: {
      type: String,
      trim: true
   },
   attachments: {
      type: [String],
      default: null
   },
   sender: {
      type: Types.ObjectId,
      ref: "User",
   },
   chat: {
      type: Types.ObjectId,
      ref: "Chat",
   },
}, { timestamps: true })

export const Message = mongoose.model("Message", messageSchema);