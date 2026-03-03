// src/domains/content/scroll-video/scroll-video.types.ts
import { BaseAbstractEntity } from "../../../types/baseEntity";
import { ContentStatus } from "../post/post.types";

export interface ScrollVideo extends BaseAbstractEntity {
  publisher_id: string;
  category_id: string;
  status: ContentStatus;
  description?: string;
  main_video_id?: string;
}

export interface ScrollVideoInsert extends Pick<
  ScrollVideo, 
  'publisher_id' | 'category_id' | 'status'
> {
  description?: string;
  main_video_id: string;
}

export interface ScrollVideoUpdate extends Partial<Pick<
  ScrollVideo, 
  'status' | 'description'
>> {}