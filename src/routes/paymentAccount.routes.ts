import { Router } from 'express';
import {
  getPaymentAccountsController,
  getPaymentAccountByIdController,
  createPaymentAccountController,
  updatePaymentAccountController,
  deletePaymentAccountController
} from '../controllers/paymentAccount.controller';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// PaymentAccounts routes
router.get('/', authValidation, getPaymentAccountsController);
router.get('/:id', authValidation, getPaymentAccountByIdController);
router.post('/', authValidation, createPaymentAccountController);;
router.patch('/:id', authValidation, updatePaymentAccountController);
router.delete('/:id', authValidation, deletePaymentAccountController);

export default router;