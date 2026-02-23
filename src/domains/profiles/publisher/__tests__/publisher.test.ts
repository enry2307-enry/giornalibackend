import request from 'supertest';
import app from '../../../../app';
import { generateMockUser, generateMockPublisher } from '../../../../../tests/utils/test-data.utils';

describe('Publisher CRUD Integration Tests', () => {
  let authToken: string;
  let publisherId: string;
  const mockUser = generateMockUser();
  const mockPublisher = generateMockPublisher();

  // 1. SETUP: Creazione utente e acquisizione Token
  beforeAll(async () => {
    // Registrazione
    await request(app)
      .post('/api/v1/auth/register')
      .send(mockUser);

    // Login per ottenere il JWT
    const loginRes = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: mockUser.email,
        password: mockUser.password
      });

    authToken = loginRes.body.data.accessToken;
  });

  describe('POST /publishers', () => {
    it('should create a new publisher profile', async () => {
      const res = await request(app)
        .post('/api/v1/profiles/publishers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(mockPublisher);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.publisher).toHaveProperty('id');
      expect(res.body.data.publisher.name).toBe(mockPublisher.name);
      
      publisherId = res.body.data.publisher.id;
    });

    it('should fail if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/v1/profiles/publishers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Short' }); // Manca 'type' e name < 5 caratteri

      expect(res.status).toBe(400); // Validato da dtoMiddleware
    });
  });

  describe('GET /publishers/:id', () => {
    it('should return publisher details by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/profiles/publishers/${publisherId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.publisher.id).toBe(publisherId);
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .get(`/api/v1/profiles/publishers/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PATCH /publishers', () => {
    it('should update the current user publisher profile', async () => {
      const updateData = { description: 'Descrizione aggiornata' };
      
      const res = await request(app)
        .patch('/api/v1/profiles/publishers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.data.publisher.description).toBe(updateData.description);
    });
  });

  describe('DELETE /publishers', () => {
    it('should fail with wrong password', async () => {
      const res = await request(app)
        .delete('/api/v1/profiles/publishers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: 'WrongPassword123' });

      expect(res.status).toBe(403);
    });

    it('should delete the publisher profile with correct password', async () => {
      const res = await request(app)
        .delete('/api/v1/profiles/publishers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: mockUser.password });

      expect(res.status).toBe(204);
    });
  });
});