import mongoose from "mongoose"
import { DB_NAME } from "../constants.js";

const connectDB = async () => {

   try {
      const mongodb_url = `${process.env.MONGODB_URL}/${DB_NAME}`
      const connectionInstance = await mongoose.connect(mongodb_url)
      console.log("MONGO_DB Connected Successfully, Host = ", connectionInstance.connection.host);

   } catch (error) {
      console.log("MONGO_DB Connection Failed", error);
      process.exit(1);
   }
}

export default connectDB;