import { Router } from 'express';
import {
  getDisputesController,
  getDisputeByIdController,
  createDisputeController,
  updateDisputeController,
  deleteDisputeController
} from '../controllers/dispute.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Disputes routes
router.get('/', authValidation, getDisputesController);
router.get('/:id', authValidation, getDisputeByIdController);
router.post('/', authValidation, createDisputeController);;
router.patch('/:id', authValidation, updateDisputeController);
router.delete('/:id', authValidation, deleteDisputeController);

export default router;