import mongoose, { Document, Schema } from "mongoose";
import { Message, messageSchema } from "./Message";

export interface User extends Document {
  email: string;
  password: string;
  username: string;
  createAt: Date;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  isVerified: boolean;
  message: Message[];
}

const userSchema: Schema<User> = new Schema<User>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  createAt: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  isAcceptingMessage: {
    type: Boolean,
    required: true,
    default: true,
  },
  verifyCode: {
    type: String,
    required: true,
    default: "",
  },
  verifyCodeExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  message: [messageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", userSchema);

export default UserModel;
