import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    username: {
      type: String,
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
      default: "New User"
    },
    bio: {
      type: String,
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
    },

    website: {
      type: String,
      trim: true,
      minlength: [3, "Full name must be at least 3 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [
        /^[0-9]{10,15}$/,
        "Phone number must contain 10 to 15 digits",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [100, "Password cannot exceed 100 characters"],
      select: false,
    },

    avatar: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Gender must be Male, Female, or Other",
      },
    },

    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value) {
          return !value || value <= new Date();
        },
        message: "Date of birth cannot be in the future",
      },
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'light',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const studentModel = mongoose.model("Students", StudentSchema);

export default studentModel;