// src/domains/storage/storage.router.ts
import { Router } from "express";
import { storageController } from "./storage.controller";
import { requiresAuth } from "../../middleware/auth.middleware";
import { requiresActiveUser } from "../../middleware/activeUser.middleware";

const router = Router();

router.post(
  "/upload-url",
  requiresAuth,
  requiresActiveUser,
  storageController.requestUpload
);

router.get("/:id", requiresAuth, storageController.getMedia);

export default router;