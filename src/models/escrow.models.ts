import { StringSchema } from "joi";
import { prisma } from "../utils/prisma";




export interface getEscrowsFilters {
  userId?: string,
  buyerId?: string,
  sellerId?: string,
  contractId?: string
}

export const getAllEscrows = async(filters: getEscrowsFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const escrows = await prisma.escrow.findMany({
    where: {
      ...(filters?.userId && { OR: [
        {buyerId: filters?.userId},
        {sellerId: filters?.userId}
      ]}),
      ...(filters?.buyerId && {buyerId: filters?.buyerId}),
      ...(filters?.sellerId && {sellerId: filters?.sellerId}),
      ...(filters?.contractId && {contractId: filters?.contractId})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.escrow.count({
    where: {
      ...(filters?.userId && { OR: [
        {buyerId: filters?.userId},
        {sellerId: filters?.userId}
      ]}),
      ...(filters?.buyerId && {buyerId: filters?.buyerId}),
      ...(filters?.sellerId && {sellerId: filters?.sellerId}),
      ...(filters?.contractId && {contractId: filters?.contractId})
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: escrows}
};


export const getEscrowById = async(id: string) => {
  const escrow = await prisma.escrow.findFirst({
    where: {id},
  })
  return escrow
};



export interface createEscrowData {
  buyerId:     string  
  sellerId:    string                     
  contractId:   string  
  escrowId:     string                    
  amount:       number 
  fee?:          number
  status?:       "PENDING" | "REVERTED" | "DISBURSED"
}


export const createEscrow = async(escrowData: createEscrowData) => {
  const escrow = await prisma.escrow.create({
    data: escrowData
  })
  return escrow
};


export interface updateEscrowData {
  buyerId?:     string  
  sellerId?:    string                     
  contractId?:   string  
  escrowId?:     string                    
  amount?:       number 
  fee?:          number
  status?:       "PENDING" | "REVERTED" | "DISBURSED"
}

export const updateEscrow = async (id: string, updateData: updateEscrowData) => {
  const escrow = await prisma.escrow.update({
    where: {id},
    data: updateData
  })
  return escrow;
};

export const deleteEscrow = async(id: string) => {
  const escrow = await prisma.escrow.delete({
    where: {id}
  })
  return escrow
};