import { BaseRepository } from "../database/baseRepository";
import { removeUndefined, toPublic } from "../utils/objects.utils";

export abstract class BaseService<
  TEntity extends { id: string },
  TInsert extends object,
  TUpdate extends object,
  TRepoInsert extends Partial<TEntity> = any
> {
  constructor(
    protected readonly repository: BaseRepository<TEntity, TRepoInsert>
  ) {}

  async getById(id: string) {
    const record = await this.repository.findById(id);
    return toPublic(record);
  }

  protected async execCreate(dto: TInsert, extra: Record<string, any> = {}) {
    const data = { ...removeUndefined(dto), ...extra } as TRepoInsert;
    const record = await this.repository.create(data);
    return toPublic(record);
  }

  protected async execUpdate(id: string, dto: TUpdate) {
    const cleaned = removeUndefined(dto) as Partial<TEntity>;
    const record = await this.repository.update(id, cleaned);
    return toPublic(record);
  }
}