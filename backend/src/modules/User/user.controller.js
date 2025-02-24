import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { User } from "./user.model.js";
import { Otp } from "../Otp/otp.model.js";
import otpGenerator from "otp-generator";
import { Connection } from "../Connection/connection.model.js";

const generateAccessToken = async (user) => {
   try {

      const accessToken = user.generateAccessToken();

      return { accessToken };

   } catch (error) {
      throw new ApiError(500, "Something went wrong while generating access and refresh token")
   }
}

const sendOtp = asyncHandler(async (req, res) => {

   // get user details from req
   const { email } = req.body;
   const requiredFields = ["email"];

   for (let field of requiredFields) {
      const fieldValue = req.body[field];
      if (!fieldValue || !fieldValue.trim()) {
         throw new ApiError(400, `${field} is required`);
      }
   }

   // validate email
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      throw new ApiError(400, "Email address is not valid");
   }

   // check if user already exists
   const existedUser = await User.findOne({ email })

   if (existedUser) {
      throw new ApiError(409, "User with this email already exists");
   }

   // if otp already exists then delete it
   const existedOtp = await Otp.findOne({ email });

   const session = await mongoose.startSession();
   await session.withTransaction(async () => {

      if (existedOtp) {
         const deletedOTP = await Otp.findOneAndDelete({ email }, { new: true, session });
         if (!deletedOTP) {
            throw new ApiError(500, "Couldn't generate OTP");
         }
      }

      // genearte otp
      let otp = otpGenerator.generate(4, {
         upperCaseAlphabets: false,
         lowerCaseAlphabets: false,
         specialChars: false,
      });

      const newOTP = {
         email,
         otp
      }

      const createdOtp = await Otp.create([newOTP], { session });

      if (!createdOtp) {
         throw new ApiError(500, "Couldn't generate OTP");
      }

      res.status(201).json(
         new ApiResponse(201, {}, "OTP sent successfully")
      )

   })
   await session.endSession();
})

const verifyOtp = asyncHandler(async (req, res) => {

   // get user details from req
   const { otp, email, username, password } = req.body;
   const requiredFields = ["otp", "email", "username", "password"];

   // for (let field of requiredFields) {
   //    const fieldValue = req.body[field];
   //    if (!fieldValue || !fieldValue.trim()) {
   //       throw new ApiError(400, `${field} is required`);
   //    }
   // }

   // validate email
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   if (!emailRegex.test(email)) {
      throw new ApiError(400, "Email address is not valid");
   }

   // check if user already exists
   const existedUser = await User.findOne({
      $or: [
         { email },
         { username }
      ]
   })

   if (existedUser) {
      throw new ApiError(409, "User with this email or username already exists");
   }

   // get most recent otp
   // const existedOtp = await Otp.findOne({ email });

   // if (!existedOtp) {
   //    throw new ApiError(404, "Otp not found");
   // }

   // if (existedOtp.otp != otp) {
   //    throw new ApiError(403, "Invalid OTP");
   // }

   const session = await mongoose.startSession();
   await session.withTransaction(async () => {

      const newUser = {
         email,
         username,
         password,
      }

      // register user
      const [createdUser] = await User.create([newUser], { session })

      if (!createdUser) {
         throw new ApiError(500, "Something went wrong while registering user");
      }

      const connection = await Connection.create([{ user: createdUser._id }], { session });

      if (!connection) {
         throw new ApiError(500, "Something went wrong while registering user");
      }

      // generate refresh and access token
      const { accessToken } = await generateAccessToken(createdUser);

      const options = {
         expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
         httpOnly: true,
         sameSite: 'None',
         secure: true // now only on https it will work, so for development remove this field 
      }

      // remove unwanted fiels that are not required to send in response
      createdUser.password = undefined;

      res
         .status(201)
         .cookie("accessToken", accessToken, options)
         .json(
            new ApiResponse(200, { user: createdUser, accessToken }, "User registered successfully")
         )

   });

   await session.endSession();
})

const loginUser = asyncHandler(async (req, res) => {

   // get login details from req
   const { email, password } = req.body;

   // validate login details
   if (!email || !password) {
      throw new ApiError(400, "Both email and password is required");
   }

   // check if user with this login details exists or not
   const user = await User.findOne({ email }).select("+password")

   if (!user) {
      throw new ApiError(401, "Invalid credentials")
   }

   // check if password is correct or not
   const isPasswordValid = await user.isPasswordCorrect(password);

   if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials")
   }

   // generate refresh and access token
   const { accessToken } = await generateAccessToken(user);

   const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'None',
      secure: true // now only on https it will work, so for development remove this field 
   }

   // remove unwanted fiels that are not required to send in response
   user.password = undefined;

   return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(
         new ApiResponse(200, { user, accessToken }, "User logged in successfully")
      )
})

const getLoggedInUserDetail = asyncHandler(async (req, res) => {
   return res
      .status(200)
      .json(
         new ApiResponse(200, { user: req.user }, "User Details fetched successfully")
      )
})

const getUsersByUsername = asyncHandler(async (req, res) => {
   const { username } = req.query;

   if (!username || !username.trim()) {
      return res
         .status(200)
         .json(
            new ApiResponse(200, { users: [] }, "Users based on username fetched successfully")
         )
   }

   // Build a regex pattern to match the username case insensitively
   const regexPattern = new RegExp(username, 'i');

   const users = await User.aggregate([
      {
         $match: {
            username: { $regex: regexPattern },
            _id: { $ne: req.user._id }
         }
      },
      {
         $project: {
            password: 0,
         }
      }
   ])

   return res
      .status(200)
      .json(
         new ApiResponse(200, { users }, "Users based on username fetched successfully")
      )
})

const getUserFriends = asyncHandler(async (req, res) => {
   const { _id } = req.user;

   const connection = await Connection.findOne({ user: _id }).populate("friends");

   if (!connection) {
      throw new ApiError(404, "Connections not found")
   }

   return res.status(200).json(
      new ApiResponse(200, { friends: connection.friends }, "Friends list fetched successfully")
   )
})

export {
   sendOtp,
   verifyOtp,
   loginUser,
   getLoggedInUserDetail,
   getUsersByUsername,
   getUserFriends,
}