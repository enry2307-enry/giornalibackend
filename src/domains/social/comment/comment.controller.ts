import { Request, Response } from "express";
import { catchAsync } from "../../../utils/catchAsync";
import { toResponse } from "../../../core/utils/objects.utils";
import { commentOnPostService, commentOnScrollVideoService } from "./comment.service";
import { ValidationError } from "../../../errors/AppError";

export const commentController = {
  createCommentOnPost: catchAsync(async (req: Request, res: Response) => {
    const comment = await commentOnPostService.create(req.user.id, req.body);

    res.status(201).json(toResponse({
      data: comment
    }))
  }),

  createCommentOnScrollVideo: catchAsync(async (req: Request, res: Response) => {
    const comment = await commentOnScrollVideoService.create(req.user.id, req.body);

    res.status(201).json(toResponse({
      data: comment
    }))
  }),

  updateCommentOnPost: catchAsync(async (req: Request, res: Response) => {
    const comment = await commentOnPostService.update(req.user.id, req.body);

    res.status(200).json(toResponse({
      data: comment
    }))
  }),

  updateCommentOnScrollVideo: catchAsync(async (req: Request, res: Response) => {
    const comment = await commentOnScrollVideoService.update(req.user.id, req.body);

    res.status(200).json(toResponse({
      data: comment
    }))
  }),

  /**
   * Ritorna la lista di commenti che hanno risposto ad un commento specifico.
   * Sulla tabella POST
   */
  getPostCommentReplies: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required param id.');

    // naturalmente va validato e sanitizzato
    const cursor = req.query['cursor'] as string | undefined;

    const { data, meta } = await commentOnPostService.getReplies(id, {cursor});

    res.status(200).json(toResponse({
      data,
      meta
    }));
  }),

  /**
   * Ritorna la lista di commenti che hanno risposto ad un commento specifico.
   * Sulla tabella SCROLLVIDEO
   */
  getScrollVideoCommentReplies: catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if(!id) throw new ValidationError('Missing required param id.');

    // naturalmente va validato e sanitizzato
    const cursor = req.query['cursor'] as string | undefined;

    const { data, meta } = await commentOnScrollVideoService.getReplies(id, {cursor});

    res.status(200).json(toResponse({
      data,
      meta
    }));
  })

  // qui manca di prendere i commenti di un post e scrollvideo specifico
}