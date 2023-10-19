
import { Response } from "express"
import userModel from "../models/usermodel"
import { redis } from "../utils/redis"


//  get user by id
export const getUserById = async (id:string,res:Response) =>{

    // const user = await userModel.findById(id)

    console.log('enter heree');
    

    const userJson = await redis.get(id)

    console.log(userJson);
    

    if(userJson){
        const user = JSON.parse(userJson)
        res.status(200).json({
            success: true,
            user
        })
    }

  

}

// get all users

export const getAllUsers = async(res:Response) =>{
    const users = await userModel.find().sort({createdAt:-1})

    res.status(201).json({
        success: true,
        users
    })
}