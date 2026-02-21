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
      // 2. Ogni test si crea l'utente se ne ha bisogno (o usa la funzione)
      const newUser = generateMockUser();
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(newUser);

      expect(res.status).toBe(201);
      expect(res.body.user.email).toBe(newUser.email);
    });

    it('should login with the main user', async () => {
      // Registriamo l'utente prima di testare il login
      await request(app).post('/api/v1/auth/register').send(mainUser);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: mainUser.email,
          password: mainUser.password
        });

      expect(res.status).toBe(200);
      accessToken = res.body.accessToken;
      
      const cookies = res.get('Set-Cookie');
      if (cookies) refreshTokenCookie = cookies[0];
    });

    it('should access /me profile', async () => {
      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe(mainUser.email);
    });

    it('should refresh tokens', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshTokenCookie]);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('accessToken');
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