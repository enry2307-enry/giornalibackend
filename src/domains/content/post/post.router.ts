// src/domains/post/post.router.ts
import { Router } from "express";
import { postController } from "./post.controller";
import { uploadMiddleware } from "../../../middleware/multer.middleware";
import { dtoMiddleware } from "../../../middleware/dto.middleware";
import { CreatePostDTO, UpdatePostDTO } from "./post.dto";
import { requiresAuth } from "../../../middleware/auth.middleware";

const router = Router();

router.use(requiresAuth);

router.post(
  "/",
  uploadMiddleware.array("files", 10),
  dtoMiddleware(CreatePostDTO),
  postController.createPost
);

router.patch(
  "/:id",
  dtoMiddleware(UpdatePostDTO),
  postController.updatePost
);

router.delete(
  "/:id",
  postController.deletePost
);

export default router;