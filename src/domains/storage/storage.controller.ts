// src/domains/storage/storage.controller.ts
import { Request, Response } from "express";
import { storageService } from "./storage.service";
import { mediaRepository } from "./media.repository";
import { catchAsync } from "../../utils/catchAsync";
import { MediaReadResponse } from "./storage.types";
import { EntityNotFoundError } from "../../types/repository";

export const storageController = {
  // Fase 1: Fornisce l'URL per l'upload e registra l'intenzione nel DB
  requestUpload: catchAsync(async (req: Request, res: Response) => {
    const { contentType, fileName, fileSize, type } = req.body;

    const uploadData = await storageService.generateUploadUrl(
      req.user.id,
      contentType,
      fileName
    );

    // Creiamo il record Media in stato "pending" o carichiamo i dati
    // Nota: Il record effettivo viene confermato dopo l'upload riuscito dal frontend
    const media = await mediaRepository.create({
      publisher_id: req.user.id, // Assumendo che l'utente sia anche il publisher
      storage_key: uploadData.storageKey,
      file_name: fileName,
      mime_type: contentType,
      file_size: fileSize,
      type: type
    });

    res.status(200).json({
      status: "success",
      data: {
        ...uploadData,
        mediaId: media.id
      }
    });
  }),

  getMedia: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    
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