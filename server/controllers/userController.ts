import { Request,Response,NextFunction } from "express";
import userModel, { IUser } from "../models/usermodel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsynError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
require('dotenv').config()
import ejs from 'ejs'
import path from "path";
import sendMail from "../utils/sendMail";
import { sendToken } from "../utils/jwt";
import { isAsyncFunction } from "util/types";
import { redis } from "../utils/redis";


// register User

interface IRegistrationBody{
    name:string,
    email:string,
    password:string,
    avatar?:string
}

export const registerationUser = CatchAsynError(async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const {name,email,password} = req.body

        console.log(req.body);
        

        const isEmailExist = await userModel.findOne({email})

        if(isEmailExist){
            return next(new ErrorHandler("error already exist",400))
        }

        const user:IRegistrationBody={
            name,
            email,
            password
        }

        console.log(user);
        

        const activationToken = createActivationToken(user)

        const activationCode = activationToken.activationCode // activation token is an object and activation code inside it

        const data = {user:{name:user.name},activationCode}

        const html = await ejs.renderFile(path.join(__dirname,"../mails/activation-mail.ejs"),data)//template path in string

        try {

            await sendMail({
                email:user.email,
                subject:'Activate Your Account',
                template:'activation-mail.ejs',
                data
            })

            res.status(200).json({
                success:true,
                message:'please check your email to activate your account',
                activationToken:activationToken.token
            })
            
        } catch (error:any) {
            return next(new ErrorHandler(error.message,400))
        }

        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})

interface isActivationToken{
    token:string,
    activationCode:string
}


export const createActivationToken = (user:any):isActivationToken =>{
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign({
        user,activationCode
    },process.env.ACTIVATION_SECRET as Secret,{expiresIn:"5m"})

    return {token,activationCode}
}


// activate user

interface IActivationRequest{
    activation_token:string,
    activation_code:string,
}

export const activateUser = CatchAsynError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log('enter here');
        
        const {activation_token,activation_code} = req.body as IActivationRequest

        const newUser:{user:IUser; activationCode:string } = jwt.verify(
            activation_token,
            process.env.ACTIVATION_SECRET as string
        ) as {user:IUser;activationCode:string}

        if(newUser.activationCode !== activation_code){
            return next(new ErrorHandler("Invalid activation code",400))
        }

        const {name,email,password} = newUser.user

        console.log(newUser.user);
        
        const existUser = await userModel.findOne({email})
        if(existUser){
            return next(new ErrorHandler("user already exist",400))
        }

        console.log('enteree',name,email,password);
        

        const user = await userModel.create({
            name,
            email,
            password
        })

        console.log(user);
        

        res.status(201).json({
            success:true,
        })

    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})



// Login User

interface ILoginRequest{
    email:string;
    password:string;
}

export const loginUser = CatchAsynError(async(req:Request,res:Response,next:NextFunction)=>{

    try{

        const {email,password} = req.body as ILoginRequest

        if(!email || !password){
            return next(new ErrorHandler("Please Input Email And Password",400))
        }

        const user = await userModel.findOne({email}).select("password")

        if(!user){
            return next(new ErrorHandler("invalid email or password",400))
        }

        const isPasswordMatch = await user.comparePassword(password)

        if(!isPasswordMatch){
            return next(new ErrorHandler("invalid email or password",400))
        }

        sendToken(user,200,res)


    }
    catch(error:any){
        return next(new ErrorHandler(error.message,404))
    }

})


// logout user

export const logoutUser = CatchAsynError(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        console.log('enter heree');
        
        res.cookie("access_token","",{maxAge:1}) // when logout we are setting the access token and the refresh token to empty
        res.cookie("refresh_token","",{maxAge:1})

        const userId = req.user?._id ||""

        redis.del(userId)

        res.status(200).json({
            succes:true,
            message:'logout successfully'
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,404))
    }
})