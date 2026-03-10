import bcrypt from 'bcrypt';
import { authRepository } from "../../auth/auth.repository";
import { DuplicateProfileError, PublisherNotFoundError } from "../profiles.errors";
import { Publisher } from "../profiles.types";
import { doesProfileAlreadyExist } from "../shared";
import { PublisherCreateDTO, PublisherUpdateDTO } from "./publisher.dto";
import { publisherRepository } from "./publisher.repository";
import { AuthenticationError } from '../../auth/auth.errors';

class PublisherService {
  async create(userId: string, dto: PublisherCreateDTO): Promise<Publisher> {
    
    const duplicated = await doesProfileAlreadyExist(userId);
    if(duplicated) throw new DuplicateProfileError();

    const publisher = await publisherRepository.create({
      user_id: userId,
      ...dto
    }); 

    return publisher;
  }

  async getMe(userId: string): Promise<Publisher> {
    const publisher = await publisherRepository.findOneWhere({user_id: userId});
    if(!publisher) throw new PublisherNotFoundError();
    return publisher;
  }

  async getById(id: string): Promise<Publisher> {
    return await publisherRepository.findById(id);
  }

  async update(userId: string, dto: PublisherUpdateDTO): Promise<Publisher> {
    const publisher = await publisherRepository.findOneWhere({user_id: userId});
    if(!publisher) throw new PublisherNotFoundError();
    
    return await publisherRepository.update(publisher.id, dto);
  }

  async delete(userId: string, password: string): Promise<void> {
    const user = await authRepository.findById(userId);

    const publisher = await publisherRepository.findOneWhere({user_id: userId});
    if(!publisher) throw new PublisherNotFoundError();
  
    if(!bcrypt.compare(password, user.password_hash)) 
      throw new AuthenticationError();
    
    await publisherRepository.softDelete(publisher.id);
  }

  /**
   * Servirà un metodo per restituire i documenti ( se la legge lo permetterà )
   * che dimostrano la verifica del publisher
   */
}

export const publisherService = new PublisherService();