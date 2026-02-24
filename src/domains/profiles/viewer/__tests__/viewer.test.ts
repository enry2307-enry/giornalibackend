import request from 'supertest';
import app from '../../../../app';
import { authRepository } from '../../../auth/auth.repository';
import { generateMockUser, generateMockViewer } from '../../../../../tests/utils/test-data.utils';

describe('Viewer CRUD Integration Tests', () => {
  let authToken: string;
  let viewerId: string;
  const mockUser = generateMockUser();
  const mockViewer = generateMockViewer();

  beforeAll(async () => {
    // Registrazione e Login per ottenere il token
    await request(app).post('/api/v1/auth/register').send(mockUser);
    const loginRes = await request(app).post('/api/v1/auth/login').send({
      email: mockUser.email,
      password: mockUser.password
    });
    authToken = loginRes.body.data.accessToken;
  });

  afterAll(async () => {
    // Cleanup dell'utente creato (il cleanup dei profili è gestito dai vincoli del DB o soft-delete)
    await authRepository.deleteByEmail(mockUser.email);
  });

  describe('POST /viewers', () => {
    it('should create a new viewer profile', async () => {
      const res = await request(app)
        .post('/api/v1/profiles/viewers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(mockViewer);

      expect(res.status).toBe(201);
      expect(res.body.data.viewer).toHaveProperty('id');
      expect(res.body.data.viewer.username).toBe(mockViewer.username);
      viewerId = res.body.data.viewer.id;
    });
  });

  describe('GET /viewers/:id', () => {
    it('should return viewer details by ID', async () => {
      const res = await request(app)
        .get(`/api/v1/profiles/viewers/${viewerId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.data.viewer.id).toBe(viewerId);
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app)
        .get(`/api/v1/profiles/viewers/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`);

      // Verifica che il mapping EntityNotFoundError -> 404 funzioni
      expect(res.status).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('PATCH /viewers', () => {
    it('should not update the viewer profile', async () => {
      const updateData = { username: 'Updated Name' };
      const res = await request(app)
        .patch('/api/v1/profiles/viewers')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /viewers', () => {
    it('should delete the viewer profile', async () => {
      const res = await request(app)
        .delete('/api/v1/profiles/viewers')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: mockUser.password });

      // Lo status 204 conferma il successo dell'operazione di cancellazione
      expect(res.status).toBe(204);
    });
  });
});