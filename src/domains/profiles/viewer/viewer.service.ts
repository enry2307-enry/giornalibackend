import bcrypt from 'bcrypt';
import { ViewerCreateDTO, ViewerUpdateDTO } from './viewer.dto';
import { doesProfileAlreadyExist } from '../shared';import { DuplicateError, ForbiddenError, NotFoundError } from '../../../errors/AppError';
import { viewerRepository } from './viewer.repository';
import { Viewer } from '../profiles.types';
import { authRepository } from '../../auth/auth.repository';
import { DuplicateProfileError, ViewerNotFoundError } from '../profiles.errors';
import { AuthenticationError } from '../../auth/auth.errors';

class ViewerService {
  async create(userId: string, dto: ViewerCreateDTO): Promise<Viewer> {

    const duplicated = await doesProfileAlreadyExist(userId);  // controlla sia per publisher che per viewer
    if(duplicated) throw new DuplicateProfileError();

    const viewer = await viewerRepository.create({
      user_id: userId,
      ...dto
    });

    return viewer;
  }

  async getMe(userId: string): Promise<Viewer> {
    const viewer = await viewerRepository.findOneWhere({user_id: userId});
    if(!viewer) throw new ViewerNotFoundError();
    return viewer;
  }

  async getById(id: string) {
    return await viewerRepository.findById(id);
  }

  async update(userId: string, dto: ViewerUpdateDTO): Promise<Viewer> {
    const viewer = await viewerRepository.findOneWhere({user_id: userId});
    if(!viewer) throw new ViewerNotFoundError();

    return await viewerRepository.update(viewer.id, {...dto});
  }

  async delete(userId: string, password: string): Promise<void> {
    const user = await authRepository.findById(userId);

    const viewer = await viewerRepository.findOneWhere({user_id: userId});
    if(!viewer) throw new ViewerNotFoundError();

    if(!bcrypt.compare(password, user.password_hash)) 
      throw new AuthenticationError();

    await viewerRepository.softDelete(viewer.id);
  }
}

export const viewerService = new ViewerService();