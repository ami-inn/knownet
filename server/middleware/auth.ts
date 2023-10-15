import { Request,Response,NextFunction, json } from "express";
import { CatchAsynError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";

//  Authenticated User
export const isAuthenticated = CatchAsynError(async(req:Request,res:Response,next:NextFunction) =>{
    const access_token = req.cookies.access_token;

    console.log(req.cookies);
    


    console.log(access_token);
    
    

    if(!access_token){
        // not login
        return next(new ErrorHandler("please login to access this resource ",400))
    }

    const decoded = jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload

    if(!decoded){
        // token not valid
        return next(new ErrorHandler("access token is not valid ",400))
    }
    
   

    const user = await redis.get(decoded.id) // because store datea in redis cache

    if(!user){
        return next(new ErrorHandler("user not found",400))
    }

    
    req.user = JSON.parse(user)
    next()
})

// validate user role

export const authorizeRoles = (...roles:string[]) => {

    // its not allow only for admin

    console.log('ernrerre');
    

    return (req:Request,res:Response,next:NextFunction) =>{
        console.log(req.user,'req user');

        console.log(roles);

        console.log(roles.includes(req.user?.role || ""));
        
        
        
        if(!roles.includes(req.user?.role || "")){

            return next (new ErrorHandler(`role ${req.user?.role} is not allowed to access this resource`,400))
        }

        console.log('enter');
        

        next()
    }
}

