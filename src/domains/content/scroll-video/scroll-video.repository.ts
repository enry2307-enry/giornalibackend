// src/domains/content/scroll-video/scroll-video.repository.ts
import { BaseRepository } from "../../../core/database/baseRepository";
import { ScrollVideo, ScrollVideoInsert, ScrollVideoUpdate } from "./scroll-video.types";
import supabase from "../../../core/database/supabase";

export class ScrollVideoRepository extends BaseRepository<ScrollVideo, ScrollVideoInsert, ScrollVideoUpdate> {
  protected tableName = 'ScrollVideo';
  protected defaultSelect = 'id,publisher_id,category_id,status,description,created_at';

  async linkMedia(scrollVideoId: string, mediaId: string, position: number): Promise<void> {
    try {
      const { error } = await supabase
        .from('ScrollVideoMedia')
        .upsert({
          scroll_video_id: scrollVideoId,
          media_id: mediaId,
          position: position
        }, { onConflict: 'scroll_video_id,media_id' });

      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'linkMedia');
    }
  }
}

export const scrollVideoRepository = new ScrollVideoRepository();