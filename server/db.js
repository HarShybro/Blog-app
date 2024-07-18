import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connnectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `mongodb+srv://harsharma7190:harsh123@cluster0.hedlj9k.mongodb.net/${process.env.DB_NAME}`
    );
    console.log("Mongo DB connect!! ", connectionInstance.connection.host);
  } catch (error) {
    console.log("ERROR: mongodb connection failed", error);
  }
};

export default connnectDB;
