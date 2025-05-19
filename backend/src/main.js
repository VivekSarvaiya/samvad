import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import http from 'http';
import { Server } from 'socket.io';
import jwt from "jsonwebtoken";
import { Unread } from "./modules/Unread/unread.model.js";
import { User } from "./modules/User/user.model.js";
import path from "path";

const __dirname = path.resolve()

const app = express();

app.use(cookieParser())

app.use(cors({
   origin: true, //process.env.CORS_ORIGIN,
   credentials: true
}))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(express.static("public"))

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: '*',
      methods: ["GET", "POST"],
   }
})

const users = {};

io.on("connection", async (socket) => {
   console.log('user :', socket.id);

   const { token } = socket.handshake.query;

   try {

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      if (!decodedToken?._id) {
         throw new Error("Invalid token")
      }

      const user = await User.findById(decodedToken._id).select("+socketId");

      if (!user) {
         throw new Error("Something went wrong")
      }

      if (user?.socketId) {
         io.to(user._id.toString()).emit("unauthorized");
      }

      // await User.findByIdAndUpdate(decodedToken._id, { $set: { socketId: socket.id } })

      // await Socket.create({ socketId: socket.id, userId: decodedToken._id });
      users[decodedToken._id] = socket.id;
      socket.join(decodedToken._id);

      socket.emit("joined-room",)

   } catch (error) {
      socket.emit("unauthorized")
   }

   socket.on("disconnect", async () => {
      try {

         const user = await User.findOne({ socketId: socket.id });

         if (!user) {
            throw new Error("User not found")
         }

         // const socketConnection = await Socket.find({ socketId: socket.id, userId: user._id });

         // if (!socketConnection) {
         //    throw new Error("User not found")
         // }

         const unread = await Unread.findOneAndUpdate(
            { user: user._id, active: true }, // Query
            { $set: { active: false } }, // Update
            { new: true } // Options
         );

         // await Socket.findOneAndDelete({ socketId: socket.id })

         await User.findByIdAndUpdate(user._id, { $set: { socketId: null } })

      } catch (error) {
         console.log("error occured while socket disconnection", error);
      }

      console.log("user disconnected");
   })
})

// routes import
import userRouter from "./modules/User/user.route.js";
import requestRouter from "./modules/Request/request.route.js";
import chatRouter from "./modules/Chat/chat.route.js";
import messageRouter from "./modules/Message/message.route.js";

// routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/requests", requestRouter);
app.use("/api/v1/chats", chatRouter);
app.use("/api/v1/messages", messageRouter);

app.get("/api/v1/test", (req, res) => {
   res.status(200).json({ success: true });
});

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("*", (req, res) => {
   res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})

// error middleware
app.use(errorMiddleware)

export { io, server };