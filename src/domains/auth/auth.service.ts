import bcrypt from 'bcrypt';
import { authRepository } from "./auth.repository";
import { LoginDTO } from './auth.dto';
import { jwtUtils } from '../../core/utils/jwt';
import { ForbiddenError, NotFoundError, ValidationError } from '../../errors/AppError';
import { PublicUser, Session, UserBaseUpdate } from './auth.types';
import { toPublic } from '../../core/utils/objects.utils';
import { EntityNotFoundError } from '../../types/repository';

class AuthService {
  
  async register(dto: LoginDTO): Promise<Session> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await authRepository.create({
      email: dto.email,
      password_hash: hashedPassword
    });

    const payload = { id: newUser.id, token_version: newUser.token_version };
    const accessToken = jwtUtils.generateAccessToken(payload);
    const refreshToken = jwtUtils.generateRefreshToken(payload);

    return {
      user: toPublic(newUser),
      accessToken,
      refreshToken
    };
  }

  async login(dto: LoginDTO): Promise<Session> {
    const user = await authRepository.findOneWhere({ email: dto.email });
    if (!user) {
      throw new NotFoundError('Authentication Failed');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new ForbiddenError('Authentication Failed');
    }

    const payload = { id: user.id, token_version: user.token_version };
    const accessToken = jwtUtils.generateAccessToken(payload);
    const refreshToken = jwtUtils.generateRefreshToken(payload);

    return {
      user: toPublic(user),
      accessToken,
      refreshToken
    };
  }

  async updatePassword(userId: string, oldPwd: string, newPsw: string) {
    const user = await authRepository.findById(userId);

    if (!user) throw new EntityNotFoundError('user', userId);

    const isMatch = await bcrypt.compare(oldPwd, user.password_hash);
    if (!isMatch) throw new ForbiddenError('Authentication Failed');

    if (oldPwd === newPsw) throw new ValidationError('Old Password and New Password are equal');

    const salt = await bcrypt.genSalt(10);
    const newPswHash = await bcrypt.hash(newPsw, salt);

    const dataToUpdate: UserBaseUpdate = {
      password_hash: newPswHash,
      token_version: user.token_version + 1
    };

    return toPublic(await authRepository.update(userId, dataToUpdate));
  }
  
  async getSession(userId: string): Promise<PublicUser> {
    const user = await authRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Session invalid or unexisting user');
    }

    return toPublic(user);
  }

  async refresh(token: string) {
    if (!token) {
      throw new ForbiddenError('Refresh token missing');
    }

    const decoded = jwtUtils.verifyRefreshToken(token) as { id: string, token_version: number };

    const user = await authRepository.findById(decoded.id);
    if (!user) {
      throw new ForbiddenError('User not found or inactive');
    }

    if (user.token_version !== decoded.token_version) {
      throw new ForbiddenError('Token version mismatch. Please login again.');
    }

    const payload = { id: user.id, token_version: user.token_version };
    const accessToken = jwtUtils.generateAccessToken(payload);
    const refreshToken = jwtUtils.generateRefreshToken(payload);

    return {
      user: toPublic(user),
      accessToken,
      refreshToken
    };
  }
}

export const authService = new AuthService();