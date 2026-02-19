import { UserBase, UserBaseInsert } from "../../types/models";
import { BaseRepository } from "../../core/database/baseRepository";

class AuthRepository extends BaseRepository<
  UserBase,
  UserBaseInsert
> {
  protected tableName = "userbase";
}

export const authRepository = new AuthRepository();