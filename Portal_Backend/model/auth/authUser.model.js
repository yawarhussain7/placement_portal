import mongoose from "mongoose";

const AuthUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    bio: {
      type: String,
      default: ""
    },

    avatar: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("AuthUser", AuthUserSchema);

export default User;