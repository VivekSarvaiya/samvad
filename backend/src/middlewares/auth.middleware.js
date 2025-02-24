import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../modules/User/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
   try {
      const token =
         req.cookies?.accessToken ||
         req.header("Authorization")?.replace("Bearer ", "") ||
         req.body?.accessToken;

      if (!token) {
         throw new ApiError(401, "Token is missing")
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken?._id).select("-password");

      if (!user) {
         throw new ApiError(401, "Invalid token")
      }

      req.user = user;
      next();
   } catch (error) {
      throw new ApiError(401, error?.message || "Invalid token")
   }
})

export { verifyJWT };