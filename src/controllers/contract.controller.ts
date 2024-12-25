import { Request, Response } from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  createManyContractItems,
  updateContract,
  setSellerOnContract,
  deleteContract
} from '../models/contract.model';

import { getContractsFilters, createContractData, updateContractData } from '../models/contract.model';
import { ContractItem } from '@prisma/client';
import { sendContractEmail } from '../services/sendEmail';


export const getContractsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {userId: req?.query?.userId || req?.user?.userId, buyerId: req?.query?.buyerId, sellerId: req?.query?.sellerId, status: req?.query?.status} as getContractsFilters
  try {
    const contracts = await getAllContracts(filters, {page, take});
    res.status(200).json({ message: "Contracts fetched successfully", payload: contracts });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getContractByIdController = async(req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const contract = await getContractById(id);
    if (contract) {
      res.status(200).json({ message: "Contract fetched successfully", payload: contract });
    } else {
      res.status(404).json({ message: 'Contract not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createContractController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createContractData;
    console.log(data)
    // extract contract data and create contract
    let {buyerId, sellerId, title, currency, inspectionPeriod, agreementTerms, toBeInformed, escrowFeePaidBy, contractItems} = req.body
    const contract = await createContract({buyerId, sellerId, title, currency, inspectionPeriod, agreementTerms, toBeInformed, escrowFeePaidBy});

    // get contractId and create contract items
    contractItems = contractItems.map( (item: ContractItem) =>{
      return { ...item, price: parseFloat(`${item?.price}`), contractId: contract.id}
    })
    await createManyContractItems(contractItems);

    // send email to seller
    await sendContractEmail({email: toBeInformed?.email, contractId: contract?.id})

    res.status(200).json({ message: "Contract created successfully", status: "success", payload: contract });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateContractController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updateContractData;
    const updatedContract = await updateContract(id, updateData);
    res.status(200).json({ message: "Contract updated successfully", payload: updatedContract });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const setSellerIdOnContract = async(req: Request | any, res: Response) => {
  try {
    const id = req.params.id;
    const sellerId = req?.user?.userId;
    const updatedContract = await setSellerOnContract(id, sellerId);
    res.status(200).json({ message: "Contract updated successfully", payload: updatedContract });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const agreeToContract = async(req: Request | any, res: Response) => {
  try {
    const id = req.params.id;
    const sellerId = req?.user?.userId;
    const contract = await getContractById(id);
    if(contract?.sellerId !== sellerId){
      return res.status(401).json({ message: `Unauthorized!!`, payload: null,  });
    }
    const updatedContract = await updateContract(id, {stage: "AGREED"});
    res.status(200).json({ message: "Contract updated successfully", payload: updatedContract });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteContractController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const contract = await deleteContract(id);
    res.status(200).json({
      message: `Contract with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};