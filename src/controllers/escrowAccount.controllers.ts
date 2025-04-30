import { Request, Response } from 'express';
import { saveTempAccount } from '../models/tempAccount.model';
const axios = require('axios');
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(process.env.FLW_PUBLIC_KEY, process.env.FLW_SECRET_KEY);
import { generateVirtualAccount, getTransferFee, transferToBankAccount, getBanks, checkTransferStatus, validateAccountNumber } from '../services/fintechServices';
import calculateEscrowFee from '../services/calculateEscrowFee';
import { getContractById, updateContract } from '../models/contract.model';
import { prisma } from '../utils/prisma';


export const getTransferFeesController =  async (req: Request | any, res: Response) => {
  const {amount, currency} = req.body as {amount: number, currency: string};
  try {
    const details = {
      "amount": amount,
      "currency": "NGN",
    };
    const transferFees: any = await getTransferFee({amount});
    //const fee = parseInt(transferFees.payload.data.fee);
    res.status(200).json({ message: "Transfer fee fetched successfully", payload: {fintechFee: transferFees?.payload?.data[0]?.fee, penigaFee: calculateEscrowFee()} });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

export const generateEscrowAccountController =  async (req: Request | any, res: Response) => {
  const {email, contractId, amount} = req.body as {email: string, contractId: string, amount: number};
 
  try {
    /* const transferFees: any = await getTransferFee({amount});
    const fee = parseInt(transferFees.payload.data[0].fee);
    console.log(amount, fee) */
    const escrowAccount: any = await generateVirtualAccount({email, contractId, amount: amount});
    
    res.status(200).json({ message: "Temporary account generated successfully", payload: {account: escrowAccount?.payload?.data} });
    await saveTempAccount({contractId, accountDetails: {account: escrowAccount?.payload?.data}});
   
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

export const validatePaymentWebhookController =  async (req: Request | any, res: Response) => { 
  try {
    const {event, data} = req.body as {event: string, data: any};
    // check the status of  the transaction
    // check if the tx_ref is a valid contractId
    // check the value of the charged amount
    let contract = await getContractById(data?.tx_ref);
    if(data?.status === "successful" && contract){
      await updateContract(data?.tx_ref, {stage: "PAID"});
      res.status(200).json({ status: 200, message: "Payment verified successfully", payload: null });
    }else{
      res.status(400).json({ message: `Something went wrong` });
    }
    
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

export const getBankCodesController =  async (req: Request | any, res: Response) => {

  try {
    const banksWithCodes: any = await getBanks();
    res.status(200).json({ message: "Banks with their codes", payload: banksWithCodes.payload.data });
   
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

export const transferToSellerBankAccountController =  async (req: Request | any, res: Response) => {
  const {accountBank, accountNumber, amount, reference} = req.body as { accountBank: string, accountNumber: string, amount: number, narration?: string, reference: string };
  
  try {
    const transferResult: any = await transferToBankAccount({accountBank, accountNumber, amount, reference});
    res.status(200).json({ message: "Transfer is being processed", payload: null });
   
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

export const checkTransferStatusController =  async (req: Request | any, res: Response) => {
  const transferId = req.params.id;
  
  try {
    const transferStatus: any = await checkTransferStatus(transferId);
    res.status(200).json({ message: "Transfer status fetched successfully", payload: transferStatus.payload.data });
   
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};

export const validateAccountController =  async (req: Request | any, res: Response) => {
  const { accountNumber, bankCode} = req.body as { accountNumber: string, bankCode: string };

  try {
    const accountDetails: any = await validateAccountNumber({accountNumber, bankCode});
    res.status(200).json({ message: "Account validated successfully", payload: accountDetails?.payload?.data });
   
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error}` });
  }
};


