import express from 'express';
import { registerationUser } from '../controllers/userController';


const userRouter = express.Router()

userRouter.post('/registration',registerationUser)

export default userRouter