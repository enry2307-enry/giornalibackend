import { Request, Response } from "express";
import { likePostService, likeScrollVideoService } from "./like.service";
import { toResponse } from "../../../core/utils/objects.utils";

export const likeController = {
  toggleLikeOnPost: async(req: Request, res: Response) => {
    const like = likePostService.toggleLike(
      req.user.id,
      req.body
    );

    res.status(201).json(toResponse({
      data: like
    }));
  },

  toggleLikeOnScrollVideo: async(req: Request, res: Response) => {
    const like = likeScrollVideoService.toggleLike(
      req.user.id,
      req.body
    );

    res.status(201).json(toResponse({
      data: like
    }));
  }
}