// src/domains/content/scroll-video/scroll-video.service.ts
import { BaseContentService } from "../content.service";
import { scrollVideoRepository } from "./scroll-video.repository";
import { ScrollVideo, ScrollVideoInsert, ScrollVideoUpdate } from "./scroll-video.types";

export class ScrollVideoService extends BaseContentService<ScrollVideo, ScrollVideoInsert, ScrollVideoUpdate> {
  protected repository = scrollVideoRepository;
  protected storagePrefix = "scroll-videos";
}

export const scrollVideoService = new ScrollVideoService();