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
      password: 'Password123!',
    };
  };

  afterAll(async () => {
    for (const email of createdEmails) {
      await authRepository.deleteByEmail(email);
    }
  });

  describe('Flow di Autenticazione', () => {
    let accessToken: string;
    let refreshTokenCookie: string;
    const mainUser = generateMockUser();

    it('should register a new user', async () => {
      const newUser = generateMockUser();
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser);

      expect(res.status).toBe(201);
      // Accesso tramite .data
      expect(res.body.data.user.email).toBe(newUser.email);
    });

    it('should login with the main user', async () => {
      await request(app).post('/api/v1/auth/register').send(mainUser);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mainUser.email,
          password: mainUser.password
        });

      expect(res.status).toBe(200);
      // Accesso tramite .data
      accessToken = res.body.data.accessToken;
      
      const cookies = res.get('Set-Cookie');
      if (cookies) refreshTokenCookie = cookies[0];
    });

    it('should access /me profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      // Accesso tramite .data
      expect(res.body.data.user.email).toBe(mainUser.email);
    });

    it('should refresh tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshTokenCookie]);

      expect(res.status).toBe(200);
      // Verifica proprietà dentro .data
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should logout correctly', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', [refreshTokenCookie]);

      // Lo status 204 non ha body, quindi non serve controllare .data
      expect(res.status).toBe(204);
    });
  });
});