// src/domains/storage/storage.controller.ts
import { Request, Response } from "express";
import { storageService } from "./storage.service";
import { mediaRepository } from "./media.repository";
import { catchAsync } from "../../utils/catchAsync";
import { MediaReadResponse } from "./storage.types";
import { ValidationError } from "../../errors/AppError";

export const storageController = {

  getMedia: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required parameter id.');
    
    const media = await mediaRepository.findById(id);

    const signedUrl = await storageService.generateDownloadUrl(media.storage_key);

    const response: MediaReadResponse = {
      id: media.id,
      url: signedUrl,
      file_name: media.file_name,
      type: media.type,
      metadata: media.metadata
    };

    res.status(200).json({ status: 'success', data: response });
  })
};