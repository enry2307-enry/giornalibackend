import { BaseRepository } from "../../../core/database/baseRepository";
import { Publisher, PublisherInsert } from "../profiles.types";

class PublisherRepository extends BaseRepository<
  Publisher,
  PublisherInsert
> {
  protected tableName = "publisher";
}

export const publisherRepository = new PublisherRepository();