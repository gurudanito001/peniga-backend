import { Router } from 'express';
import {
  deleteUserController,
  getUserByIdController,
  getUsersController,
  updateUserController,
  disableUserController,
  enableUserController,
  setProfileImageController,
  changePasswordController,
} from '../controllers/users.controllers';
import authValidation from '../utils/validators/auth.validators';

// New Router instance
const router = Router();

// Users routes
router.get('/', getUsersController);
//router.get('/:id', authValidation, getUserByIdController);
router.get('/getUserData', authValidation, getUserByIdController);
router.patch('/disable/:userId', authValidation, disableUserController);
router.patch('/enable/:userId', authValidation, enableUserController);
router.patch('/profile', authValidation, updateUserController);
router.delete('/:id', deleteUserController);
router.patch('/profileImage', authValidation, setProfileImageController);
router.patch('/changePassword', authValidation, changePasswordController);


export default router;