import { Router } from 'express';
import {
  getTempAccountsController,
  getTempAccountByContractIdController,
  createTempAccountController,
  updateTempAccountController,
  deleteTempAccountController
} from '../controllers/tempAccount.controllers';

import { generateEscrowAccountController, getTransferFeesController, validatePaymentWebhook, transferToSellerBankAccount, getBankCodes } from '../controllers/escrowAccount.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Temp Account routes
router.post('/generate', authValidation, generateEscrowAccountController);
router.post('/getTransferFees', authValidation, getTransferFeesController);
router.post('/validatePayment', validatePaymentWebhook);
router.post('/transfer', authValidation, transferToSellerBankAccount)
router.post('/getBanks', authValidation, getBankCodes)
router.get('/', authValidation, getTempAccountsController);
router.get('/:id', authValidation, getTempAccountByContractIdController);
router.post('/', authValidation, createTempAccountController);
router.patch('/:id', authValidation, updateTempAccountController);
router.delete('/:id', authValidation, deleteTempAccountController);

export default router;