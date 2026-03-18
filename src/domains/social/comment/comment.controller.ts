import { Request, Response } from "express";
import { EntityType } from "./comment.types";
import { BaseCommentService, commentOnPostService, commentOnScrollVideoService } from "./comment.service";
import { MissingRequiredURLParam, ValidationError } from "../../../errors/AppError";
import { toResponse } from "../../../core/utils/objects.utils";

const serviceMapper: Record<EntityType, BaseCommentService> = {
  [EntityType.POST]: commentOnPostService,
  [EntityType.SCROLLVIDEO]: commentOnScrollVideoService
};


export const commentController = {

  create: (type: EntityType) => {
    return async (req: Request, res: Response) => {
      const { contentId } = req.params;
      if(!contentId) throw new MissingRequiredURLParam('contentId');

      const comment = await serviceMapper[type].create(req.user.id, contentId, req.body);

      res.status(201).json(toResponse({
        data: comment
      }));
    }
  },

  update: (type: EntityType) => {
    return async (req: Request, res: Response) => {
      const { commentId } = req.params;
      if(!commentId) throw new MissingRequiredURLParam('contentId');

      const comment = await serviceMapper[type].update(req.user.id, commentId, req.body);

      res.status(201).json(toResponse({
        data: comment
      }));
    }
  },

  getCommentReplies: (type: EntityType) => {
    return async (req: Request, res: Response) => {
      const { parentId } = req.params;
      if(!parentId) throw new MissingRequiredURLParam('parentId');

      const cursor = req.query['cursor'] as string | undefined;

      const { data, meta } = await serviceMapper[type].getRepliesOfComment(parentId, { cursor });

      res.status(200).json(toResponse({
        data, 
        meta
      }));
    }
  },

  getComments: (type: EntityType) => {
    return async (req: Request, res: Response) => {
      const { contentId } = req.params;
      if(!contentId) throw new MissingRequiredURLParam('contentId');

      const cursor = req.query['cursor'] as string | undefined;

      const { data, meta } = await serviceMapper[type].getComments(contentId, type, { cursor });

      res.status(200).json(toResponse({
        data,
        meta
      }));
    }
  }
}