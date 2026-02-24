import { BaseRepository } from "../../../core/database/baseRepository";
import { Publisher, PublisherInsert, PublisherUpdate } from "../profiles.types";

class PublisherRepository extends BaseRepository<
  Publisher,
  PublisherInsert,
  PublisherUpdate
> {
  protected tableName = "publisher";
}

export const publisherRepository = new PublisherRepository();