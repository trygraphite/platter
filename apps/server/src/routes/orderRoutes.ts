import express from 'express';
import orderController from '../controllers/orderController';

const router: express.Router = express.Router();

// Fixed route ordering to avoid conflicts

// POST - Create a new order
router.post('/', orderController.createOrder);


// GET - Get all new orders
router.get('/new', orderController.getNewOrders);

// GET - Get a single order
router.get('/:id', orderController.getOrder);

// PUT - Update an order
router.put('/:id', orderController.updateOrder);

// DELETE - Delete an order
router.delete('/:id', orderController.deleteOrder);

export default router;