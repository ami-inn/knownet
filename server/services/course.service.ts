import { Response } from "express";
import courseModel from "../models/course.model";
import { CatchAsynError } from "../middleware/catchAsyncError";


// create course

export const createCourse = CatchAsynError(async(data:any,res:Response)=>{
    const course = await courseModel.create(data)

    res.status(201).json({
        success: true,
        course
    })
})