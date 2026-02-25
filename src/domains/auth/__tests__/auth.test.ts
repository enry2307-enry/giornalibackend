import request from 'supertest';
import app from '../../../app';
import { authRepository } from '../auth.repository';

describe('Auth System Integration Tests', () => {
  const createdEmails: string[] = [];

  const generateMockUser = () => {
    const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const email = `test_${uniqueId}@example.com`;
    createdEmails.push(email);

    return {
      email,
      password: 'OldPassword123!',
      newPassword: 'NewPassword123!',
    };
  };

  afterAll(async () => {
    for (const email of createdEmails) {
      await authRepository.deleteByEmail(email);
    }
  });

  describe('Full Authentication & Security Flow', () => {
    let accessToken: string;
    let refreshTokenCookie: string;
    const mainUser = generateMockUser();

    // --- REGISTRAZIONE ---
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: mainUser.email,
          password: mainUser.password
        });

      expect(res.status).toBe(201);
      expect(res.body.data.user.email).toBe(mainUser.email);
    });

    // --- LOGIN ---
    it('should login with the main user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mainUser.email,
          password: mainUser.password
        });

      expect(res.status).toBe(200);
      accessToken = res.body.data.accessToken;
      
      const cookies = res.get('Set-Cookie');
      if (cookies) refreshTokenCookie = cookies[0];
    });

    // --- PROFILO ---
    it('should access /me profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.user.email).toBe(mainUser.email);
    });

    // --- REFRESH (PRE-CAMBIO PASSWORD) ---
    it('should refresh tokens before password change', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshTokenCookie]);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('accessToken');
    });

    describe('Password Change Security', () => {
      it('should fail if old password is incorrect', async () => {
        const res = await request(app)
          .patch('/api/v1/auth/password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            oldPassword: 'WrongPassword123!',
            newPassword: mainUser.newPassword
          });

        expect(res.status).toBe(403);
        expect(res.body.code).toBe('FORBIDDEN_ERROR');
      });

      it('should fail if old and new password are identical', async () => {
        const res = await request(app)
          .patch('/api/v1/auth/password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            oldPassword: mainUser.password,
            newPassword: mainUser.password
          });

        expect(res.status).toBe(400);
        expect(res.body.message).toContain('equal');
      });

      // --- CAMBIO PASSWORD (SUCCESSO) ---
      it('should change password successfully and increment token_version', async () => {
        const res = await request(app)
          .patch('/api/v1/auth/password')
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            oldPassword: mainUser.password,
            newPassword: mainUser.newPassword
          });

        expect(res.status).toBe(200);
        expect(res.body.data.user).not.toHaveProperty('password_hash');
      });

      // --- VERIFICA INVALIDAZIONE ---
      it('should still allow access with OLD Access Token (Stateless Check)', async () => {
        // L'Access Token non controlla la versione sul DB ad ogni richiesta
        const res = await request(app)
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${accessToken}`);

        expect(res.status).toBe(200);
      });

      it('should REJECT the OLD Refresh Token after password change (Version Mismatch)', async () => {
        // Il refresh interroga il DB e rileva che token_version è cambiata
        const res = await request(app)
          .post('/api/v1/auth/refresh')
          .set('Cookie', [refreshTokenCookie]);

        expect(res.status).toBe(403);
        expect(res.body.message).toContain('version mismatch');
      });
    });

    it('should login with the NEW password and get fresh tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mainUser.email,
          password: mainUser.newPassword
        });

      expect(res.status).toBe(200);
      accessToken = res.body.data.accessToken;
      
      const cookies = res.get('Set-Cookie');
      if (cookies) refreshTokenCookie = cookies[0];
    });

    it('should logout correctly', async () => {
      const res = await request(app) 
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', [refreshTokenCookie]);

      expect(res.status).toBe(204);
    });
  });
});