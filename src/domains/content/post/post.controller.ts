// src/domains/post/post.controller.ts
import { Request, Response } from "express";
import { postService } from "./post.service";
import { catchAsync } from "../../../utils/catchAsync";
import { AppError, ValidationError } from "../../../errors/AppError";

export const postController = {
  createPost: async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const { description } = req.body;

    if (!description?.trim() && (!files || files.length === 0)) {
      throw new AppError('At least a description or one file is required', 400);
    }

    const { content } = await postService.create(req.body, files);

    // Questo va sistemato
    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      data: { content }
    });
  },

  updatePost: async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required param id.');

    const post = await postService.update(req.user.id, id, req.body);

    res.status(200).json({
      status: "success",
      data: { post },
    });
  },

  getById: async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required param id.');

    const post = await postService.getById(id);

    res.status(200).json({
      status: "success",
      data: { post },
    });
  },

  deletePost: async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required param id.');

    await postService.delete(req.user.id, id);

    res.status(204).json({
      status: "success"
    });
  }
}