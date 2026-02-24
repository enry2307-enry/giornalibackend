import bcrypt from 'bcrypt';
import { EntityNotFoundError } from "../../../types/repository";
import { BaseService } from "../../../core/services/baseService";
import { PublisherCreateDTO, PublisherUpdateDTO } from "./publisher.dto";
import { Publisher, PublisherInsert } from "../profiles.types";
import { publisherRepository } from "./publisher.repository";
import { ForbiddenError } from "../../../errors/AppError";
import { authRepository } from "../../auth/auth.repository";

class PublisherService extends BaseService<
  Publisher, 
  PublisherCreateDTO, 
  PublisherUpdateDTO, 
  PublisherInsert 
> {
  constructor() {
    super(publisherRepository);
  }

  async create(userId: string, dto: PublisherCreateDTO) {
    return super.execCreate(dto, { user_id: userId });
  }

  async update(userId: string, dto: PublisherUpdateDTO) {
    const publisher = await this.repository.findOneWhere({ user_id: userId });

    if (!publisher) {
      throw new EntityNotFoundError('Publisher', userId); 
    }

    return super.execUpdate(publisher.id, dto);
  }

  async delete(userId: string, password: string) {
    const publisher = await this.repository.findOneWhere({ user_id: userId });
    if (!publisher) throw new EntityNotFoundError('Publisher', userId);

    const user = await authRepository.findById(userId);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) throw new ForbiddenError('Authentication Failed');

    await this.repository.softDelete(publisher.id);
  }
}

export const publisherService = new PublisherService();