import { prisma } from "../utils/prisma";




export interface getPaymentsFilters {
  userId?:          string  
  contractId?:      string            
  escrowId?:        string     
  status?:          "PENDING" | "PAID"  
  category?:        "REFUNDED" | "DISBURSED"
}

export const getAllPayments = async(filters: getPaymentsFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const payments = await prisma.payment.findMany({
    where: {
      ...(filters?.userId && {userId: filters?.userId}),
      ...(filters?.contractId && {contractId: filters?.contractId}),
      ...(filters?.escrowId && {escrowId: filters?.escrowId}),
      ...(filters?.status && {status: filters?.status}),
      ...(filters?.category && {category: filters?.category})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.payment.count({
    where: {
      ...(filters?.userId && {userId: filters?.userId}),
      ...(filters?.contractId && {contractId: filters?.contractId}),
      ...(filters?.escrowId && {escrowId: filters?.escrowId}),
      ...(filters?.status && {status: filters?.status}),
      ...(filters?.category && {category: filters?.category})
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: payments}
};


export const getPaymentById = async(id: string) => {
  const payment = await prisma.payment.findFirst({
    where: {id},
  })
  return payment
};



export interface createPaymentData {
  userId:          string  
  contractId:      string            
  escrowId:        string           
  amount:          number
  redemptionCode:  string
  status:          "PENDING" | "PAID"  
  category:        "REFUNDED" | "DISBURSED"
}


export const createPayment = async(paymentData: createPaymentData) => {
  const payment = await prisma.payment.create({
    data: paymentData
  })
  return payment
};


export interface updatePaymentData {
  userId?:          string  
  contractId?:      string            
  escrowId?:        string           
  amount?:          number
  redemptionCode?:  string
  status?:          "PENDING" | "PAID"  
  category?:        "REFUNDED" | "DISBURSED"
}

export const updatePayment = async (id: string, updateData: updatePaymentData) => {
  const payment = await prisma.payment.update({
    where: {id},
    data: updateData
  })
  return payment;
};

export const deletePayment = async(id: string) => {
  const payment = await prisma.payment.delete({
    where: {id}
  })
  return payment
};