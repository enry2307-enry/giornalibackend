import { Router } from "express";
import { categoryController } from "./category.controller";
import { requiresAuth } from "../../../middleware/auth.middleware";
import { requiresActiveUser } from "../../../middleware/activeUser.middleware";

export const categoryRouter = Router();

categoryRouter.use(requiresAuth);
categoryRouter.use(requiresActiveUser);

categoryRouter.get('/', categoryController.getAll);
categoryRouter.get('/:id', categoryController.getById);
