import { Request, Response } from 'express';
import {
  getAllDisputes,
  getDisputeById,
  createDispute,
  updateDispute,
  deleteDispute
} from '../models/dispute.models';

import { getDisputesFilters, createDisputeData, updateDisputeData } from '../models/dispute.models';


export const getDisputesController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {raisedById: req?.query?.raisedById, contractId: req?.query?.contractId, buyerId: req?.query?.buyerId, sellerId: req?.query?.sellerId, disputeWinnerId: req?.query?.disputeWinnerId, status: req?.query?.status} as getDisputesFilters
  try {
    const disputes = await getAllDisputes(filters, {page, take});
    res.status(200).json({ message: "Disputes fetched successfully", payload: disputes });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getDisputeByIdController = async(req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const dispute = await getDisputeById(id);
    if (dispute) {
      res.status(200).json({ message: "Dispute fetched successfully", payload: dispute });
    } else {
      res.status(404).json({ message: 'Dispute not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createDisputeController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createDisputeData;
    const dispute = await createDispute(data);
    res.status(200).json({ message: "Dispute created successfully", payload: dispute });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateDisputeController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updateDisputeData;
    const updatedDispute = await updateDispute(id, updateData);
    res.status(200).json({ message: "Dispute updated successfully", payload: updatedDispute });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteDisputeController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const dispute = await deleteDispute(id);
    res.status(200).json({
      message: `Dispute with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};