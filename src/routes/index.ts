import { Router } from 'express';
import homeRoutes from './home.routes';
import userRoutes from './users.routes';
import authRoutes from './auth.routes';
import messageRouter from './message.routes';
import disputeRoutes from './dispute.routes';
import contractRoutes from './contract.routes';
import escrowRoutes from './escrow.routes';
import paymentRoutes from './payment.routes';
import notificationRoutes from './notification.routes';
import attachmentRoutes from './attachment.routes';
import paymentAccountRoutes from './paymentAccount.routes';
import emailRoutes from './email.routes';
import tempAccountRoutes from './tempAccount.routes'

// Create a new Router instance
const router = Router();

// Mount the routers
router.use('/', homeRoutes);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/contract', contractRoutes);
router.use('/dispute', disputeRoutes);
router.use('/escrow', escrowRoutes);
router.use('/attachment', attachmentRoutes);
router.use('/payment', paymentRoutes);
router.use('/notification', notificationRoutes);
router.use('/paymentAccount', paymentAccountRoutes);
router.use('/tempAccount', tempAccountRoutes);
router.use('/message', messageRouter);
router.use('/email', emailRoutes);

export default router;