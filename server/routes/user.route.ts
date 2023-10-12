import express from 'express';
import { activateUser, loginUser, registerationUser } from '../controllers/userController';


const userRouter = express.Router()

userRouter.post('/registration',registerationUser)

userRouter.post('/activate-user',activateUser)

userRouter.post('/login',loginUser)

export default userRouter