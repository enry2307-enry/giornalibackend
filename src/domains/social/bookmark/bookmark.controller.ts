import { savePostService, saveScrollVideoService } from "./bookmark.service";
import { catchAsync } from "../../../utils/catchAsync";
import { Request, Response } from "express";

export const bookmarkController = {
  togglePostBookmark: catchAsync(async (req: Request, res: Response) => {
    const { data, performedUpsert } = await savePostService.toggleBookmark(
      req.user.id,
      req.params.id, 
      req.body
    );

    res.status(performedUpsert ? 201 : 200).json({
      data: { post: data },
      message: 'Post save toggled'
    })
  }),

  toggleScrollVideoBookmark: catchAsync(async (req: Request, res: Response) => {
    const { data, performedUpsert } = await saveScrollVideoService.toggleBookmark(
      req.user.id,
      req.params.id, 
      req.body
    );

    res.status(performedUpsert ? 201 : 200).json({
      data: { scrollVideo: data },
      message: 'ScrollVideo save toggled'
    })
  }),

  togglePostNotification: catchAsync(async (req: Request, res: Response) => {
    const post = await savePostService.toggleNotification(
      req.user.id,
      req.params.id, 
    );

    res.status(200).json({
      data: { post },
      message: 'Post notification toggled'
    })
  }),

  toggleScrollVideoNotification: catchAsync(async (req: Request, res: Response) => {
    const post = await saveScrollVideoService.toggleNotification(
      req.user.id,
      req.params.id, 
    );

    res.status(200).json({
      data: { post },
      message: 'ScrollVideo notification toggled'
    })
  }),

}