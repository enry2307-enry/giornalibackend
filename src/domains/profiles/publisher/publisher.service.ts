import { PublisherCreateDTO } from "../profiles.dto";
import { publisherRepository } from "./publisher.repository";
import { PublisherInsert } from "../profiles.types";

class PublisherService {
  async create(userId: string, dto: PublisherCreateDTO) {
    const dataToInsert: PublisherInsert = {
      user_id: userId,
      name: dto.name,
      type: dto.type,
      description: dto.description ?? null,
      profile_image_url: dto.profile_image_url ?? null,
      website_url: dto.website_url ?? null,
    };

    return await publisherRepository.create(dataToInsert);
  }
}

export const publisherService = new PublisherService();