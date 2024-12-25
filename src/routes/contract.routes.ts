import { Router } from 'express';
import {
  getContractsController,
  getContractByIdController,
  createContractController,
  updateContractController,
  setSellerIdOnContract,
  agreeToContract,
  deleteContractController
} from '../controllers/contract.controller';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Contracts routes
router.get('/', authValidation, getContractsController);
router.get('/:id', authValidation, getContractByIdController);
router.post('/', authValidation, createContractController);;
router.patch('/:id', authValidation, updateContractController);
router.patch('/setSellerId/:id', authValidation, setSellerIdOnContract);
router.patch('/agree/:id', authValidation, agreeToContract);
router.delete('/:id', authValidation, deleteContractController);

export default router;