import { Router } from "express";
import { requiresAuth } from "../../../middleware/auth.middleware";
import { requiresActiveUser } from "../../../middleware/activeUser.middleware";
import { bookmarkController } from "./bookmark.controller";
import { dtoMiddleware } from "../../../middleware/dto.middleware";
import { SavePostToggleDTO, SaveScrollVideoToggleDTO } from "./bookmark.dto";

export const bookmarkRouter = Router();

bookmarkRouter.use(requiresAuth);
bookmarkRouter.use(requiresActiveUser);

/**
 * Salvataggio di un contenuto
 */
bookmarkRouter.post(
  '/posts/:id',
  dtoMiddleware(SavePostToggleDTO), 
  bookmarkController.togglePostBookmark
);
bookmarkRouter.post(
  '/scroll-videos/:id',
  dtoMiddleware(SaveScrollVideoToggleDTO),
  bookmarkController.toggleScrollVideoBookmark
);

/**
 * Attivazione/Disattivazione notifiche
 */
bookmarkRouter.post(
  '/posts/notify/:id',
  bookmarkController.togglePostNotification
);
bookmarkRouter.post(
  '/scroll-videos/notify/:id',
  bookmarkController.toggleScrollVideoNotification
);