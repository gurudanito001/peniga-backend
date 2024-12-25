import { prisma } from "../utils/prisma";




export interface getAttachmentsFilters {
  contractId?: string,
  disputeId?: string
  fileType?: string
}

export const getAllAttachments = async(filters: getAttachmentsFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const attachments = await prisma.attachment.findMany({
    where: {
      ...(filters?.contractId && {attachmentId: filters?.contractId}),
      ...(filters?.disputeId && {disputeId: filters?.disputeId}),
      ...(filters?.fileType && {fileType: filters?.fileType})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.attachment.count({
    where: {
      ...(filters?.contractId && {attachmentId: filters?.contractId}),
      ...(filters?.disputeId && {disputeId: filters?.disputeId}),
      ...(filters?.fileType && {fileType: filters?.fileType})
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: attachments}
};


export const getAttachmentById = async(id: string) => {
  const attachment = await prisma.attachment.findFirst({
    where: {id},
  })
  return attachment
};



export interface createAttachmentData {
  contractId?:     string  
  disputeId?:      string                     
  fileName:       string                      
  fileUrl:        string 
  fileType:       string
}


export const createAttachment = async(attachmentData: createAttachmentData) => {
  const attachment = await prisma.attachment.create({
    data: attachmentData
  })
  return attachment
};


export interface updateAttachmentData {
  contractId?:     string  
  disputeId?:      string                     
  fileName?:       string                      
  fileUrl?:        string 
  fileType?:       string
}

export const updateAttachment = async (id: string, updateData: updateAttachmentData) => {
  const attachment = await prisma.attachment.update({
    where: {id},
    data: updateData
  })
  return attachment;
};

export const deleteAttachment = async(id: string) => {
  const attachment = await prisma.attachment.delete({
    where: {id}
  })
  return attachment
};