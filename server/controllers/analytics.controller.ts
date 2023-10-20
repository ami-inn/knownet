import { Request,Response,NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsynError } from "../middleware/catchAsyncError";
import { generateLast12MonthDate } from "../utils/analytics.generator";
import userModel from "../models/usermodel";
import courseModel from "../models/course.model";
import OrderModel from "../models/orderModel";



// get user analytics only for admin

export const getUserAnalytics = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {
    try {

        const users = await generateLast12MonthDate(userModel)

        res.status(200).json({
            success:true,
            users
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,404))
    }
})

export const getCourseAnalytics = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {
    try {

        const courses = await generateLast12MonthDate(courseModel)

        res.status(200).json({
            success:true,
            courses
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,404))
    }
})


export const getOrderAnalytics = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {
    try {

        const orders  = await generateLast12MonthDate(OrderModel)

        res.status(200).json({
            success:true,
            orders
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,404))
    }
})