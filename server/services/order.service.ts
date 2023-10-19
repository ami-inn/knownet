import { NextFunction, Response } from "express";
import { CatchAsynError } from "../middleware/catchAsyncError";
import OrderModel from "../models/orderModel";


// create new order

export const newOrder = CatchAsynError(async(data:any,res:Response) => {
    const order = await OrderModel.create(data)
    res.status(201).json({
        success:true,
        order
    })
    // next(order)
})

// get all orders

export const getAllOrdersService = async(res:Response) =>{
    const orders = await OrderModel.find().sort({createdAt:-1})

    res.status(201).json({
        success: true,
        orders
    })
}