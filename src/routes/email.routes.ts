import { Router } from 'express';
import {
  getAllEmailsController,
  getEmailByNameController,
  updateEmailController,
  deleteEmailController,
} from '../controllers/email.controllers';
import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Emails routes
router.get('/', getAllEmailsController);
router.get('/:email', getEmailByNameController);
router.patch('/:email', updateEmailController);
router.delete('/:email', deleteEmailController);

export default router;