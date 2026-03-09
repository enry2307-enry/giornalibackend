import bcrypt from 'bcrypt';
import { ViewerCreateDTO, ViewerUpdateDTO } from "./viewer.dto";
import { viewerRepository } from "./viewer.repository";
import { BaseService } from "../../../core/services/baseService";
import { Viewer } from "../profiles.types";
import { EntityNotFoundError } from "../../../core/types/repository.types";
import { authRepository } from "../../auth/auth.repository";
import { ForbiddenError } from '../../../errors/AppError';

class ViewerService extends BaseService<Viewer, ViewerCreateDTO, ViewerUpdateDTO> {
  constructor() {
    super(viewerRepository);
  }

  async create(userId: string, dto: ViewerCreateDTO) {
    return this.execCreate(dto, { user_id: userId });
  }

  async updateViewerByUserId(userId: string, dto: ViewerUpdateDTO) {
    const viewer = await this.repository.findOneWhere({ user_id: userId });
    
    if (!viewer) {
      throw new EntityNotFoundError('Viewer', userId);
    }

    return this.execUpdate(viewer.id, dto);
  }

  async delete(userId: string, password: string) {
    const viewer = await this.repository.findOneWhere({ user_id: userId });
    if (!viewer) throw new EntityNotFoundError('Viewer', userId);

    const user = await authRepository.findById(userId);
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (!isMatch) throw new ForbiddenError('Authentication Failed');

    await this.repository.softDelete(viewer.id);
  }
}

export const viewerService = new ViewerService();