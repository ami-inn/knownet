import express from 'express';
import { activateUser, getUserInfo, loginUser, logoutUser, registerationUser, updateAccessToken } from '../controllers/userController';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';


const userRouter = express.Router()

userRouter.post('/registration',registerationUser)

userRouter.post('/activate-user',activateUser)

userRouter.post('/login',loginUser)

userRouter.get('/logout',isAuthenticated,authorizeRoles("admin"), logoutUser)

userRouter.get('/refresh',updateAccessToken) // when we hitting it we getting new tokens

userRouter.get('/me',isAuthenticated,getUserInfo)

export default userRouter