// src/domains/content/scroll-video/scroll-video.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { AppError, ValidationError } from "../../../errors/AppError";
import { ApiResponse } from "../../../core/types/api.types";
import { scrollVideoService } from "./scroll-video.service"; 
import { toResponse } from "../../../core/utils/objects.utils";

export const scrollVideoController = {
  /**
   * Crea uno ScrollVideo (Richiede almeno un file video).
   */
  createScrollVideo: catchAsync(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      throw new ValidationError('Atleast one videofile is required for scrollVideo');
    }

    const scrollVideo = await scrollVideoService.create(req.body, files);

    return res.status(201).json(toResponse({
      data: { scrollVideo }
    }));
  }),

  /**
   * Recupera per ID.
   */
  getById: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required param id.');

    const scrollVideo = await scrollVideoService.getById(id);

    return res.status(200).json(toResponse({
      data: { scrollVideo }
    }));
  }),

  /**
   * Aggiorna metadati.
   */
  updateScrollVideo: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required param id.');

    const scrollVideo = await scrollVideoService.update(req.user.id, id, req.body);

    return res.status(200).json(toResponse({
      data: { scrollVideo }
    }));
  }),

  /**
   * Soft delete dello ScrollVideo.
   */
  deleteScrollVideo: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required param id.');

    await scrollVideoService.delete(req.user.id, id);
    return res.status(204).send();
  })
};