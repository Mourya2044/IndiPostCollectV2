import express from 'express';
import { createCheckoutSession, sessionStatus, payExistingOrder } from '../controllers/stripe.controller.js';
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/pay-existing-order', protect, payExistingOrder);

router.get('/session-status', protect, sessionStatus);

export default router;