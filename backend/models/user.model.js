import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      minlength: [3, "Username must be atleast 3 characters"],
      maxLength: [40, "Username cannot exceed 40 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email should be unique"],
      lowercase: [true, "Email should be lowercase"],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
     isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      type: String,   // 6-digit OTP (stored as string)
    },
    codeExpiry: {
      type: Date,     // when the code expires
    },
    projects:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Project"
    }]
  },
  { timestamps: true }
);



const User = mongoose.model('User',UserSchema)

export default User;