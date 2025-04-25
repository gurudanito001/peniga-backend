import { Request, Response } from 'express';
import {
  getAllContracts,
  getContractById,
  createContract,
  createManyContractItems,
  getAllContractItems,
  deleteContractItem,
  updateContract,
  setSellerOnContract,
  deleteContract,
  setBuyerOnContract
} from '../models/contract.model';

import { getContractsFilters, createContractData, updateContractData } from '../models/contract.model';
import { ContractItem } from '@prisma/client';
import { sendContractEmail } from '../services/sendEmail';
import { uploadImage } from '../services/fileService';

interface ContractItemPayload {
  image: string;
}

type ExtendedContractItem = Omit<ContractItem, 'imageUrl'> & ContractItemPayload;


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


export const createContractController = async (req: Request, res: Response) => {
  try {
    const data = req.body as createContractData;
    console.log(data);
    // extract contract data and create contract
    const {
      userId,
      buyerId,
      sellerId,
      title,
      currency,
      inspectionPeriod,
      agreementTerms,
      toBeInformed,
      escrowFeePaidBy,
      contractItems,
    } = req.body;

    const contract = await createContract({
      userId,
      buyerId,
      sellerId,
      title,
      currency,
      inspectionPeriod,
      agreementTerms,
      toBeInformed,
      escrowFeePaidBy,
    });

    // Process contract items: upload images and prepare data
    const processedContractItems = await Promise.all(
      (contractItems as ExtendedContractItem[]).map(async (item) => {
        try {
          const result = await uploadImage({ data: item?.image });
          return {
            itemName: item?.itemName,
            description: item?.description,
            price: typeof item?.price === 'number' ? item.price : parseFloat(`${item?.price}`),
            quantity: typeof item?.quantity === 'number' ? item.quantity : parseInt(`${item?.quantity}`),
            contractId: contract.id,
            imageUrl: result.url,
          };
        } catch (uploadError: any) {
          console.error(`Error uploading image for item: ${item.itemName}`, uploadError?.message);
          // Decide how to handle upload failures: skip item, return an error, etc.
          // For now, we'll skip the item and log the error.
          return null;
        }
      })
    );

    // Filter out any items that failed image upload
    const validContractItems = processedContractItems.filter(item => item !== null);

    if (validContractItems.length > 0) {
      await createManyContractItems(validContractItems as []); // Adjust type if 'image' is not expected here
    } else {
      console.warn('No valid contract items to create after image uploads.');
      // You might want to handle this scenario based on your application logic
    }

    // send email to seller
    // if (toBeInformed?.email && contract?.id) {
    //   await sendContractEmail({ email: toBeInformed.email, contractId: contract.id });
    // }

    res
      .status(200)
      .json({ message: 'Contract created successfully', status: 'success', payload: contract });
  } catch (error: Error | any) {
    console.error('Error creating contract:', error?.message);
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getContractItemsController = async(req: Request, res: Response) => {
  try {
    const contractId = req.params.contractId;
    const contractItems = await getAllContractItems(contractId);
    res.status(200).json({ message: "Contract items fetched successfully", payload: contractItems });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteContractItemController = async(req: Request, res: Response) => {
  try {
    const contractItemId = req.params.contractItemId;
    const contractItem = await deleteContractItem(contractItemId);
    res.status(200).json({ message: "Contract item deleted successfully", payload: contractItem });
  }catch (error: Error | any) {
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

export const setBuyerIdOnContract = async(req: Request | any, res: Response) => {
  try {
    const id = req.params.id;
    const buyerId = req?.user?.userId;
    const updatedContract = await setBuyerOnContract(id, buyerId);
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