import { BaseAbstractEntity } from "../../../types/baseEntity";

// L'export serve per la Repo
export interface BaseAbstractContentSave extends BaseAbstractEntity {
  user_id: string;
  entity_id: string;
  notify_user: boolean;
  is_active: boolean;
}

/**
 * Nel database, le tabelle hanno esattamente le stesse colonne
 * e gli stessi nomi.
 * L'unica cosa che cambia sono le foreign key.
 * 
 * In SavePost:
 * entity_id UUID NOT NULL REFERENCES Post(id) ON DELETE CASCADE
 * 
 * In SaveScrollVideo:
 * entity_id UUID NOT NULL REFERENCES ScrollVideo(id) ON DELETE CASCADE
 * 
 * Questo ci avvantaggia un po' per evitare un codice inutilmente esteso
 */
export interface SavePost extends BaseAbstractContentSave {}
export interface SaveScrollVideo extends BaseAbstractContentSave {}

interface BaseInsert extends Pick<
  BaseAbstractContentSave,
  'entity_id' | 'user_id' | 'notify_user'
> {}

interface BaseUpdate extends Pick<
  BaseAbstractContentSave,
  'notify_user' | 'is_active'
> {}

export interface SavePostInsert extends BaseInsert {}
export interface SavePostUpdate extends BaseUpdate {}

export interface SaveScrollVideoInsert extends BaseInsert {}
export interface SaveScrollVideoUpdate extends BaseUpdate {}