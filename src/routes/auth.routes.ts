import { Router } from 'express';
import {
  //verifyEmailController,
  confirmVerificationCodeController,
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
  getCountriesController
} from '../controllers/auth.controllers';

// New Router instance
const router = Router();

// Auth routes

//router.post('/verifyEmail', verifyEmailController);
router.post('/register', registerController);
router.post('/confirmVerification', confirmVerificationCodeController);
router.post('/login', loginController);
router.post('/forgotPassword', forgotPasswordController);
router.post('/resetPassword', resetPasswordController);
router.get('/getCountries', getCountriesController);


export default router;