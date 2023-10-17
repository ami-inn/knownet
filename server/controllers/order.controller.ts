import { NextFunction,Request, Response } from "express";
import { CatchAsynError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel,{IOrder} from "../models/orderModel";
import userModel from "../models/usermodel";
import courseModel from "../models/course.model";
import path from "path";
import ejs from "ejs"
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notificationModel";
import { newOrder } from "../services/order.service";


// create order

export const createOrder = CatchAsynError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const {courseId,payment_info} = req.body as IOrder

        const user = await userModel.findById(req.user?._id)

        // we need to search that is this user already purchased or not then the user cant order the same course again

        const courseExists = user?.courses.some((course:any)=> course._id.toString() === courseId) // returen true of false check some method


        if(courseExists){
            // means already purchased
            return next(new ErrorHandler("you have already purchased this course",400))
        }

        const course = await courseModel.findById(courseId)

        if(!course){
            return next(new ErrorHandler("course not found",400))
        }

        const data:any = {
            courseId:course._id,
            userId:user?._id
        }

        newOrder(data,res,next)

        // after creating order we need to send an mail to the user
        const mailData = {
            order:{
                _id:course._id.slice(0,6),
                name:course.name,
                price:course.price,
                date:new Date().toLocaleDateString("en-US",{year:"numeric",month:'long',day:"numeric"})
            }
        }

        const html = await ejs.renderFile(path.join(__dirname,"../mails/"),{order:mailData}) // in ejs we are targeting order price like that


        try {

            if(user){
                await sendMail({
                    email:user.email,
                    subject:"Order Confirmation",
                    template:"order-confirmation.ejs",
                    data:mailData
                })
               }  
            
        } catch (error:any) {
            return next(new ErrorHandler(error.message,404))
        }

        user?.courses.push(course?._id)

        await user?.save()

        // we also send the notification

        await NotificationModel.create({
            user:user?._id,
            title:"new order",
            message:`you have a new order from ${course?.name}`
        });

        res.status(201).json({
            success:true,
            course
        })



        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})


