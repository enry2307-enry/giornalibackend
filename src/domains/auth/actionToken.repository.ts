import { BaseRepository } from "../../core/database/baseRepository";
import supabase from "../../core/database/supabase";
import { UserActionStatus, UserActionToken, UserActionTokenInsert, UserActionTokenUpdate, UserActionType } from "./auth.types";

class UserActionTokenRepository extends BaseRepository<
  UserActionToken,
  UserActionTokenInsert,
  UserActionTokenUpdate
> {
  protected tableName: string = 'useractiontoken';

  async findValidTokenByCode(code: string, type: UserActionType): Promise<UserActionToken | null> {
    try {
      const { data, error } = await supabase
        .from(this.tableName)
        .select(this.defaultSelect)
        .eq('code', code)
        .eq('type', type)
        .eq('status', UserActionStatus.PENDING)
        .eq('is_deleted', false)
        .gt('expires_at', new Date().toISOString()) // Scadenza futura
        .maybeSingle();

      if (error) throw error;
      return data as UserActionToken | null;
    } catch (error) {
      this.handleError(error, 'findValidTokenByCode');
    }
  }

  async revokePreviousTokens(userId: string, type: UserActionType): Promise<void> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .update({ status: UserActionStatus.REVOKED })
        .eq('user_id', userId)
        .eq('type', type)
        .eq('status', UserActionStatus.PENDING);
      
      if (error) throw error;
    } catch (error) {
      this.handleError(error, 'revokePreviousTokens');
    }
  }
}

export const userActionTokenRepository = new UserActionTokenRepository();