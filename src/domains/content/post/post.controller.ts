// src/domains/post/post.controller.ts
import { Request, Response } from "express";
import { postService } from "./post.service";
import { catchAsync } from "../../../utils/catchAsync";
import { AppError } from "../../../errors/AppError";

export const postController = {
  createPost: catchAsync(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    const { description } = req.body;

    if (!description?.trim() && (!files || files.length === 0)) {
      throw new AppError('At least a description or one file is required', 400);
    }

    const { post, hasUploadErrors } = await postService.createPost(req.body, files);

    // Questo va sistemato
    res.status(201).json({
      status: hasUploadErrors ? "partial_success" : "success",
      message: hasUploadErrors 
        ? "Post created as DRAFT because some uploads failed. Please check your files." 
        : "Post created successfully.",
      data: { post }
    });
  }),

  updatePost: catchAsync(async (req: Request, res: Response) => {
    const post = await postService.updatePost(req.params.id, req.body);

    res.status(200).json({
      status: "success",
      data: { post },
    });
  }),

  deletePost: catchAsync(async (req: Request, res: Response) => {
    await postService.deletePost(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  })
}