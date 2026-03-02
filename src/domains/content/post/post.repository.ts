import { BaseRepository } from "../../../core/database/baseRepository";
import { Post, PostInsert, PostUpdate } from "./post.types";
import supabase from "../../../core/database/supabase";

class PostRepository extends BaseRepository<
  Post,
  PostInsert,
  PostUpdate
> {
  protected tableName: string = 'post';
  protected defaultSelect = 'id,publisher_id,category_id,status,description,created_at';

  /**
   * Collega un record Media a un Post nella tabella associativa PostMedia.
   * Usiamo upsert per gestire il conflitto sulla chiave composita (post_id, media_id).
   */
  async linkMedia(
    postId: string,
    mediaId: string,
    position: number = 0,
    isAttachment: boolean = false
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('PostMedia')
        .upsert({
          post_id: postId,
          media_id: mediaId,
          position: position,
          is_attachment: isAttachment
        }, { onConflict: 'post_id,media_id' });

      if (error) throw error;
    } catch (error) {
      // Usiamo l'helper della classe base per loggare l'errore correttamente
      this.handleError(error, 'linkMedia');
    }
  }

}

export const postRepository = new PostRepository();