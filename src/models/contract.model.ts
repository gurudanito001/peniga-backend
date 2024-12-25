import { prisma } from "../utils/prisma";




export interface getContractsFilters {
  userId?:        string
  buyerId?:       string
  sellerId?:      string
  status?:         "ACTIVE" | "COMPLETED" | "TERMINATED" | "DISPUTED"
}

export const getAllContracts = async(filters: getContractsFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const contracts = await prisma.contract.findMany({
    where: {
      ...(filters?.userId && { OR: [
        {buyerId: filters?.userId},
        {sellerId: filters?.userId}
      ]}),
      ...(filters?.status && {status: filters?.status})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      contractItems: true,
    }
  });
  const totalCount = await prisma.contract.count({
    where: {
      ...(filters?.userId && { OR: [
        {buyerId: filters?.userId},
        {sellerId: filters?.userId}
      ]}),
      ...(filters?.status && {status: filters?.status})
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: contracts}
};


export const getContractById = async(id: string) => {
  const contract = await prisma.contract.findFirst({
    where: {id},
    include: {
      buyer: true,
      seller: true,
      contractItems: true,
      tempAccount: true
    }
  })
  return contract
};



export interface createContractData {
  buyerId:       string
  sellerId:      string
  title:         string
  currency:      string
  inspectionPeriod:  string
  toBeInformed:   object
  startDate?:     string
  endDate?:       string        
  agreementTerms: object           
  status?:        "ACTIVE" | "COMPLETED" | "TERMINATED" | "DISPUTED",
  stage?:         "CREATED" | "AGREED" | "PAID" | "DELIVERED" | "INSPECTED" | "COMPLETED" 
  escrowFeePaidBy: "buyer" | "seller"
}

export interface createContractItemData {
  contractId:        string
  itemName:          string
  price:             number
  category?:         string
  description?:      string
}


export const createContract = async(contractData: createContractData) => {
  const contract = await prisma.contract.create({
    data: contractData
  })
  return contract
};


export const createManyContractItems = async(contractData: createContractItemData[]) => {
  const contract = await prisma.contractItem.createMany({
    data: contractData
  })
  return contract
};


export interface updateContractData {
  buyerId?:       string
  sellerId?:      string
  title?:         string
  currency?:      string
  inspectionPeriod?:  string
  startDate?:     string
  endDate?:       string        
  agreementTerms?: object 
  status?:        "ACTIVE" | "COMPLETED" | "TERMINATED" | "DISPUTED"
  stage?:          "CREATED" | "AGREED" | "PAID" | "DELIVERED" | "INSPECTED" | "COMPLETED"
  escrowId?:     string
  disputeId?:    string
}

export const updateContract = async (id: string, updateData: updateContractData) => {
  const contract = await prisma.contract.update({
    where: {id},
    data: updateData
  })
  return contract;
};

export const setSellerOnContract = async (id: string, sellerId: string) => {
  const contract = await prisma.contract.update({
    where: {id},
    data: {sellerId: sellerId}
  })
  return contract;
};

export const deleteContract = async(id: string) => {
  const contract = await prisma.contract.delete({
    where: {id}
  })
  return contract
};