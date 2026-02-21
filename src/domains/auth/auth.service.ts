import bcrypt from 'bcrypt';
import { authRepository } from "./auth.repository";
import { LoginDTO } from './auth.dto';
import { jwtUtils } from '../../core/utils/jwt';
import { ForbiddenError, NotFoundError } from '../../errors/AppError';
import { PublicUser, Session } from './auth.types';
import { toPublic } from '../../core/utils/objects.utils';

class AuthService {

  async register(dto: LoginDTO): Promise<Session> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await authRepository.create({
      email: dto.email,
      password_hash: hashedPassword,
      status: 'pending_email_verification'
    });

    // Automatic login
    const accessToken = jwtUtils.generateAccessToken({ id: newUser.id });
    const refreshToken = jwtUtils.generateRefreshToken({ id: newUser.id });

    return {
      user: toPublic(newUser),
      accessToken,
      refreshToken
    };
  }

  async login(dto: LoginDTO): Promise<Session> {

    const user = await authRepository.findOneWhere({email: dto.email});
    if (!user) {
      throw new NotFoundError('Authentication Failed');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password_hash);
    if (!isMatch) {
      throw new ForbiddenError('Authentication Failed');
    }

    const accessToken = jwtUtils.generateAccessToken({ id: user.id });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user.id });

    return {
      user: toPublic(user),
      accessToken,
      refreshToken
    };
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

    const decoded = jwtUtils.verifyRefreshToken(token) as { id: string };

    const user = await authRepository.findById(decoded.id);
    if (!user) {
      throw new ForbiddenError('User not found or inactive');
    }

    const accessToken = jwtUtils.generateAccessToken({ id: user.id });
    const refreshToken = jwtUtils.generateRefreshToken({ id: user.id });

    return {
      user: toPublic(user),
      accessToken,
      refreshToken
    };
  }
}

export const authService = new AuthService();