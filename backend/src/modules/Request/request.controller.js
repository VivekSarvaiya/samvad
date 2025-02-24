import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { Request } from "./request.model.js";
import { User } from "../User/user.model.js";
import { Chat } from "../Chat/chat.model.js";
import { io } from "../../main.js";
import { Unread } from "../Unread/unread.model.js";
import { Connection } from "../Connection/connection.model.js";


const sendRequest = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const { requestedTo } = req.body;

   const requestedUser = await User.findById(requestedTo);

   if (!requestedUser) {
      throw new ApiError(404, `This user does not exists`);
   }

   if (requestedUser._id.equals(_id)) {
      throw new ApiError(400, `You cannot send request to yourself`);
   }

   const existingRequest = await Request.findOne({ requestedTo })

   if (existingRequest) {
      throw new ApiError(409, `You have already requested to this user`);
   }

   const requestSendByOtherPerson = await Request.findOne({ requestedBy: requestedTo, requestedTo: _id });

   if (requestSendByOtherPerson) {
      return res.status(200).json(
         new ApiResponse(200, {}, `${requestedUser.username} has already sent you request`)
      )
   }

   const existingChat = await Chat.findOne({ members: { $all: [_id, requestedTo] }, type: "normal" })

   if (existingChat) {
      throw new ApiError(409, `You have already accepted the request of this user`);
   }

   const newRequest = await Request.create({
      requestedBy: _id,
      requestedTo
   });

   const request = await newRequest.populate("requestedTo requestedBy")

   if (!request) {
      throw new ApiError(500, `Something went wrong while sending request`);
   }

   io.to(requestedTo).emit("new-request", { request });

   return res.status(201).json(
      new ApiResponse(201, { request }, "Request sent successfully")
   )
})

const deleteRequest = asyncHandler(async (req, res) => {
   const { requestId } = req.params;

   const request = await Request.findById(requestId);

   if (!request) {
      throw new ApiError(404, `Request not found`);
   }

   try {
      await Request.findOneAndDelete({ _id: requestId })
   } catch (error) {
      throw new ApiError(400, `Something went wrong while deleting this request`);
   }

   const roomId = request.requestedBy.equals(req.user._id) ? request.requestedTo : request.requestedBy;
   io.to(roomId.toString()).emit("delete-request", { requestId });

   return res.status(200).json(
      new ApiResponse(200, {}, "Request deleted successfully")
   )
})

const acceptRequest = asyncHandler(async (req, res) => {
   const { requestId } = req.params;

   const request = await Request.findById(requestId);

   if (!request) {
      throw new ApiError(404, `Request not found`);
   }

   const session = await mongoose.startSession();
   await session.withTransaction(async () => {
      try {
         await Request.findOneAndDelete({ _id: requestId }).session(session)
      } catch (error) {
         throw new ApiError(400, `Something went wrong while creating chat`);
      }

      const [createdChat] = await Chat.create([{
         members: [request.requestedBy, request.requestedTo]
      }], { session })

      if (!createdChat) {
         throw new ApiError(400, `Something went wrong while creating chat`);
      }

      try {
         const members = [request.requestedBy, request.requestedTo];
         const newMembers = members.map((member) => {
            return { user: member, chat: createdChat._id }
         })
         const unreadMessages = await Unread.insertMany(newMembers, { session });
         createdChat.unread = unreadMessages;
         await createdChat.save({ session });
      } catch (error) {
         throw new ApiError(400, `Something went wrong while creating chat`);
      }

      const chat = await Chat.findById(createdChat._id).populate("members lastMessage unread").session(session);

      if (!chat) {
         throw new ApiError(400, `Something went wrong while creating chat`);
      }

      try {
         await Connection.findOneAndUpdate(
            { user: request.requestedBy },
            { $push: { friends: request.requestedTo } },
            { session }
         );

         await Connection.findOneAndUpdate(
            { user: request.requestedTo },
            { $push: { friends: request.requestedBy } },
            { session }
         );

      } catch (error) {
         throw new ApiError(400, "Something went wrong while updating friend list");
      }

      io.to(request.requestedBy.toString()).emit("accept-request", { requestId, chat });

      res.status(201).json(
         new ApiResponse(201, { chat }, "Chat created successfully")
      )
   })
   await session.endSession();
})

const getRequests = asyncHandler(async (req, res) => {
   const { _id } = req.user;

   const recievedRequests = await Request.find({ requestedTo: _id }).populate("requestedTo requestedBy");
   const sentRequests = await Request.find({ requestedBy: _id }).populate("requestedTo requestedBy");


   return res.status(200).json(
      new ApiResponse(200, { recievedRequests, sentRequests }, "All requests fetched successfully")
   )
})

export {
   sendRequest,
   deleteRequest,
   acceptRequest,
   getRequests,
}