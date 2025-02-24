import { server } from "./main.js";

import connectDB from "./config/connectDB.js";
import connectCloudinary from "./config/connectCloudinary.js";

const PORT = process.env.PORT || 5000;

connectCloudinary();

connectDB()
   .then(() => {
      server.listen(PORT, () => {
         console.log(`Server listning on port: ${PORT}`);
      })
   })
   .catch((error) => {
      console.log("MONGO_DB Connection Failed", error);
   });