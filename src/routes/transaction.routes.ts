import { Router } from 'express';
import {
  getTransactionsController,
  getTransactionByIdController,
  createTransactionController,
  updateTransactionController,
  deleteTransactionController
} from '../controllers/transaction.controller';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Transactions routes
router.get('/', authValidation, getTransactionsController);
router.get('/:id', authValidation, getTransactionByIdController);
router.post('/', authValidation, createTransactionController);;
router.patch('/:id', authValidation, updateTransactionController);
router.delete('/:id', authValidation, deleteTransactionController);

export default router;