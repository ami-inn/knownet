require("dotenv").config();
import { Response } from "express";
import { IUser } from "../models/usermodel";
import { redis } from "./redis";
import { json } from "stream/consumers";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure?: boolean;
}

 // parse env variables to integrate with fallback values
  const accessTokenExpire = parseInt(
  process.env.ACCESS_TOKEN_EXPIRE || "300",
  10
);
const refreshTokenExpire = parseInt(
  process.env.REFRESH_TOKEN_EXPIRE || "1200",
  10
);

// options for cookies
export const accessTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60*60* 1000), //3 * 1000 milli sec its wrong
  maxAge: accessTokenExpire * 60 * 60* 1000, //5 min days 5 min sec and millisecond 
  httpOnly: true,
  sameSite: "lax",
  // secure:true only when in producction mode
};

export const refreshTokenOptions: ITokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire *24*60*60 * 1000),
  maxAge: refreshTokenExpire*24*60*60 * 1000, // 3 days
  httpOnly: true,
  sameSite: "lax",
};


export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessToken();
  const refreshToken = user.SignRefreshToken();

  //  upload session to redis for maintainin cache // successfully login add that session to redis
  redis.set(user._id,JSON.stringify(user) as any)  // setting user_id and send the full object our user 

 
  //   only set secure to true in production

  if (process.env.NODE_DEV == "production") {
    accessTokenOptions.secure = true;
  }

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    user,
    accessToken,
  });
};
