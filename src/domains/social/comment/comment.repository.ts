import { BaseRepository, QueryResult } from "../../../core/database/baseRepository";
import { Comment, CommentInsert, CommentUpdate, PublicComment } from "./comment.types";
import supabase from "../../../core/database/supabase";
import { FindOptions } from "../../../core/types/repository.types";

export class GenericCommentRepository extends BaseRepository<
  Comment,
  CommentInsert,
  CommentUpdate
> {
  protected override tableName: string = 'commentunified'; 
  protected viewName: string = 'commentunified'

  constructor(tableName: string) {
    super();
    this.tableName = tableName;
  }

  async getRepliesWithAuthor(
    parameters: {
      entityType: 'post' | 'scrollvideo' | 'comment',  // non so se mi piacciono hard coded qui
      entityId: string
    },
    options?: FindOptions
  ): Promise<QueryResult<PublicComment[]>>{
    try {

      const columnName = parameters.entityType === 'comment' ? 'parent_id' : 'entity_id';

      let query = supabase
        .from(this.viewName)
        .select('*')
        .eq(columnName, parameters.entityId)
        .eq('is_deleted', false)
        .eq('entity_type', this.tableName);

      const limit = options?.limit ?? 10;
      const orderColumn = options?.orderBy?.column || 'created_at';
      const ascending = options?.orderBy?.ascending ?? true;

      // ordina
      query = query.order(orderColumn, { ascending });

      // paginazione: cursor-based o offset-based
      if (options?.cursor) {
        query = query.gt(orderColumn, options.cursor).limit(limit);
      } else {
        const offset = options?.offset ?? 0;
        query = query.range(offset, offset + limit - 1);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      // calcola nextCursor
      const lastItem = data && data.length > 0 ? data[data.length - 1] as any : null;
      const nextCursor = lastItem && data.length === limit
        ? lastItem[orderColumn]
        : undefined;

      // mappa author
      const replies = (data as any[]).map(c => ({
        id: c.id,
        content: c.content,
        created_at: c.created_at,
        entity_type: c.entity_type,
        entity_id: parameters.entityId,
        author: {
          id: c.author_id,
          name: c.author_name,
          avatar: c.author_avatar,
          type: c.author_type,
        }
      }));

      return {
        data: replies,
        meta: {
          count: count || 0,
          nextCursor
        }
      };

    } catch (error) {
      this.handleError(error, 'GenericComment.getRepliesWithAuthor');
    }
  }
}

export const commentOnPostRepository = new GenericCommentRepository('commentonpost');
export const commentOnScrollVideoRepository = new GenericCommentRepository('commentonscrollvideo');