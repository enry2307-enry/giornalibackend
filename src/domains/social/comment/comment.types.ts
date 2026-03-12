import { BaseAbstractEntity } from "../../../types/baseEntity";

export enum CommentStatus {
  NORMAL = 'normal',
  EDITED = 'edited'
}

/**
 * Nel db le tabelle sono 2 in realtà.
 * "CommentOnPost" e "CommentOnScrollVideo".
 * 
 * Però hanno tutti i campi uguali ( tranne due FK ).
 * A livello di types non ci cambia niente.
 * Quindi per il momento, evitiamo di complicare e lasciamoli così.
 * 
 * Si occuperà il router a indirizzare sul service giusto.
 */
export interface Comment extends BaseAbstractEntity {
  user_id: string;
  entity_id: string;
  parent_id?: string;
  content: string;
  status: CommentStatus;
}

export interface CommentInsert extends Pick<
  Comment, 
  'user_id' | 'entity_id' | 'parent_id' | 'content'
> {}

export interface CommentUpdate extends Partial<
  Pick<Comment, 'content' | 'status'>
> {}

export interface CommentUnified extends Omit<Comment, 'entity_id' | 'status'>{
  post_or_video_id: string;
  entity_type: string;
  // author_id: string;  // su questo devo pensarci
  author_name: string;
  author_avatar: string;
  profile_type: string;
}