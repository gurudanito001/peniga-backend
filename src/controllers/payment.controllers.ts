import { Request, Response } from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment
} from '../models/payment.models';

import { getPaymentsFilters, createPaymentData, updatePaymentData } from '../models/payment.models';


export const getPaymentsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {userId: req?.query?.userId || req?.user?.userId, contractId: req?.query?.contractId, escrowId: req?.query?.escrowId, status: req?.query?.status, category: req?.query?.category } as getPaymentsFilters
  try {
    const payments = await getAllPayments(filters, {page, take});
    res.status(200).json({ message: "Payments fetched successfully", payload: payments });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.payment}` });
  }
};

export const getPaymentByIdController = async(req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const payment = await getPaymentById(id);
    if (payment) {
      res.status(200).json({ message: "Payment fetched successfully", payload: payment });
    } else {
      res.status(404).json({ message: 'Payment not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.payment}` });
  }
};

export const createPaymentController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createPaymentData;
    const payment = await createPayment(data);
    res.status(200).json({ message: "Payment created successfully", payload: payment });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.payment}` });
  }
};

export const updatePaymentController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updatePaymentData;
    const updatedPayment = await updatePayment(id, updateData);
    res.status(200).json({ message: "Payment updated successfully", payload: updatedPayment });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.payment}` });
  }
};

export const deletePaymentController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const payment = await deletePayment(id);
    res.status(200).json({
      message: `Payment with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.payment}` });
  }
};