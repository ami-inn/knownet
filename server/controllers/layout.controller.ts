import { NextFunction,Request,Response } from "express";
import { CatchAsynError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import layoutModel from "../models/layout.model";
import cloudinary from 'cloudinary'

// create layout

export const createLayout = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        
        const {type} = req.body;

        if(type === "Banner"){
            const {image,title,subtitle}=req.body

            const myCloud = await cloudinary.v2.uploader.upload(image,{
                folder:"layout"
            })

            const banner = {
                image:{
                    public_id:myCloud.public_id,
                    url:myCloud.secure_url
                },
                title,
                subtitle

            }

            await layoutModel.create(banner)
        }

        if(type === "FAQ"){
            const {faq} = req.body // we have question and answer
            await layoutModel.create(faq)
        }

        if(type == 'Categories'){
            const categories = req.body;
            await layoutModel.create(categories)
        }

        res.status(200).json({
            success:true,
            message:"layout schema created successfully"
        })



    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})