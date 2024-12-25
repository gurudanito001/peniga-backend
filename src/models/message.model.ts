import { boolean, object } from "joi";
import { prisma } from "../utils/prisma";




export interface getMessagesFilters {
  senderId?:     string
  receiverId?:   string
  resourceId?:   string
  viewed?:       boolean
  appMessage?:   boolean   
  isActive?:     boolean
}

export const getAllMessages = async(filters: getMessagesFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const messages = await prisma.message.findMany({
    where: {
      ...(filters?.senderId && {senderId: filters?.senderId}),
      ...(filters?.receiverId && {receiverId: filters?.receiverId}),
      ...(filters?.resourceId && {resourceId: filters?.resourceId}),
      ...(filters?.viewed && {viewed: filters?.viewed}),
      ...(filters?.appMessage && {appMessage: filters?.appMessage}),
      ...(filters?.isActive && {isActive: filters?.isActive})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.message.count({
    where: {
      ...(filters?.senderId && {senderId: filters?.senderId}),
      ...(filters?.receiverId && {receiverId: filters?.receiverId}),
      ...(filters?.resourceId && {resourceId: filters?.resourceId}),
      ...(filters?.viewed && {viewed: filters?.viewed}),
      ...(filters?.appMessage && {appMessage: filters?.appMessage}),
      ...(filters?.isActive && {isActive: filters?.isActive})
    },
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: messages}
};


export const getMessageById = async(id: string) => {
  const message = await prisma.message.findFirst({
    where: {id},
  })
  return message
};


export interface createMessageData {
  senderId:     string
  receiverId:   string
  resourceId:   string
  resourceUrl?: string
  message:      string
  viewed?:       boolean
  appMessage?:   boolean   
  extraData?:      object
  isActive?:     boolean
}


export const createMessage = async(messageData: createMessageData) => {
  const message = await prisma.message.create({
    data: messageData
  })
  return message
};


export interface updateMessageData {
  senderId?:     string
  receiverId?:   string
  resourceId?:   string
  resourceUrl?: string
  message?:      string
  viewed?:       boolean
  appMessage?:   boolean   
  extraData?:      object
  isActive?:     boolean
}

export const updateMessage = async (id: string, updateData: updateMessageData) => {
  const message = await prisma.message.update({
    where: {id},
    data: updateData
  })
  return message;
};

export const deleteMessage = async(id: string) => {
  const message = await prisma.message.delete({
    where: {id}
  })
  return message
};