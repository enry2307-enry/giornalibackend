// src/domains/post/post.router.ts
import { Router } from "express";
import { postController } from "./post.controller";
import { uploadMiddleware } from "../../../middleware/multer.middleware";
import { dtoMiddleware } from "../../../middleware/dto.middleware";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { requiresAuth } from "../../../middleware/auth.middleware";

const postRouter = Router();

postRouter.use(requiresAuth);

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

export default postRouter;