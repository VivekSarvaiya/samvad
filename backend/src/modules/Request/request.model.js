import mongoose, { Schema, Types } from "mongoose";


const requestSchema = new Schema({
   requestedBy: {
      type: Types.ObjectId,
      ref: "User",
   },
   requestedTo: {
      type: Types.ObjectId,
      ref: "User",
   },
}, { timestamps: true })

export const Request = mongoose.model("Request", requestSchema);