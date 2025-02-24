import mongoose, { Schema, Types } from "mongoose";

const connectionSchema = new Schema({
   user: {
      type: Types.ObjectId,
      ref: "User",
   },
   friends: {
      type: [Types.ObjectId],
      ref: "User",
   },
})

export const Connection = mongoose.model("Connection", connectionSchema);