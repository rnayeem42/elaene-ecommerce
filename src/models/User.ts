import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name?: string | null;
  email: string;
  password?: string; // password may be omitted for OAuth users
  createdAt?: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, default: null },
  email: { type: String, required: true, unique: true, lowercase: true },
  // set select: false so password is not returned by default
  password: { type: String, required: false, select: false },
  createdAt: { type: Date, default: Date.now },
});

// Prevent model overwrite upon hot reloads in dev
const User: Model<IUser> = (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>("User", UserSchema);
export default User;