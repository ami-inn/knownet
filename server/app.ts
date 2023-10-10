import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
require("dotenv").config();

// Body Parser
app.use(express.json({ limit: "50mb" })); // limit of the body parser data

// cookie parser
// when sending cookes data from front end
app.use(cookieParser());

// cors = cross orign resource sharing
// if any one try to add this api in any other server. they can heat our server
app.use(
  cors({
    origin: process.env.ORIGIN,
  })
);

// Testing Api

app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "api is working",
  });
});


// unknow route
app.all("*",(req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Route ${req.originalUrl} not found`)
    next(err)
})
