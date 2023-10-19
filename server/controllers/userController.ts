import { Request,Response,NextFunction } from "express";
import userModel, { IUser } from "../models/usermodel";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsynError } from "../middleware/catchAsyncError";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
require('dotenv').config()
import ejs from 'ejs'
import path from "path";
import sendMail from "../utils/sendMail";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt";
import { isAsyncFunction } from "util/types";
import { redis } from "../utils/redis";
import { getAllUsersService, getUserById } from "../services/user.service";

import cloudinary from 'cloudinary'



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

        const user = await userModel.findOne({email}).select("+password")

        console.log(user,"usersss");
        

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


// update access token

// these will simply update our access token because it expire after 5 min . so we need to update it 

export const updateAccessToken = CatchAsynError(async(req:Request,res:Response,next:NextFunction) =>{

    try {

        const refresh_token = req.cookies.refresh_token as string

        // we need to validate the refresh token
        const decoded = jwt.verify(refresh_token,process.env.REFRESH_TOKEN as string
            ) as JwtPayload

            const message = "Could not refresh token"

            if(!decoded){
                return next(new ErrorHandler(message,400))
            }

            // refresh token will expire after 3 days
            // then automatically call this oune and change and refresh and accqess token this mean refresh token never expires

            const session = await redis.get(decoded.id as string)

            if(!session){
                return next(new ErrorHandler(message,400))
            }

            const user = JSON.parse(session)

            const accessToken = jwt.sign({id:user._id},process.env.ACCESS_TOKEN as string,{expiresIn:"5m"})

            const refreshToken = jwt.sign({id:user._id},process.env.REFRESH_TOKEN as string,{expiresIn:"3d"})

            // we successfully sign two new token

            // update the cookie

            req.user = user

            res.cookie("access_token",accessToken,accessTokenOptions)
            res.cookie("refresh_token",refreshToken,refreshTokenOptions)

            res.status(200).json({
                status: "success",
                accessToken
            })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,404))
    }

})

// get user info

export const getUserInfo = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {

    try {

        const userId = req.user?._id

        console.log(req.user);
        

        getUserById(userId,res)

        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }

})

interface iSocialAuthBody{
    name:string
    email:string
    avatar:string
}

//  Social auth

export const socialAuth = CatchAsynError(async(req:Request,res:Response,next:NextFunction)=>{
    try {

        const {email,name,avatar} = req.body as iSocialAuthBody

        const user = await userModel.findOne({email})

        if(!user){
            const newUser = await userModel.create({avatar,name,email})
            sendToken(newUser,200,res)
        }
        else{
            sendToken(user,200,res) // if user have auth
        }

        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})

// update User Info 

interface IUpdateUserInfo{
    name?:string
    email?:string
}

export const updateUserInfo = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {

    try {

        const {name,email} = req.body as IUpdateUserInfo

        const userId = req.user?._id

        const user = await userModel.findById(userId)

        if(email && user){
            // entering email not name then this will call
            // suppose user is update the email user is exist on your dbs cant be added

            const isEmailExist = await userModel.findOne({email})

            if(isEmailExist){
                return next(new ErrorHandler("email already exists",400))
            }

            user.email = email

        }
        if(name && user){
            user.name = name
        }

        await user?.save()

        await redis.set(userId,JSON.stringify(user))

        res.status(201).json({
            success:true,
            user
        })
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }

})

// update user Password

interface iUpdatePassword{
    oldPassword:string
    newPassword:string
}

export const updatePassword = CatchAsynError(async(req:Request,res:Response,next:NextFunction) => {

    try {
        
        const {oldPassword,newPassword} = req.body as iUpdatePassword

        if(!oldPassword || !newPassword){
            return next(new ErrorHandler("please enter old password and new password",400))
        }

        const user = await userModel.findById( req.user?._id).select("password") //select false in user model

        if(user?.password == undefined){
            return next(new ErrorHandler("ivalid user",400))
        }

        const isPasswordMatch = await user?.comparePassword(oldPassword)

        if(!isPasswordMatch){
            return next(new ErrorHandler('invalid password',400))
        }

        // if the user dont have password like goofle auth login user cant have the password so we need to handle that too

        user.password = newPassword

        await user.save()
        await redis.set(req.user?._id,JSON.stringify(user))

        res.status(200) . json({success:true,user})


    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }

})

// update profile picture or avatar

interface iUpdateProfilePicture{
    avatar:string
}

export const updateProfilePicture = CatchAsynError(async(req:Request,res:Response,next:NextFunction) =>{
    try {

        const {avatar} = req.body as iUpdateProfilePicture

        const userId = req.user?._id

            const user = await userModel.findById(userId)

            if(avatar && user){
                if(user?.avatar?.public_id){
                    // if we have publica id that means the profle picture is already uploaded in cloudinary
                    // we delete the existing picture
                    await cloudinary.v2.uploader.destroy(user?.avatar?.public_id)

                    //after deleting the old picture

                    const myCloud = await cloudinary.v2.uploader.upload(avatar,{folder:"avatars",width:150})
        
                    user.avatar  = {
                        public_id:myCloud.public_id,
                        url:myCloud.secure_url
                    }
                }else{

                    
                    const myCloud = await cloudinary.v2.uploader.upload(avatar,{folder:"avatars",width:150})
        
                    user.avatar  = {
                        public_id:myCloud.public_id,
                        url:myCloud.secure_url
                    }
                 
                }
            }

            await user?.save()

            await redis.set(userId,JSON.stringify(user))

            res.status(200).json({
                success:true,
                user
            })
       

     
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,400))
    }
})

// get all users only for admin

export const getAllUsers = CatchAsynError(async(req:Request,res:Response,next:NextFunction) =>{

    try {

        getAllUsersService(res)
        
    } catch (error:any) {
        return next(new ErrorHandler(error.message,404))
    }

}) 

