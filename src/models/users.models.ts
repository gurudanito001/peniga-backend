import { prisma } from "../utils/prisma";

export interface getUserFilters {
  isActive?:      boolean
  online?:        boolean,
  country?:       string,
  emailVerified?: boolean
}

export const getAllUsers = async(filters: getUserFilters, pagination: {page: string, take: string}) => {
  const skip = ( (parseInt(pagination.page) ) - 1) * parseInt(pagination.take) 
  const takeVal = parseInt(pagination.take)
  const users = await prisma.user.findMany({
    where: {
      ...(filters?.isActive !== undefined && {isActive: filters?.isActive}),
      ...(filters?.online !== undefined && {online: filters?.online}),
      ...(filters?.emailVerified !== undefined && {emailVerified: filters?.emailVerified}),
      ...(filters?.country && {country: filters?.country})
    },
    skip: skip,
    take: takeVal,
    orderBy: {
      createdAt: "desc"
    }
  });
  const totalCount = await prisma.user.count({
    where: {
      ...(filters?.isActive !== undefined && {isActive: filters?.isActive}),
      ...(filters?.online !== undefined && {online: filters?.online}),
      ...(filters?.emailVerified !== undefined && {emailVerified: filters?.emailVerified}),
      ...(filters?.country && {country: filters?.country})
    }
  });
  const totalPages = Math.ceil( totalCount / parseInt(pagination.take));
  return {page: parseInt(pagination.page), totalPages, pageSize: takeVal, totalCount, data: users}
};


export const getUserById = async(id: string) => {
  const user = await prisma.user.findFirst({
    where: {id},
  })
  return user
};

export const getUserByEmail = async(email: string) => {
  const user = await prisma.user.findFirst({
    where: {email},
  })
  return user
};


export interface createUserData {
  firstName:       string
  lastName:        string
  isActive?:        boolean
  email:           string            
  password:        string    
  online?:          boolean           
  profileImage?:    string  
  showProfileImg?:   boolean
  country:          string
  allowNotification?: boolean
  emailVerified?:   boolean  
}
export const createUser = async(userData: createUserData) => {
  const user = await prisma.user.create({
    data: userData
  })
  return user
};


export interface updateUserData {
  firstName?:       string
  lastName?:        string
  isActive?:        boolean
  online?:          boolean           
  profileImage?:    string  
  showProfileImg?:   boolean
  country?:          string
  allowNotification?: boolean
  emailVerified?:   boolean  
}
export const updateUser = async (id: string, updateData: updateUserData) => {
  
  const user = await prisma.user.update({
    where: {id},
    data: updateData
  })
  return user;
};

export const changePassword = async (id: string, newPassword: string) => {
  const user = await prisma.user.update({
    where: {id},
    data: {password: newPassword}
  })
  return user;
};

export const updateUserPasswordByEmail = async (email: string, updateData: {password: string}) => {
  const user = await prisma.user.update({
    where: {email},
    data: {...updateData, emailVerified: true}
  })
  return user;
};

export const disableUser = async(id: string) => {
  const user = await prisma.user.update({
    where: {id},
    data: {isActive: false}
  })
  return user
};

export const enableUser = async(id: string) => {
  const user = await prisma.user.update({
    where: {id},
    data: {isActive: true}
  })
  return user
};

export const deleteUser = async(id: string) => {
  const user = await prisma.user.delete({
    where: {id}
  })
  return user
};