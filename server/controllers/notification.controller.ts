import NotificationModel from "../models/notificationModel";
import { NextFunction,Request,Response } from "express";
import { CatchAsynError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";


// get all notifications - only for admin
export const getNotification = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {
    try {

        const notifications = await NotificationModel.find().sort({createdAt:-1})
        // we wanted new one to top thats why we sorting
        res.status(201).json({
            success: true,
            notifications
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,404))
    }
})