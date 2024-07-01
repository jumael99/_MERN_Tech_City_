import mongoose from "mongoose";
import * as console from "node:console";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (e) {
        console.log(`mongoDB connection error:${e}`);
        process.exit(1);
    }
}

export default connectDB;