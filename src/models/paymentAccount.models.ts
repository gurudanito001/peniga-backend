import { boolean, object } from "joi";
import { prisma } from "../utils/prisma";




export interface getPaymentAccountsFilters {
  userId?:         string
}

export const getAllPaymentAccounts = async(filters: getPaymentAccountsFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const messages = await prisma.paymentAccount.findMany({
    where: {
      ...(filters?.userId && {userId: filters?.userId})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.paymentAccount.count({
    where: {
      ...(filters?.userId && {userId: filters?.userId})
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: messages}
};


export const getPaymentAccountById = async(id: string) => {
  const paymentAccount = await prisma.paymentAccount.findFirst({
    where: {id},
  })
  return paymentAccount
};


export interface createPaymentAccountData {
  userId:         string
  bankName:        string
  accountName:     string
  accountNumber:   string
  bankDetails?:     object
}


export const createPaymentAccount = async(messageData: createPaymentAccountData) => {
  const paymentAccount = await prisma.paymentAccount.create({
    data: messageData
  })
  return paymentAccount
};


export interface updatePaymentAccountData {
  userId?:         string
  bankName?:        string
  accountName?:     string
  accountNumber?:   string
  bankDetails?:     object
}

export const updatePaymentAccount = async (id: string, updateData: updatePaymentAccountData) => {
  const paymentAccount = await prisma.paymentAccount.update({
    where: {id},
    data: updateData
  })
  return paymentAccount;
};

export const deletePaymentAccount = async(id: string) => {
  const paymentAccount = await prisma.paymentAccount.delete({
    where: {id}
  })
  return paymentAccount
};