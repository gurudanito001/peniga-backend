import { Router } from 'express';
import {
  getTempAccountsController,
  getTempAccountByContractIdController,
  createTempAccountController,
  updateTempAccountController,
  deleteTempAccountController
} from '../controllers/tempAccount.controllers';

import { generateEscrowAccountController, getTransferFeesController, validatePaymentWebhookController, transferToSellerBankAccountController, getBankCodesController, checkTransferStatusController, validateAccountController } from '../controllers/escrowAccount.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Temp Account routes
router.post('/generate', authValidation, generateEscrowAccountController);
router.post('/getTransferFees', authValidation, getTransferFeesController);
router.post('/validatePayment', validatePaymentWebhookController);
router.post('/transfer', authValidation, transferToSellerBankAccountController)
router.get('/transfer/:id', authValidation, checkTransferStatusController)
router.post('/getBanks', authValidation, getBankCodesController)
router.post('/validateBankAccount', authValidation, validateAccountController)
router.get('/', authValidation, getTempAccountsController);
router.get('/:id', authValidation, getTempAccountByContractIdController);
router.post('/', authValidation, createTempAccountController);
router.patch('/:id', authValidation, updateTempAccountController);
router.delete('/:id', authValidation, deleteTempAccountController);

export default router;