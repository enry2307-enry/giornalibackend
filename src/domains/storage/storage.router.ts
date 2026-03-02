// src/domains/storage/storage.router.ts
import { Router } from "express";
import { storageController } from "./storage.controller";
import { requiresAuth } from "../../middleware/auth.middleware";

const router = Router();

router.get("/:id", requiresAuth, storageController.getMedia);

export default router;