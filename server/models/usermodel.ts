import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs"; // for hashing our password
require('dotenv').config
import jwt from "jsonwebtoken";


const emailRegexPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// used for validating our email

// in this interface we can set our type
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<[courseId: string]>;
  comparePassword: (password: string) => Promise<boolean>; // method to compare password
  SignAccessToken:()=>string;
  SignRefreshToken:()=>string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a username"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "please enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please enter your password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// hash password before saving to dbs
// we are hashing the recieved password

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Sign Access Token 
// when user login we will create a access token . add it to json webtoken when user reeload or something we compare it

userSchema.methods.SignAccessToken = function () {
  return jwt.sign({id:this._id},process.env.ACCESS_TOKEN || '') // we are simply sign in out access token this will be logged in user_id adding access tooken
}

// sign refresh token

userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({id:this._id},process.env.REFRESH_TOKEN || "")
}

// compare password

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  // getting an password and return a promise
  return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
