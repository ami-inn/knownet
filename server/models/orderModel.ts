import mongoose, {Document,Model,Schema} from "mongoose";

export interface IOrder extends Document{
    courseId: string;
    userId:string;
    payment_info:object
}

const orderSchema = new Schema<IOrder>({
    courseId:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    },
    payment_info:{
        type:Object,
        // required:true, // its also required we add when do front end
    }
},{timestamps:true})

const OrderModel: Model<IOrder> = mongoose.model("Order",orderSchema)

export default OrderModel