import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderModel } from '../models/order.model';
import auth from '../middlewares/auth.mid';

// Extend the Request interface to include user information
interface CustomRequest extends Request {
    user?: {
        id: string; // Define the structure of the user property
    };
}

const router = Router();
router.use(auth); // Ensure all routes require authentication

// Create a new order
router.post('/create', asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const requestOrder = req.body;

    // Check if the order has items
    if (!requestOrder.items || requestOrder.items.length <= 0) {
        res.status(HTTP_BAD_REQUEST).send('Cart is empty!');
        return;
    }

    // Create and save the new order
    const newOrder = new OrderModel({
        ...requestOrder,
        user: req.user?.id // Associate the order with the logged-in user
    });
    
    await newOrder.save();
    res.status(201).send(newOrder); // Return the created order
}));

// Get the latest new order for the current user
router.get('/newOrderForCurrentUser', asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const order = await getNewOrderForCurrentUser(req);
    if (order) {
        res.send(order);
    } else {
        res.status(HTTP_BAD_REQUEST).send('No new order found');
    }
}));

// Track an order by ID
router.get('/track/:id', asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const order = await OrderModel.findById(req.params.id);
    if (order) {
        res.send(order);
    } else {
        res.status(HTTP_BAD_REQUEST).send('Order not found');
    }
}));

// Fetch all orders made by the current user
router.get('/all', asyncHandler(async (req: CustomRequest, res: Response): Promise<void> => {
    const userId = req.user?.id;
    const orders = await OrderModel.find({ user: userId });
    res.send(orders); // Return all orders for the logged-in user
}));

export default router;

// Helper function to get the latest new order for the current user
async function getNewOrderForCurrentUser(req: CustomRequest): Promise<any> {
    return await OrderModel.findOne({
        user: req.user?.id
    });
}
