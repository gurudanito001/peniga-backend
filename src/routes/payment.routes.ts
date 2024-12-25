import { Router } from 'express';
import {
  getPaymentsController,
  getPaymentByIdController,
  createPaymentController,
  updatePaymentController,
  deletePaymentController
} from '../controllers/payment.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Payments routes
router.get('/', authValidation, getPaymentsController);
router.get('/:id', authValidation, getPaymentByIdController);
router.post('/', authValidation, createPaymentController);;
router.patch('/:id', authValidation, updatePaymentController);
router.delete('/:id', authValidation, deletePaymentController);

export default router;