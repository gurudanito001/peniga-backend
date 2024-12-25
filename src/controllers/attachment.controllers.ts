import { Request, Response } from 'express';
import {
  getAllAttachments,
  getAttachmentById,
  createAttachment,
  updateAttachment,
  deleteAttachment
} from '../models/attachment.model';

import { getAttachmentsFilters, createAttachmentData, updateAttachmentData } from '../models/attachment.model';


export const getAttachmentsController =  async (req: Request | any, res: Response) => {
  const page = req?.query?.page?.toString() || "1";
  const take = req?.query?.size?.toString() || "20"; 
  let filters = {contractId: req?.query?.contractId, disputeId: req?.query?.disputeId, fileType: req?.query?.fileType}
  try {
    const attachments = await getAllAttachments(filters, {page, take});
    res.status(200).json({ status: "success", message: "Attachments fetched successfully", payload: attachments });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}`, status: "error", payload: null });
  }
};

export const getAttachmentByIdController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const attachment = await getAttachmentById(id);
    if (attachment) {
      res.status(200).json({ message: "Attachment fetched successfully", status: "success", payload: attachment });
    } else {
      res.status(404).json({ message: 'Attachment not found', status: "error", payload: null});
    }
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}`, status: "error", payload: null });
  }
};

export const createAttachmentController = async(req: Request, res: Response) => {
  try {
    const data = req.body as createAttachmentData;
    const attachment = await createAttachment(data);
    res.status(200).json({ message: "Attachment created successfully", payload: attachment, status: "success"  });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}`, status: "error", payload: null  });
  }
};

export const updateAttachmentController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updateData = req.body as updateAttachmentData;
    const updatedAttachment = await updateAttachment(id, updateData);
    res.status(200).json({ message: "Attachment updated successfully", payload: updatedAttachment, status: "success" });
  }catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}`, status: "error", payload: null  });
  }
};

export const deleteAttachmentController = async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const attachment = await deleteAttachment(id);
    res.status(200).json({
      message: `Attachment with id: ${id} deleted`, status: "success", payload: null 
    });
  } catch (error: Error | any) {
    res.status(500).json({ message: `Something went wrong ${error?.message}`, status: "error", payload: null  });
  }
};