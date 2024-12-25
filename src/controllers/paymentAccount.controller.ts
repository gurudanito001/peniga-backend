import { Request, Response } from 'express';
import {
  getAllPaymentAccounts,
  getPaymentAccountById,
  createPaymentAccount,
  updatePaymentAccount,
  deletePaymentAccount
} from '../models/paymentAccount.models';

import { getPaymentAccountsFilters, createPaymentAccountData, updatePaymentAccountData } from '../models/paymentAccount.models';


export const getPaymentAccountsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {userId: req?.query?.userId || req?.user?.userId} as getPaymentAccountsFilters
  try {
    const paymentAccounts = await getAllPaymentAccounts(filters, {page, take});
    res.status(200).json({ paymentAccount: "PaymentAccounts fetched successfully", payload: paymentAccounts });
  } catch (error: Error | any) {
    res.status(500).json({ paymentAccount: `Something went wrong ${error?.paymentAccount}` });
  }
};

export const getPaymentAccountByIdController = async(req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const paymentAccount = await getPaymentAccountById(id);
    if (paymentAccount) {
      res.status(200).json({ paymentAccount: "PaymentAccount fetched successfully", payload: paymentAccount });
    } else {
      res.status(404).json({ paymentAccount: 'PaymentAccount not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ paymentAccount: `Something went wrong ${error?.paymentAccount}` });
  }
};

export const createPaymentAccountController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createPaymentAccountData;
    const paymentAccount = await createPaymentAccount(data);
    res.status(200).json({ paymentAccount: "PaymentAccount created successfully", payload: paymentAccount });
  } catch (error: Error | any) {
    res.status(500).json({ paymentAccount: `Something went wrong ${error?.paymentAccount}` });
  }
};

export const updatePaymentAccountController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updatePaymentAccountData;
    const updatedPaymentAccount = await updatePaymentAccount(id, updateData);
    res.status(200).json({ paymentAccount: "PaymentAccount updated successfully", payload: updatedPaymentAccount });
  }catch (error: Error | any) {
    res.status(500).json({ paymentAccount: `Something went wrong ${error?.paymentAccount}` });
  }
};

export const deletePaymentAccountController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const paymentAccount = await deletePaymentAccount(id);
    res.status(200).json({
      paymentAccount: `PaymentAccount with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ paymentAccount: `Something went wrong ${error?.paymentAccount}` });
  }
};