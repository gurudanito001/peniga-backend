import { Request, Response } from 'express';
import {
  getAllTempAccount,
  getTempAccountByContractId,
  saveTempAccount,
  updateTempAccount,
  deleteTempAccount
} from '../models/tempAccount.model';

import { getTempAccountFilters, createTempAccountData, updateTempAccountData } from '../models/tempAccount.model';


export const getTempAccountsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {contractId: req?.query?.contractId } as getTempAccountFilters
  try {
    const tempAccounts = await getAllTempAccount(filters, {page, take});
    res.status(200).json({ message: "Temp Accounts fetched successfully", payload: tempAccounts });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.tempAccount}` });
  }
};

export const getTempAccountByContractIdController = async(req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const tempAccount = await getTempAccountByContractId(id);
    if (tempAccount) {
      res.status(200).json({ message: "Temp Account fetched successfully", payload: tempAccount });
    } else {
      res.status(404).json({ message: 'Temp Account not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

export const createTempAccountController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createTempAccountData;
    const tempAccount = await saveTempAccount(data);
    res.status(200).json({ message: "Temp Account created successfully", payload: tempAccount });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.tempAccount}` });
  }
};

export const updateTempAccountController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updateTempAccountData;
    const updatedTempAccount = await updateTempAccount(id, updateData);
    res.status(200).json({ message: "TempAccount updated successfully", payload: updatedTempAccount });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.tempAccount}` });
  }
};

export const deleteTempAccountController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const tempAccount = await deleteTempAccount(id);
    res.status(200).json({
      message: `TempAccount with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};