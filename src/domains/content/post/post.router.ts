// src/domains/post/post.router.ts
import { Router } from "express";
import { postController } from "./post.controller";
import { uploadMiddleware } from "../../../middleware/multer.middleware";
import { dtoMiddleware } from "../../../middleware/dto.middleware";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { commentController } from "../../social/comment/comment.controller";
import { EntityType } from "../../social/comment/comment.types";
import { CommentCreateDTO, CommentEditDTO } from "../../social/comment/comment.dto";

export const postRouter = Router();

postRouter.post(
  "/",
  uploadMiddleware.array("files", 10),
  dtoMiddleware(CreatePostDTO),
  postController.createPost
);

postRouter.patch(
  "/:id",
  dtoMiddleware(UpdatePostDTO),
  postController.updatePost
);

postRouter.delete(
  "/:id",
  postController.deletePost
);

postRouter.get(
  "/:id",
  postController.getById
)

/**
 * ==================
 * COMMENTI
 * ==================
 */
postRouter.get('/:contentId/comments', 
  commentController.getComments(EntityType.POST)
);

// POST /api/v1/post/:contentId/comments (Crea un commento)
postRouter.post('/:contentId/comments', 
  dtoMiddleware(CommentCreateDTO), 
  commentController.create(EntityType.POST)
);

// PUT /api/v1/post/comments/:commentId (Aggiorna un commento specifico)
postRouter.put('/comments/:commentId', 
  dtoMiddleware(CommentEditDTO), 
  commentController.update(EntityType.POST)
);

// GET /api/v1/post/comments/:parentId/replies (Thread/Risposte)
postRouter.get('/comments/:parentId/replies', 
  commentController.getCommentReplies(EntityType.POST)
);