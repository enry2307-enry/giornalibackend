import { categoryService } from "./category.service";
import { catchAsync } from "../../../utils/catchAsync";
import { Request, Response } from "express";

export const categoryController = {
  getAll: catchAsync(async (_req: Request, res: Response) => {
    const categories = await categoryService.getAll();

    res.send(200).json({
      status: 'success',
      data: { categories }
    })
  }),

  getById: catchAsync(async (req: Request, res: Response) => {
    const categories = await categoryService.getById(req.params.id);

    res.send(200).json({
      status: 'success',
      data: { categories }
    })
  }),
}