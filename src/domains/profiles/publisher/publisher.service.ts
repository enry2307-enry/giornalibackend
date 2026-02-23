import bcrypt from 'bcrypt';
import { publisherRepository } from "./publisher.repository";
import { PublisherCreateDTO, PublisherUpdateDTO } from "../profiles.dto";
import { Publisher, PublisherInsert, PublisherUpdate } from "../profiles.types";
import { removeUndefined, toPublic } from "../../../core/utils/objects.utils";
import { UserBase } from "../../auth/auth.types";
import { NotFoundError, ForbiddenError } from "../../../errors/AppError";
import { authRepository } from "../../auth/auth.repository";

class PublisherService {
  async create(userId: string, dto: PublisherCreateDTO) {
    const cleanedData = removeUndefined(dto) as Partial<PublisherInsert>;

    const dataToInsert: PublisherInsert = {
      ...cleanedData,
      user_id: userId,
    } as PublisherInsert;

    return toPublic(await publisherRepository.create(dataToInsert));
  }

  async update(userId: string, dto: PublisherUpdateDTO) {
    const publisher: Publisher | null = await publisherRepository.findOneWhere({ user_id: userId });

    if (!publisher?.id) {
      throw new NotFoundError('Publisher not found');
    }
    
    const dataToUpdate = removeUndefined(dto) as PublisherUpdate;

    return toPublic(await publisherRepository.update(publisher.id, dataToUpdate));
  }

  async getById(publisherId: string) {
    return toPublic(await publisherRepository.findById(publisherId));
  }

  async delete(userId: string, password: string) {
    const publisher: Publisher | null = await publisherRepository.findOneWhere({ user_id: userId });
    if (!publisher?.id) {
      throw new NotFoundError('Publisher not found');
    }

    // Need user for password_hash
    const user: UserBase = await authRepository.findById(userId);

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new ForbiddenError('Authentication Failed');
    }

    await publisherRepository.softDelete(publisher.id);
  }
}

export const publisherService = new PublisherService();