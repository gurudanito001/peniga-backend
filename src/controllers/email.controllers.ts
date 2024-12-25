import { Request, Response } from 'express';
import {
  getAllEmails,
  getEmailByName,
  updateEmail,
  deleteEmail
} from '../models/emails.models';


export const getAllEmailsController =  async (req: Request, res: Response) => {
  try {
    const emails = await getAllEmails({});
    res.status(200).json({ message: "Emails fetched successfully", payload: emails });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getEmailByNameController = async(req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const emailData = await getEmailByName(email);
    if (emailData) {
      res.status(200).json({ message: "Email fetched successfully", payload: emailData });
    } else {
      res.status(404).json({ message: 'Email not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};



export const updateEmailController = async(req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const updateData = req.body;
    const updatedEmail = await updateEmail(email, updateData);
    res.status(200).json({ message: "Email updated successfully", payload: updatedEmail });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteEmailController = async(req: Request, res: Response) => {
  try {
    const email = req.params.email;
    const emailData = await deleteEmail(email);
    res.status(200).json({
      message: `Email: ${email} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
  
};