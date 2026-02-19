import bcrypt from 'bcrypt';
import { authRepository } from "./auth.repository";
import { UserBaseInsert } from "../../types/models";
import { LoginDTO } from './auth.dto';
import { jwtUtils } from '../../core/utils/jwt';
import { ForbiddenError, NotFoundError } from '../../errors/AppError';

class AuthService {

  async register(body: UserBaseInsert) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password_hash, salt);

    const rawUser = await authRepository.create({
      ...body,
      password_hash: hashedPassword
    });

    const { password_hash, ...publicUser } = rawUser;
    
    return publicUser;
  }

  async login(dto: LoginDTO) {

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

    const { password_hash, ...publicUser } = user;

    return {
      user: publicUser,
      accessToken,
      refreshToken
    };
  }
}

export const authService = new AuthService();