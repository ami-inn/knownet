import { Request,Response,NextFunction } from "express";
import { CatchAsynError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from 'cloudinary'
import { createCourse } from "../services/course.service";
import courseModel from "../models/course.model";



// upload course

export const uploadCourse = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {
    try {

        const data = req.body

        const thumbnail = data.thumbnail

        if(thumbnail){
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"courses"
            })

            data.thumbnail = {
                public_id:myCloud.public_id,
                url :myCloud.secure_url
            }
        }

        createCourse(data,res,next)

        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})

// edit course

export const editCourse = CatchAsynError(async(req:Request,res:Response,next:NextFunction) =>{
    try {

        const data = req.body;

        const thumbnail = data.thumbnail

        if(thumbnail){
            await cloudinary.v2.uploader.destroy(thumbnail.public_id)

            const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{folder:"courses"})

            data.thumbnail = {
                public_id:myCloud.public_id,
                url:myCloud.secure_url
            }
        }

        const courseId = req.params.id;
        
        const course = await courseModel.findByIdAndUpdate(courseId,
            {$set:data},
            {new:true}
            )

        res.status(201).json({
            success: true,
            course
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,500))
    }
})

// get single course = we dont purchasing every one to acess this 

export const getSingleCourse =  CatchAsynError(async(req:Request,res:Response,next:NextFunction) =>{
    try {

        const course = await courseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

        res.status(200).json({
            success:true,
            course
        })
        
    } catch (error : any) {
      return next(new ErrorHandler(error.message,400))        
    }
})

// get all the courses without purchase

export const getAllCourses = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {

    try {

        const courses = await courseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

        res.status(200).json({
            success:true,
            courses
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})