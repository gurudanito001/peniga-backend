import { Request, Response } from 'express';
import {
  getAllEscrows,
  getEscrowById,
  createEscrow,
  updateEscrow,
  deleteEscrow
} from '../models/escrow.models';

import { getEscrowsFilters, createEscrowData, updateEscrowData } from '../models/escrow.models';


export const getEscrowsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {userId: req?.query?.userId || req?.user?.userId, buyerId: req?.query?.buyerId, sellerId: req?.query?.sellerId, contractId: req?.query?.contractId} as getEscrowsFilters
  try {
    const escrows = await getAllEscrows(filters, {page, take});
    res.status(200).json({ message: "Escrows fetched successfully", payload: escrows });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getEscrowByIdController = async(req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const escrow = await getEscrowById(id);
    if (escrow) {
      res.status(200).json({ message: "Escrow fetched successfully", payload: escrow });
    } else {
      res.status(404).json({ message: 'Escrow not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createEscrowController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createEscrowData;
    const escrow = await createEscrow(data);
    res.status(200).json({ message: "Escrow created successfully", payload: escrow });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateEscrowController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updateEscrowData;
    const updatedEscrow = await updateEscrow(id, updateData);
    res.status(200).json({ message: "Escrow updated successfully", payload: updatedEscrow });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteEscrowController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const escrow = await deleteEscrow(id);
    res.status(200).json({
      message: `Escrow with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};