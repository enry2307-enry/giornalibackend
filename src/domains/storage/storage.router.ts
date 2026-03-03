// src/domains/storage/storage.router.ts
import { Router } from "express";
import { storageController } from "./storage.controller";
import { requiresAuth } from "../../middleware/auth.middleware";
import { requiresActiveUser } from "../../middleware/activeUser.middleware";

export const storageRouter = Router();

storageRouter.get("/:id", requiresAuth, requiresActiveUser, storageController.getMedia);
