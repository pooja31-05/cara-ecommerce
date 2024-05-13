import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Successfully connected to MongoDb database ${conn.connection.host}`
    );
  } catch (error) {
    console.log(`Error in connecting MongoDB ${error}`);
  }
};

export default connectDB;
