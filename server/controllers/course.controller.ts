import { Request,Response,NextFunction } from "express";
import { CatchAsynError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from 'cloudinary'
import { createCourse } from "../services/course.service";
import courseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from 'ejs'
import path from "path";
import sendMail from "../utils/sendMail";



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

        const courseId = req.params.id;

        const isCacheExist = await redis.get(courseId)

        if(isCacheExist) {
            //  if the course exist in redis it give from cache
            // suppose 10k people comming in website and hitting the server. cache is very fast dont impact in our server
            const course = JSON.parse(courseId)

            res.status(200).json({
                success:true,
                course
            })
        }
        else{
            
        const course = await courseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

        await redis.set(courseId,JSON.stringify(course))
        
        res.status(200).json({
            success:true,
            course
        })
    }
        
    } catch (error : any) {
      return next(new ErrorHandler(error.message,400))        
    }
})

// get all the courses without purchase

export const getAllCourses = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {

    try {

        const isCacheExist = await redis.get("allCourses")
        
        if(isCacheExist){
            console.log('enter cacheee');
            
            const courses = JSON.parse(isCacheExist)
            res.status(200).json({
                success:true,
                courses
            })
        }else{

            
            const courses = await courseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.questions -courseData.links")

            await redis.set("allCourses", JSON.stringify(courses))
            
            res.status(200).json({
                success:true,
                courses
            })
            
        }
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})

//  get course content = only for our valid user

export const getCourseByUser = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {
    try {

        const userCourseList = req.user?.courses // we have all courses data

        const courseId = req.params.id

        // this means the course exist in the userlist
        const courseExists = userCourseList?.find((course:any) => course._id.toString() === courseId)

        if(!courseExists){
            // in the user have courses its not have this course so its showing not eligible
            return next(new ErrorHandler("you are not eligible to access this course",401))
        }

        const course = await courseModel.findById(courseId)

        const content = course?.courseData

        res.status(200).json({
            success:true,
            content
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})

// add question in course

interface IAddQuestionData{
    question:string;
    courseId:string;
    contentId:string;
}

export const addQuestion = CatchAsynError(async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const{question,courseId,contentId}: IAddQuestionData = req.body
        const course:any= await courseModel.findById(courseId);

        if(!mongoose.Types.ObjectId.isValid(contentId)){
            // checking the objectId is valid or not
            return next( new ErrorHandler("invalid Content",401))
        }
            
        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId))

        if(!courseContent){
            return next (new ErrorHandler("invalid content id",400))
        }

        
        //  create a new question object

        const newQuestion:any = {
            user:req.user,
            question,
            questionReplies:[]
        }

        // add this questiont to our course content
        courseContent.questions.push(newQuestion)

        // save the updated course

        await course?.save()

        res.status(200).json({
            success:true,
            course
        })
        


        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})


// add answer in course question

interface IAnswerData{
    answer:string,
    courseId:string
    contentId:string
    questionId:string
}

export const addAnswer = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {
    try {
        const {answer,courseId,contentId,questionId} :IAnswerData =req.body
        const course:any = await courseModel.findById(courseId)

        if(!mongoose.Types.ObjectId.isValid(contentId)){
            // checking the objectId is valid or not
            return next( new ErrorHandler("invalid Content",401))
        }
            
        const courseContent = course?.courseData?.find((item: any) => item._id.equals(contentId))

        if(!courseContent){
            return next (new ErrorHandler("invalid content id",400))
        }

        const question = courseContent?.questions?.find((item:any) => item._id.equals(questionId))
        // find method return an object in that object we are searching it 

        if(!question){
            return next (new ErrorHandler("invalid question Id",400))
        }

        // create a new anser

        const newAnswer:any={
            user:req.user,
            answer
        }

        // add the answer to the course content
        question.questionReplies.push(newAnswer)

        await course?.save()

        // supose anser to the question . admin get notification when ask question . when admin reply we need to send an email to the user
        // who is q creator who is logged in . if i ask q and i not need to reply that.
        // when i reply to question no need ot send a email

        if(req.user?._id === question.user._id){
            // its means this is on reply 
            // create a new notification

        }
        else{
            // other people are anserig new answer add to your question
            const data={
                name: question.user.name,
                title:courseContent.title
            }

            const html = await ejs.renderFile(path.join(__dirname,"../mails/question-reply.ejs"),data)

            try {

                await sendMail({
                    email: question.user.email,
                    subject:"question reply",
                    template:"question-reply.ejs",
                    data
                })

                
            } catch (error:any) {

                return next(new ErrorHandler(error.message,400))
            }
        }

        res.status(200).json({
            success: true,
            course
        })
        
    } catch (error:any) {
    return next(new ErrorHandler(error.message,400))        
    }
})