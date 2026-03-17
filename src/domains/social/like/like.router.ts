import { Router } from "express";
import { requiresAuth } from "../../../middleware/auth.middleware";
import { requiresActiveUser } from "../../../middleware/activeUser.middleware";
import { likeController } from "./like.controller";
import { dtoMiddleware } from "../../../middleware/dto.middleware";
import { ToggleLikeDTO } from "./like.dto";

export const likeRouter = Router()

likeRouter.use(requiresAuth);
likeRouter.use(requiresActiveUser);

likeRouter.post('/post', dtoMiddleware(ToggleLikeDTO), likeController.toggleLikeOnPost);
likeRouter.post('/scroll-video', dtoMiddleware(ToggleLikeDTO), likeController.toggleLikeOnScrollVideo);