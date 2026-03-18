import { Router } from "express";
import { requiresAuth } from "../../../middleware/auth.middleware";
import { requiresActiveUser } from "../../../middleware/activeUser.middleware";
import { dtoMiddleware } from "../../../middleware/dto.middleware";
import { FollowToggleDTO } from "./follow.dto";
import { followController } from "./follow.controller";

const followRouter = Router();

followRouter.use(requiresAuth);
followRouter.use(requiresActiveUser);

followRouter.post('/', dtoMiddleware(FollowToggleDTO), followController.toggle);