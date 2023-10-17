import { NextFunction } from "express";
import { CatchAsynError } from "../middleware/catchAsyncError";
import OrderModel from "../models/orderModel";


// create new order

export const newOrder = CatchAsynError(async(data:any,next:NextFunction) => {
    const order = await OrderModel.create(data)
    next(order)
})