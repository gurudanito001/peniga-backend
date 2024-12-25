import { Request, Response } from 'express';
import {
  getAllMessages,
  getMessageById,
  createMessage,
  updateMessage,
  deleteMessage
} from '../models/message.model';

import { getMessagesFilters, createMessageData, updateMessageData } from '../models/message.model';


export const getMessagesController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {senderId: req?.query?.senderId, receiverId: req?.query?.receiverId, resourceId: req?.query?.sellerId, contractId: req?.query?.contractId} as getMessagesFilters
  try {
    const messages = await getAllMessages(filters, {page, take});
    res.status(200).json({ message: "Messages fetched successfully", payload: messages });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const getMessageByIdController = async(req: Request, res: Response) => {
  try {
    const id = req?.params?.id;
    const message = await getMessageById(id);
    if (message) {
      res.status(200).json({ message: "Message fetched successfully", payload: message });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const createMessageController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createMessageData;
    const message = await createMessage(data);
    res.status(200).json({ message: "Message created successfully", payload: message });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const updateMessageController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updateMessageData;
    const updatedMessage = await updateMessage(id, updateData);
    res.status(200).json({ message: "Message updated successfully", payload: updatedMessage });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};

export const deleteMessageController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const message = await deleteMessage(id);
    res.status(200).json({
      message: `Message with id: ${id} deleted`,
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}` });
  }
};