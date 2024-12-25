import { Router } from 'express';
import {
  getEscrowsController,
  getEscrowByIdController,
  createEscrowController,
  updateEscrowController,
  deleteEscrowController
} from '../controllers/escrow.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Escrows routes
router.get('/', authValidation, getEscrowsController);
router.get('/:id', authValidation, getEscrowByIdController);
router.post('/', authValidation, createEscrowController);;
router.patch('/:id', authValidation, updateEscrowController);
router.delete('/:id', authValidation, deleteEscrowController);

export default router;