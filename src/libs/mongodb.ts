import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

let cached = (global as any).mongoose as {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} | undefined;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  
  await mongoose.connect(process.env.MONGODB_URI as string);
};

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

// default export রাখলাম যাতে কেউ dbConnect, connectDB দুই নামেই ব্যবহার করলেও ক্র্যাশ না করে
export default connectDB;
