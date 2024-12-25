import { Request, Response } from 'express';
import {
  createUser,
  getUserByEmail,
  updateUser,
  updateUserPasswordByEmail,
} from '../models/users.models';
import { getEmailByName, createEmail, updateEmail } from '../models/emails.models';
import { generateRandomCode } from '../services/generateVerificationCode';
import sendEmail from '../services/sendEmail';
import { hashPassword } from '../services/authServices';
import { uploadImage } from '../services/fileService';
import { isPasswordMatch } from '../services/authServices';
import { generateToken } from '../services/tokenService';
import countries from '../data/countries';
const nodeoutlook = require('../services/outlookSendEmail');


/* export const verifyEmailController =  async (req: Request, res: Response) => {
  try {
    const {email} = req.body;
    console.log(email)
    // check if email has been taken
    const userData = await getUserByEmail(email);
    const emailData = await getEmailByName(email);
    // check if email belongs to a user
    
    
    // generate 4 digit code
    const randomCode = generateRandomCode();
    if(emailData?.email){
      //update it with the new verification code
      await updateEmail(email, {code: randomCode})
    }else{
      // save verification code in email model
      await createEmail({email: email, code: randomCode})
    }
    // send email to user email
    await sendEmail({email, code: randomCode});

    res.status(200).json({ message: "Verification code will be sent to email", status: "success", payload: {code: randomCode} });
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
}; */



export const registerController =  async (req: Request, res: Response) => {
  try {
    const {firstName, lastName, email, password, country} = req.body;

    // check if email has been taken
    const userData = await getUserByEmail(email);
    // check if email belongs to a user
    if(userData){
      return res.status(400).json({ message: "Email has already been taken", status: "error" });
    }

    if (password?.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long", status: "error" })
    }
    const hashedPassword = await hashPassword(password)
    // create user 
    const user = await createUser({firstName, lastName, country, email, password: hashedPassword})

    // generate 4 digit code
    const randomCode = generateRandomCode();

    // save verification code in email model
    await createEmail({email: email, code: randomCode})

    // send verification code to user's email
    let result = await sendEmail({email, code: randomCode});
    console.log(result)
    
    return res.status(201).json({message: "User Registration Successful", status: "success", payload: user})
  } catch (error: any) {
    return res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const confirmVerificationCodeController =  async (req: Request, res: Response) => {
  try {
    const {email, code} = req.body;
    // get Email Data
    const emailData = await getEmailByName(email);
    const userData = await getUserByEmail(email)

    //check if email exists
    if(!emailData || !userData){
      return res.status(400).json({ message: "Email does not exist", status: "error" })
    }
    
    // check if code is valid
    if (emailData?.code !== parseInt(code)) {
      return res.status(400).json({ message: "Invalid code", status: "error" })
    }else{
      await updateEmail(email, {verified: true})
      await updateUser(userData?.id, {emailVerified: true})
      return res.status(200).json({ message: "Email Verification Successful", status: "success" });
    }
  } catch (error: any) {
    return res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const loginController =  async (req: Request, res: Response) => {
  try {
    const {email, password} = req.body;
    // check if user exists
    const userData = await getUserByEmail(email)    
    if(!userData){
      res.status(400).json({message: "Email or Password Invalid", status: "error"})
    }
    // check if email is verified
    if(!userData?.emailVerified){
      return res.status(400).json({message: "Email is not verified", status: "error"})
    }

    // check if password matches
    let passwordMatched = await isPasswordMatch(password, userData.password);
    if (!passwordMatched) {
      return res.status(400).json({ message: "Email or Password Invalid", status: "error" })
    } 
    const token = generateToken({userId: userData?.id, email, expires: process.env.ACCESS_TOKEN_EXPIRY, type: 'ACCESS', secret: process.env.SECRET,})
    return res.status(201).json({message: "User Login Successful", status: "success", payload: {token: token} })
  } catch (error: any) {
    return res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const forgotPasswordController =  async (req: Request, res: Response) => {
  try {
    const {email} = req.body;
    let user = await getUserByEmail(email); 
    if(!user){
      return res.status(404).json({message: 'User with email does not exist', status: "error"})
    }
    const randomCode = generateRandomCode()
    await updateEmail(email, {code: randomCode})
    await sendEmail({email, code: randomCode, title: "Forgot Password Verification Mail", message: "reset your password"});
    
    return res.status(200).json({message: "Verification Code sent to email", status: "success", payload: {code: randomCode}})
  } catch (error: any) {
    return res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const resetPasswordController =  async (req: Request, res: Response) => {
  try {
    const { code, email, newPassword } = req.body;
    const emailData = await getEmailByName(email);
    if (newPassword?.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long", status: "error" })
    }
    if (emailData?.code !== parseInt(code)) {
      return res.status(400).json({ message: "Invalid reset password code", status: "error" })
    } else {
      const hashedPassword = await hashPassword(newPassword);
      await updateUserPasswordByEmail(email, { password: hashedPassword })
    }
    return res.status(200).json({ message: "password reset successful", status: "success" })

  } catch (error: any) {
    return res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getCountriesController =  async (req: Request, res: Response) => {
  try {
    res.status(200).json({ message: "Countries fetched Successfully", status: "success", payload: countries }) 
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};
