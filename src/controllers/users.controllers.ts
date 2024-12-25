import { Request, Response } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  disableUser,
  enableUser,
  deleteUser,
  changePassword,
} from '../models/users.models';
import {getUserFilters, createUserData, updateUserData} from "../models/users.models"
import { uploadImage } from '../services/fileService';
import { hashPassword } from '../services/authServices';
import { deleteEmail } from '../models/emails.models';




export const getUsersController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {isActive: req?.query?.isActive, online: req?.query?.online, country: req?.query?.country, emailVerified: req?.query?.emailVerified } as getUserFilters;
  try {
    const users = await getAllUsers(filters, {page, take});
    res.status(200).json({ message: "Users fetched successfully", payload: users });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getUserByIdController = async(req: Request | any, res: Response) => {
  try {
    const id = req?.user?.userId;
    const user = await getUserById(id);
    if (user) {
      res.status(200).json({ message: "User fetched successfully", payload: user });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createUserController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createUserData;
    const user = await createUser(data);
    res.status(200).json({ message: "User created successfully", payload: user });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateUserController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    let updateData = req.body as updateUserData;
    const updatedUser = await updateUser(id, updateData)
    res.status(200).json({ message: "User updated successfully", payload: updatedUser });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const disableUserController = async(req: Request | any, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await disableUser(id);
    res.status(200).json({ message: "User disabled successfully", payload: null });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const enableUserController = async(req: Request | any, res: Response) => {
  try {
    const id = req.params.userId;
    const user = await enableUser(id);
    res.status(200).json({ message: "User enabled successfully", payload: user });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteUserController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await getUserById(id);

    
    if(user?.email){
      await deleteEmail(user?.email)
    }
    await deleteUser(id);
    
    res.status(200).json({
      message: `User with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const changePasswordController =  async (req: Request | any, res: Response) => {
  const id = req.user.userId;
  try {
    const {newPassword} = req.body;
    
    if (newPassword?.length < 8) {
      res.status(400).json({ message: "Password must be at least 8 characters long", status: "error" })
    }else {
      const hashedPassword = await hashPassword(newPassword);
      await changePassword(id, hashedPassword);
    }
    res.status(200).json({ message: "password changed successful", status: "success" })
  } catch (error: any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const setProfileImageController = async(req: Request | any, res: Response) => {
  try {
    const id = req.user.userId;
    const updateData = req.body as {profileImage: string};
    if(!updateData?.profileImage.includes("data:image")){
      return res.status(400).json({ message: "Base 64 image is required", status: "error" });
    }
    let result = await uploadImage({data: updateData?.profileImage });
    const updatedUser = await updateUser(id, {profileImage: result?.url})
    res.status(200).json({ message: "User updated successfully", payload: updatedUser });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};




