import { prisma } from "../utils/prisma";




export interface getDisputesFilters {
  raisedById?:       string
  contractId?:       string         
  buyerId?:          string
  sellerId?:         string
  disputeWinnerId?: string
  status?:          "PENDING" | "RESOLVED"
}

export const getAllDisputes = async(filters: getDisputesFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const disputes = await prisma.dispute.findMany({
    where: {
      ...(filters?.raisedById && {raisedById: filters?.raisedById}),
      ...(filters?.contractId && {contractId: filters?.contractId}),
      ...(filters?.buyerId && {buyerId: filters?.buyerId}),
      ...(filters?.sellerId && {sellerId: filters?.sellerId}),
      ...(filters?.disputeWinnerId && {disputeWinnerId: filters?.disputeWinnerId}),
      ...(filters?.status && {status: filters?.status})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.dispute.count({
    where: {
      ...(filters?.raisedById && {raisedById: filters?.raisedById}),
      ...(filters?.contractId && {contractId: filters?.contractId}),
      ...(filters?.buyerId && {buyerId: filters?.buyerId}),
      ...(filters?.sellerId && {sellerId: filters?.sellerId}),
      ...(filters?.disputeWinnerId && {disputeWinnerId: filters?.disputeWinnerId}),
      ...(filters?.status && {status: filters?.status})
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: disputes}
};


export const getDisputeById = async(id: string) => {
  const dispute = await prisma.dispute.findFirst({
    where: {id},
  })
  return dispute
};



export interface createDisputeData {
  raisedById:       string
  contractId:       string         
  buyerId:          string
  sellerId:         string
  disputeWinnerId?: string
  reason:           string
}


export const createDispute = async(disputeData: createDisputeData) => {
  const dispute = await prisma.dispute.create({
    data: disputeData
  })
  return dispute
};


export interface updateDisputeData {
  raisedById?:       string
  contractId?:       string         
  buyerId?:          string
  sellerId?:         string
  disputeWinnerId?:  string
  reason?:           string
  status?:           "PENDING" | "RESOLVED"
}

export const updateDispute = async (id: string, updateData: updateDisputeData) => {
  const dispute = await prisma.dispute.update({
    where: {id},
    data: updateData
  })
  return dispute;
};

export const deleteDispute = async(id: string) => {
  const dispute = await prisma.dispute.delete({
    where: {id}
  })
  return dispute
};