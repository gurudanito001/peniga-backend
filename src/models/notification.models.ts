import { prisma } from "../utils/prisma"
import type { Notification } from "@prisma/client"

export interface getNotificationsFilters {
  userId?: string,
  isRead?: boolean
}
export const getAllNotifications = async(filters: getNotificationsFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const notifications = await prisma.notification.findMany({
    where: {
      ...( filters.userId && {userId: filters?.userId}),
      ...( filters.isRead && {isRead: filters?.isRead})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: true
    }
  });
  const totalCount = await prisma.notification.count({
    where: {
      ...( filters.userId && {userId: filters?.userId}),
      ...( filters.isRead && {isRead: filters?.isRead})
    }
  });
  const totalUnreadCount = await prisma.notification.count({
    where: {
      ...( filters.userId && {userId: filters?.userId}),
      isRead: false
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, numOfUnread: totalUnreadCount, data: notifications}
};

export const getNotificationById = async(id: string) => {
  const notification = await prisma.notification.findFirst({
    where: {id},
    include: {
      user: true
    }
  })
  return notification
};

export interface createNotificationData {
  userId?:                   string
  content:                   string
  isRead?:                   boolean
}
export const createNotification = async(notificationData: createNotificationData) => {
  const notification = await prisma.notification.create({
    data: notificationData
  })
  return notification
};


export interface updateNotificationData {
  isRead:                   boolean
}
export const updateNotification = async (id: string, updateData: updateNotificationData) => {
  const notification = await prisma.notification.update({
    where: {id},
    data: updateData
  })
  return notification;
};

export const deleteNotification = async(id: string) => {
  const notification = await prisma.notification.delete({
    where: {id}
  })
  return notification
};

export const clearUserNotifications = async(userId: string) => {
  const notification = await prisma.notification.deleteMany({
    where: {userId}
  })
  return notification
};