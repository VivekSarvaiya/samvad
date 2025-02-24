import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
   },

   username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
   },

   password: {
      type: String,
      required: true,
      select: false,
   },

   avatar: {
      type: String,
      default: ""
   },

   socketId: {
      type: String,
      default: null,
      select: false,
   }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
   if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
   }
   next();
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
      { _id: this._id, email: this.email, username: this.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" });
}

export const User = mongoose.model("User", userSchema);