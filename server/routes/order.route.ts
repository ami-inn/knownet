import express from 'express';
import { authorizeRoles, isAuthenticated } from '../middleware/auth';
import { createOrder, getAllOrders } from '../controllers/order.controller';


const orderRouter = express.Router();

orderRouter.get('/get-all-orders',isAuthenticated,authorizeRoles("admin"),getAllOrders)

orderRouter.post('/create-order',isAuthenticated,createOrder)



export default orderRouter