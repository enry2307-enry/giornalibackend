import bcrypt from 'bcrypt';
import { authRepository } from "./auth.repository";
import { LoginDTO } from './auth.dto';
import { jwtUtils } from '../../core/utils/jwt';
import { ForbiddenError, NotFoundError, ValidationError } from '../../errors/AppError';
import { PublicUser, Session, UserActionStatus, UserActionToken, UserActionType, UserBaseUpdate, UserStatus } from './auth.types';
import { toPublic } from '../../core/utils/objects.utils';
import { userActionTokenRepository } from './actionToken.repository';


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

    await this.sendVerificationEmail(newUser.id);

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

    const isMatch = await bcrypt.compare(oldPwd, user.password_hash);
    if (!isMatch) throw new ForbiddenError('Authentication Failed');

    if (oldPwd === newPsw) throw new ValidationError('Old Password and New Password are equal');

    const salt = await bcrypt.genSalt(10);
    const newPswHash = await bcrypt.hash(newPsw, salt);

    const dataToUpdate = {
      password_hash: newPswHash,
      token_version: user.token_version + 1
    };

    return toPublic(await authRepository.update(userId, dataToUpdate));
  }
  
  async getSession(userId: string): Promise<PublicUser> {
    const user = await authRepository.findById(userId);

    return toPublic(user);
  }

  async refresh(token: string) {
    if (!token) {
      throw new ForbiddenError('Refresh token missing');
    }

    const decoded = jwtUtils.verifyRefreshToken(token) as { id: string, token_version: number };

    const user = await authRepository.findById(decoded.id);

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

  async sendVerificationEmail(userId: string) {
    const user = await authRepository.findById(userId);

    if (user.status === UserStatus.ACTIVE) {
      throw new ValidationError('Email already verified');
    }

    // Revoca token precedenti dello stesso tipo
    await userActionTokenRepository.revokePreviousTokens(userId, UserActionType.EMAIL_VERIFICATION);

    
    const actionToken = await userActionTokenRepository.create({
      user_id: userId,
      type: UserActionType.EMAIL_VERIFICATION
    }); // nel db ci sono questi DEFAULT status='pending' e expires_at=now()+interval '15 minutes'

    const code = actionToken.code;
    // TODO: Logica invio email
  }

  async verifyEmail(code: string) {
    // Ricerca token valido (non scaduto e con status='pending')
    const actionToken = await userActionTokenRepository.findValidTokenByCode(
      code, 
      UserActionType.EMAIL_VERIFICATION
    );

    if (!actionToken) {
      throw new NotFoundError('Token invalid, expired or already verified');
    }

    // Aggiornamento stato token
    await userActionTokenRepository.update(actionToken.id, { 
      status: UserActionStatus.COMPLETED 
    });

    // Attivazione utente
    await authRepository.update(actionToken.user_id, { 
      status: UserStatus.ACTIVE 
    });
  }
}

export const authService = new AuthService();