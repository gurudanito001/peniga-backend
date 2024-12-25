import { Request, Response } from 'express';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction
} from '../models/transaction.models';

import { getTransactionsFilters, createTransactionData, updateTransactionData } from '../models/transaction.models';


export const getTransactionsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {spId: req?.query?.spId, senderId: req?.query?.senderId, contractId: req?.query?.contractId, escrowId: req?.query?.escrowId, currency: req?.query?.currency, status: req?.query?.status, } as getTransactionsFilters
  try {
    const transactions = await getAllTransactions(filters, {page, take});
    res.status(200).json({ transaction: "Transactions fetched successfully", payload: transactions });
  } catch (error: Error | any) {
    res.status(500).json({ transaction: `Something went wrong ${error?.transaction}` });
  }
};

export const getTransactionByIdController = async(req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const transaction = await getTransactionById(id);
    if (transaction) {
      res.status(200).json({ transaction: "Transaction fetched successfully", payload: transaction });
    } else {
      res.status(404).json({ transaction: 'Transaction not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ transaction: `Something went wrong ${error?.transaction}` });
  }
};

export const createTransactionController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createTransactionData;
    const transaction = await createTransaction(data);
    res.status(200).json({ transaction: "Transaction created successfully", payload: transaction });
  } catch (error: Error | any) {
    res.status(500).json({ transaction: `Something went wrong ${error?.transaction}` });
  }
};

export const updateTransactionController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updateTransactionData;
    const updatedTransaction = await updateTransaction(id, updateData);
    res.status(200).json({ transaction: "Transaction updated successfully", payload: updatedTransaction });
  }catch (error: Error | any) {
    res.status(500).json({ transaction: `Something went wrong ${error?.transaction}` });
  }
};

export const deleteTransactionController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const transaction = await deleteTransaction(id);
    res.status(200).json({
      transaction: `Transaction with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ transaction: `Something went wrong ${error?.transaction}` });
  }
};