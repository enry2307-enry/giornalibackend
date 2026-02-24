import { UserBase, UserBaseInsert } from "./auth.types";
import { BaseRepository } from "../../core/database/baseRepository";
import supabase from "../../core/database/supabase";
import config from "../../config/config";
import { ForbiddenError } from "../../errors/AppError";

class AuthRepository extends BaseRepository<
  UserBase,
  UserBaseInsert
> {
  protected tableName = "userbase";

  // this is only used in tests
  async deleteByEmail(email: string): Promise<void> {

    if (config.nodeEnv != "development" && config.nodeEnv != 'test') {
      throw new ForbiddenError("Cannot execute this operation");
    } 

    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('email', email);

    if (error) throw error;
  }
}

export const authRepository = new AuthRepository();