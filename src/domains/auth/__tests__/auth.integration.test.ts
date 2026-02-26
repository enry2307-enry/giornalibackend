import request from 'supertest';
import app from '../../../app';
import { authRepository } from '../auth.repository';
import { userActionTokenRepository } from '../actionToken.repository';
import { UserStatus, UserActionStatus, UserActionType } from '../auth.types';

describe('Auth System Integration', () => {
  const createdEmails: string[] = [];

  // Funzione migliorata per evitare collisioni nello stesso millisecondo
  const generateMockUser = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000);
    const email = `test_${timestamp}_${random}@example.com`;
    createdEmails.push(email);
    return {
      email,
      password: 'OldPassword123!',
      newPassword: 'NewPassword123!'
    };
  };

  afterAll(async () => {
    for (const email of createdEmails) {
      await authRepository.deleteByEmail(email);
    }
  });

  describe('Registration & Token Generation', () => {
    // Chiamiamo il generatore dentro il test o prima di esso, non a livello di describe globale
    const mock = generateMockUser();

    it('should register a user and verify DB defaults', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: mock.email, password: mock.password });

      // Se non è 201, stampa l'errore del server per debug
      if (res.status !== 201) console.error('Registration Error:', res.body);
      
      expect(res.status).toBe(201);
      expect(res.body.data.user.email).toBe(mock.email);

      // Verifica che il token esista (Creato tramite i DEFAULT del DB)
      const user = await authRepository.findOneWhere({ email: mock.email });
      const token = await userActionTokenRepository.findOneWhere({ user_id: user?.id });

      expect(token).toBeDefined();
      expect(token?.status).toBe(UserActionStatus.PENDING); //
    });
  });

  describe('Verification Flow (Authenticated)', () => {
    const mock = generateMockUser();
    let accessToken: string;
    let userId: string;

    beforeAll(async () => {
      const reg = await request(app)
        .post('/api/v1/auth/register')
        .send({ email: mock.email, password: mock.password });
      
      if (reg.status !== 201) throw new Error(`Setup failed: ${JSON.stringify(reg.body)}`);
      
      userId = reg.body.data.user.id;
      accessToken = reg.body.data.accessToken;
    });

    it('should verify email and activate account', async () => {
      // Recupera il codice generato dal DB
      const token = await userActionTokenRepository.findOneWhere({ user_id: userId });
      
      const res = await request(app)
        .get(`/api/v1/auth/verify?code=${token?.code}`);

      expect(res.status).toBe(200);

      const updatedUser = await authRepository.findById(userId);
      expect(updatedUser.status).toBe(UserStatus.ACTIVE); //
    });

    it('should reject already used tokens', async () => {
      const token = await userActionTokenRepository.findOneWhere({ user_id: userId });
      
      const res = await request(app)
        .get(`/api/v1/auth/verify?code=${token?.code}`);

      expect(res.status).toBe(404); // Il token non è più 'pending'
    });
  });

  describe('Security & Session', () => {
    const mock = generateMockUser();
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
      await request(app).post('/api/v1/auth/register').send({ email: mock.email, password: mock.password });
      const login = await request(app).post('/api/v1/auth/login').send({ email: mock.email, password: mock.password });
      accessToken = login.body.data.accessToken;
      refreshToken = (login.get('Set-Cookie') as any)[0];
    });

    it('should increment token_version on password change', async () => {
      const res = await request(app)
        .patch('/api/v1/auth/password')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ oldPassword: mock.password, newPassword: mock.newPassword });

      expect(res.status).toBe(200);
      expect(res.body.data.user.token_version).toBe(2); //
    });

    it('should fail refresh with old token version', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .set('Cookie', [refreshToken]);

      expect(res.status).toBe(403);
    });
  });
});