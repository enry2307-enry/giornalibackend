// src/domains/content/scroll-video/scroll-video.controller.ts
import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { AppError } from "../../../errors/AppError";
import { ApiResponse } from "../../../core/types/api.types";
import { scrollVideoService } from "./scroll-video.service"; 

export const scrollVideoController = {
  /**
   * Crea uno ScrollVideo (Richiede almeno un file video).
   */
  createScrollVideo: catchAsync(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      throw new AppError('A video file is required for ScrollVideo', 400);
    }

    const { content } = await scrollVideoService.create(req.body, files);

    const response: ApiResponse = {
      status: 'success',
      data: { scrollVideo: content },
      message: "ScrollVideo created successfully"
    };

    return res.status(201).json(response);
  }),

  /**
   * Recupera per ID.
   */
  getById: catchAsync(async (req: Request, res: Response) => {
    const scrollVideo = await scrollVideoService.getById(req.params.id);

    const response: ApiResponse = {
      status: 'success',
      data: { scrollVideo }
    };

    return res.status(200).json(response);
  }),

  /**
   * Aggiorna metadati.
   */
  updateScrollVideo: catchAsync(async (req: Request, res: Response) => {
    const scrollVideo = await scrollVideoService.update(req.params.id, req.body);

    const response: ApiResponse = {
      status: 'success',
      data: { scrollVideo }
    };

    return res.status(200).json(response);
  }),

  /**
   * Soft delete dello ScrollVideo.
   */
  deleteScrollVideo: catchAsync(async (req: Request, res: Response) => {
    await scrollVideoService.delete(req.params.id);
    return res.status(204).send();
  })
};