import NotificationModel from "../models/notificationModel";
import { NextFunction,Request,Response } from "express";
import { CatchAsynError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cron from 'node-cron'

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

// update notification status - only admin

export const updateNotification = CatchAsynError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        
        const notification = await NotificationModel.findById(req.params.id)

        if(!notification){
            return next(new ErrorHandler("notification not found",400))
        }else{    
            notification?.status? notification.status = "read":notification?.status
        }

        await notification.save()

        // why after saving not sending single notification
        // when we updating notification we need to update the front end state also thats why we sending all updated notification from here


        const notifications = await NotificationModel.find().sort({createdAt:-1})

        res.status(201).json({
            success:true,
            notifications
        })

    } catch (error:any) {
        return next(new ErrorHandler(error.message,404))
    }
})

// delete notification with cron job thats we doing

// delete notification only on admin

// cron.schedule("*/5 * * * * *",function(){
//     console.log('---------------');
//     console.log('running cron');
//     // read it from npm cron
    
// })
// we need to call it in every mid night
cron.schedule('0 0 0  * * *',async()=>{
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30d  24hr 60min 60sec 1000millisecond
    await NotificationModel.deleteMany({status:"read",createdAt:{$lt:thirtyDaysAgo}}) //deleting morethan thirty days ago
    // every 12 hr it check the logic delete or not like that
    console.log('Delete read notification');    
})
