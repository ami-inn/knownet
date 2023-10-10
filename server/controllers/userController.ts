import { Request,Response,NextFunction } from "express";
import userModel from "../models/usermodel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsynError } from "../middleware/catchAsyncError";
import jwt, { Secret } from "jsonwebtoken";
require('dotenv').config()
import ejs from 'ejs'
import path from "path";
import sendMail from "../utils/sendMail";


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

        const isEmailExist = await userModel.findOne({email})

        if(isEmailExist){
            return next(new ErrorHandler("error already exist",400))
        }

        const user:IRegistrationBody={
            name,
            email,
            password
        }

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
    const activationCode = Math.floor(1000+ Math.random()+9000).toString()

    const token = jwt.sign({
        user,activationCode
    },process.env.ACTIVATION_SECRET as Secret,{expiresIn:"5m"})

    return {token,activationCode}
}