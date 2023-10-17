import mongoose, {Document,Model,Schema} from "mongoose";

export interface INotification extends Document{
    titles: string,
    message: string,
    status: string,
    userId:string,
}

const notificationSchema = new Schema<INotification>({
    titles:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        required:true,
        default:"Unread"
    }
},{timestamps:true});

const NotificationModel: Model<INotification> = mongoose.model("Notification",notificationSchema)

export default NotificationModel
