import { prisma } from "../utils/prisma";




export interface getTransactionsFilters {
  spId?:            string
  senderId?:        string
  contractId?:      string  
  escrowId?:        string         
  currency?:        string
  status?:          "PENDING" | "COMPLETED" | "FAILED"
}

export const getAllTransactions = async(filters: getTransactionsFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const transactions = await prisma.transaction.findMany({
    where: {
      ...(filters?.spId && {spId: filters?.spId}),
      ...(filters?.senderId && {benefactorId: filters?.senderId}),
      ...(filters?.contractId && {contractId: filters?.contractId}),
      ...(filters?.escrowId && {escrowId: filters?.escrowId}),
      ...(filters?.currency && {currency: filters?.currency}),
      ...(filters?.status && {status: filters?.status})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.transaction.count({
    where: {
      ...(filters?.spId && {spId: filters?.spId}),
      ...(filters?.senderId && {benefactorId: filters?.senderId}),
      ...(filters?.contractId && {contractId: filters?.contractId}),
      ...(filters?.escrowId && {escrowId: filters?.escrowId}),
      ...(filters?.currency && {currency: filters?.currency}),
      ...(filters?.status && {status: filters?.status})
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: transactions}
};


export const getTransactionById = async(id: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: {id},
  })
  return transaction
};



export interface createTransactionData {
  spId:            string
  senderId:        string
  amount:          number
  contractId:      string  
  escrowId:        string         
  currency:        string
  status:          "PENDING" | "COMPLETED" | "FAILED"
  transactionData?: object
}


export const createTransaction = async(transactionData: createTransactionData) => {
  const transaction = await prisma.transaction.create({
    data: transactionData
  })
  return transaction
};


export interface updateTransactionData {
  spId?:            string
  senderId?:        string
  amount?:          number
  contractId?:      string  
  escrowId?:        string         
  currency?:        string
  status?:          "PENDING" | "COMPLETED" | "FAILED"
  transactionData?: object
}

export const updateTransaction = async (id: string, updateData: updateTransactionData) => {
  const transaction = await prisma.transaction.update({
    where: {id},
    data: updateData
  })
  return transaction;
};

export const deleteTransaction = async(id: string) => {
  const transaction = await prisma.transaction.delete({
    where: {id}
  })
  return transaction
};