import express from 'express';
import { activateUser, getAllUsers, getUserInfo, loginUser, logoutUser, registerationUser, socialAuth, updateAccessToken, updatePassword, updateProfilePicture, updateUserInfo } from '../controllers/userController';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';


const userRouter = express.Router()

userRouter.post('/registration',registerationUser)

userRouter.post('/activate-user',activateUser)

userRouter.post('/login',loginUser)

userRouter.get('/logout',isAuthenticated, logoutUser)

userRouter.get('/refresh',updateAccessToken) // when we hitting it we getting new tokens

userRouter.get('/me',isAuthenticated,getUserInfo)

userRouter.post('/social-auth',socialAuth)

userRouter.put('/update-user-info',isAuthenticated,updateUserInfo)

userRouter.put('/update-user-password',isAuthenticated,updatePassword)

userRouter.put('/update-user-avatar',isAuthenticated,updateProfilePicture)

userRouter.get('/get-all-users',isAuthenticated,authorizeRoles("admin"),getAllUsers)

export default userRouter