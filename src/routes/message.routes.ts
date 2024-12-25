import { Router } from 'express';
import {
  getMessagesController,
  getMessageByIdController,
  createMessageController,
  updateMessageController,
  deleteMessageController
} from '../controllers/message.controllers';

import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Messages routes
router.get('/', authValidation, getMessagesController);
router.get('/:id', authValidation, getMessageByIdController);
router.post('/', authValidation, createMessageController);;
router.patch('/:id', authValidation, updateMessageController);
router.delete('/:id', authValidation, deleteMessageController);

export default router;