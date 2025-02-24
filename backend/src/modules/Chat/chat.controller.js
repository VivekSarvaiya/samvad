import mongoose from "mongoose";
import { ApiError } from "../../utils/apiError.js";
import { ApiResponse } from "../../utils/apiResponse.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Connection } from "../Connection/connection.model.js";
import { Chat } from "./chat.model.js";
import { Unread } from "../Unread/unread.model.js";
import { io } from "../../main.js";


const getChats = asyncHandler(async (req, res) => {
   const { _id } = req.user;

   const chats = await Chat.find({ members: { $all: [_id] } }).populate("members lastMessage unread").sort({ updatedAt: -1 });

   // const chats = await Chat.aggregate([
   //    // Match chats where the logged-in user is a member
   //    { $match: { members: { $all: [_id] } } },
   //    // Populate the members field to get user details
   //    {
   //       $lookup: {
   //          from: "users",
   //          localField: "members",
   //          foreignField: "_id",
   //          as: "membersData",
   //       }
   //    },
   //    // Unwind the members array to work with individual user details
   //    { $unwind: "$membersData" },
   //    // Filter out the logged-in user from the members array
   //    { $match: { "membersData._id": { $ne: _id } } },
   //    // Project to include only the necessary fields and rename them
   //    {
   //       $project: {
   //          _id: 1,
   //          members: 1,
   //          lastMessage: 1,
   //          chatName: "$membersData.username",
   //          chatAvatar: "$membersData.avatar"
   //       }
   //    }
   // ]);

   return res.status(200).json(
      new ApiResponse(200, { chats }, "All chats fetched successfully")
   )
})

const createGroup = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const { groupName, members } = req.body;

   if (!groupName) {
      throw new ApiError(400, "Group name is required");
   }

   if (!members || members?.length < 2) {
      throw new ApiError(400, "Please add atleast 2 members");
   }

   if (members.length > 10) {
      throw new ApiError(400, "Only 10 members are allowed");
   }

   const connection = await Connection.findOne({ user: _id });

   if (!connection) {
      throw new ApiError(400, `Something went wrong while creating chat`);
   }

   const set = new Set();
   connection.friends.forEach((_id) => {
      set.add(_id.toString());
   })

   for (let _id of members) {
      if (!set.has(_id)) {
         throw new ApiError(400, `You can only add your friends in group`);
      }
   }

   members.unshift(_id.toString());

   const session = await mongoose.startSession();
   await session.withTransaction(async () => {

      const newGroupChat = {
         members,
         type: "group",
         groupName,
         groupIcon: `https://ui-avatars.com/api/?name=${groupName}`,
         creator: _id
      }

      const [createdChat] = await Chat.create([newGroupChat], { session })

      if (!createdChat) {
         throw new ApiError(400, `Something went wrong while creating chat`);
      }

      try {
         const newMembers = members.map((member) => {
            return { user: member, chat: createdChat._id }
         })
         const unreadMessages = await Unread.insertMany(newMembers, { session });
         createdChat.unread = unreadMessages;
         await createdChat.save({ session });
      } catch (error) {
         console.log("err", error);
         throw new ApiError(400, `Something went wrong while creating chat`);
      }

      const chat = await Chat.findById(createdChat._id).populate("members lastMessage unread").session(session);

      members.forEach((member) => {
         io.to(member.toString()).emit("new-group-chat", { chat });
      })

      res.status(201).json(
         new ApiResponse(201, { chat }, "Group chat created successfully")
      )

   })
   await session.endSession();
})

const editGroup = asyncHandler(async (req, res) => {
   const { _id } = req.user;
   const { groupId } = req.params;
   const { groupName, members } = req.body;

   const existingGroupChat = await Chat.findById(groupId);

   if (!existingGroupChat) {
      throw new ApiError(404, `Chat not found`);
   }

   if (!existingGroupChat?.creator?.equals(_id)) {
      throw new ApiError(403, `Only group owner can edit group chat`);
   }

   if (!groupName) {
      throw new ApiError(400, "Group name is required");
   }

   if (!members || members?.length < 2) {
      throw new ApiError(400, "Please add atleast 2 members");
   }

   if (members.length > 10) {
      throw new ApiError(400, "Only 10 members are allowed");
   }

   const connection = await Connection.findOne({ user: _id });

   if (!connection) {
      throw new ApiError(400, `Something went wrong while creating chat`);
   }

   const set = new Set();
   connection.friends.forEach((_id) => {
      set.add(_id.toString());
   })

   for (let _id of members) {
      if (!set.has(_id)) {
         throw new ApiError(400, `You can only add your friends in group`);
      }
   }

   members.unshift(_id.toString());

   const session = await mongoose.startSession();
   await session.withTransaction(async () => {

      set.clear();

      const previousMembers = [];
      const newMembers = [];
      const removedMembers = [];

      for (let _id of existingGroupChat.members) {
         set.add(_id.toString());
      }

      for (let _id of members) {
         if (!set.has(_id)) {
            newMembers.push(_id);
         }
         else {
            previousMembers.push(_id);
            set.delete(_id);
         }
      }

      for (const _id of set) {
         removedMembers.push(_id);
      }

      const groupChat = {
         members,
         type: "group",
         groupName,
         groupIcon: `https://ui-avatars.com/api/?name=${groupName}`,
         creator: _id
      }

      const updatedChat = await Chat.findByIdAndUpdate(
         groupId,
         groupChat,
         { new: true, session }
      );

      if (!updatedChat) {
         throw new ApiError(400, `Something went wrong while creating chat`);
      }

      try {
         const members = newMembers.map((member) => {
            return { user: member, chat: updatedChat._id }
         })

         await Unread.insertMany(members, { session });

         await Unread.deleteMany(
            {
               user: { $in: removedMembers },
               chat: updatedChat._id
            },
            { session }
         );

         const chatPreviousUnread = (await Unread.find({ chat: updatedChat._id }).session(session)).map((unread) => unread._id);

         updatedChat.unread = chatPreviousUnread;
         await updatedChat.save({ session });
      } catch (error) {
         console.log("err", error);
         throw new ApiError(400, `Something went wrong while creating chat`);
      }

      const chat = await Chat.findById(updatedChat._id).populate("members lastMessage unread").session(session);

      newMembers.forEach((member) => {
         io.to(member.toString()).emit("new-group-chat", { chat });
      })

      previousMembers.forEach((member) => {
         io.to(member.toString()).emit("update-group-chat", { chat });
      })

      removedMembers.forEach((member) => {
         io.to(member.toString()).emit("remove-group-chat", { chat });
      })

      res.status(201).json(
         new ApiResponse(201, { chat }, "Group chat updated successfully")
      )

   })
   await session.endSession();
})

export {
   getChats,
   createGroup,
   editGroup
}