// we simply define some common error and call error handler

import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";

export const ErrorMiddleware = (err:any,req:Request,res:Response,next:NextFunction)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // wrong mdb id

    if(err.name === "CastError"){
        const message = "Request Not Found Invalid Store Path"
        err = new ErrorHandler(message,400)
    }

    // duplicate key error for auth
   
    if(err.statusCode === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(message,400)
    }

    // wrong jwt error wrong token get mail or something like that
    if(err.name === "jsonWebTokenError"){
        const message = "Json Web Token Is Invalid , Try Again"
        err = new ErrorHandler(message,400)
    }

    // jwt expires error
    if(err.name === "TokenExpiredError"){
        const message = "Json Web Token Expired , Try Again"
        err = new ErrorHandler(message,400)
    }


    res.status(err.statusCode).json({
        success:false,
        message:err.message
    })

    

}