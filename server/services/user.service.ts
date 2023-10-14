
import { Response } from "express"
import userModel from "../models/usermodel"
import { redis } from "../utils/redis"


//  get user by id
export const getUserById = async (id:string,res:Response) =>{

    // const user = await userModel.findById(id)

    const userJson = await redis.get(id)

    if(userJson){
        const user = JSON.parse(userJson)
        res.status(200).json({
            success: true,
            user
        })
    }

  

}