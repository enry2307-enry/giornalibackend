// src/domains/content/scroll-video/scroll-video.router.ts
import { Router } from "express";
import { scrollVideoController } from "./scroll-video.controller";
import { uploadMiddleware } from "../../../middleware/multer.middleware";
import { dtoMiddleware } from "../../../middleware/dto.middleware";
import { CreateScrollVideoDTO, UpdateScrollVideoDTO } from "./scroll-video.dto";
import { commentController } from "../../social/comment/comment.controller";
import { EntityType } from "../../social/comment/comment.types";
import { CommentEditDTO } from "../../social/comment/comment.dto";

export const scrollVideoRouter = Router();

scrollVideoRouter.post("/", 
  uploadMiddleware.array("files", 5), 
  dtoMiddleware(CreateScrollVideoDTO), 
  scrollVideoController.createScrollVideo
);

scrollVideoRouter.get("/:contentId", scrollVideoController.getById);

scrollVideoRouter.patch("/:contentId", 
  dtoMiddleware(UpdateScrollVideoDTO), 
  scrollVideoController.updateScrollVideo
);

scrollVideoRouter.delete("/:contentId", scrollVideoController.deleteScrollVideo);


/**
 * ==================
 * COMMENTI
 * ==================
 */
// GET /api/v1/scroll-video/:contentId/comments
scrollVideoRouter.get('/:contentId/comments', 
  commentController.getComments(EntityType.SCROLLVIDEO)
);

// POST /api/v1/scroll-video/:contentId/comments
scrollVideoRouter.post('/:contentId/comments', 
  dtoMiddleware(CommentEditDTO), 
  commentController.create(EntityType.SCROLLVIDEO)
);

// PUT /api/v1/scroll-video/comments/:commentId
scrollVideoRouter.put('/comments/:commentId', 
  dtoMiddleware(CommentEditDTO), 
  commentController.update(EntityType.SCROLLVIDEO)
);

// GET /api/v1/scroll-video/comments/:parentId/replies
scrollVideoRouter.get('/comments/:parentId/replies', 
  commentController.getCommentReplies(EntityType.SCROLLVIDEO)
);