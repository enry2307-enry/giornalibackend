// src/domains/content/scroll-video/scroll-video.router.ts
import { Router } from "express";
import { scrollVideoController } from "./scroll-video.controller";
import { uploadMiddleware } from "../../../middleware/multer.middleware";
import { dtoMiddleware } from "../../../middleware/dto.middleware";
import { CreateScrollVideoDTO, UpdateScrollVideoDTO } from "./scroll-video.dto";
import { requiresAuth } from "../../../middleware/auth.middleware";
import { requiresActiveUser } from "../../../middleware/activeUser.middleware";

export const scrollVideoRouter = Router();

scrollVideoRouter.use(requiresAuth);
scrollVideoRouter.use(requiresActiveUser);

scrollVideoRouter.post("/", 
  uploadMiddleware.array("files", 5), 
  dtoMiddleware(CreateScrollVideoDTO), 
  scrollVideoController.createScrollVideo
);

scrollVideoRouter.get("/:id", scrollVideoController.getById);

scrollVideoRouter.patch("/:id", 
  dtoMiddleware(UpdateScrollVideoDTO), 
  scrollVideoController.updateScrollVideo
);

scrollVideoRouter.delete("/:id", scrollVideoController.deleteScrollVideo);