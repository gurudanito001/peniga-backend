import { prisma } from "../utils/prisma";




export interface getTempAccountFilters {
  contractId?:      string            
}

export const getAllTempAccount = async(filters: getTempAccountFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const tempAccounts = await prisma.tempAccount.findMany({
    where: {
      ...(filters?.contractId && {contractId: filters?.contractId}),
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.payment.count({
    where: {
      ...(filters?.contractId && {contractId: filters?.contractId}),
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: tempAccounts}
};


export const getTempAccountByContractId = async(contractId: string) => {
  const tempAccount = await prisma.tempAccount.findFirst({
    where: {contractId},
  })
  return tempAccount
};



export interface createTempAccountData {
  contractId:      string  
  accountDetails:  object          
}

export const saveTempAccount = async(tempAccountData: createTempAccountData) => {
  const tempAccount = await prisma.tempAccount.create({
    data: tempAccountData
  })
  return tempAccount
};


export interface updateTempAccountData {
  contractId?:      string  
  accountDetails?:  object     
}

export const updateTempAccount = async (contractId: string, updateData: updateTempAccountData) => {
  const payment = await prisma.payment.update({
    where: {contractId},
    data: updateData
  })
  return payment;
};

export const deleteTempAccount = async(contractId: string) => {
  const tempAccount = await prisma.tempAccount.delete({
    where: {contractId}
  })
  return tempAccount
};