import { Router } from 'express';
import {
  getAttachmentsController,
  getAttachmentByIdController,
  createAttachmentController,
  updateAttachmentController,
  deleteAttachmentController
} from '../controllers/attachment.controllers';
import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', authValidation, getAttachmentsController);
router.get('/:id', authValidation, getAttachmentByIdController);
router.post('/', authValidation, createAttachmentController);;
router.patch('/:id', authValidation, updateAttachmentController);
router.delete('/:id', authValidation, deleteAttachmentController);

export default router;