// __tests__/integration/userBase.integration.test.ts
import request from 'supertest';
import app from '../../app';
import supabase from '../../config/supabase';

describe('UserBase API Integration Tests', () => {
  
  // Clean up test data after each test
  afterEach(async () => {
    await supabase
      .from('user_base')
      .delete()
      .eq('email', 'test@test.com');
  });

  describe('POST /userbase/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          password_check: 'password123'
        });

      expect(res.status).toBe(201);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe('test@test.com');
      expect(res.body.user).not.toHaveProperty('password_hash');
    });

    it('should fail with duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          password_check: 'password123'
        });

      // Try to create duplicate
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password456',
          password_check: 'password456'
        });

      expect(res.status).toBe(409);
      expect(res.body.code).toBe('DUPLICATE_ENTRY');
    });

    it('should fail when passwords do not match', async () => {
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          password_check: 'password456'
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    it('should fail with missing required fields', async () => {
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com'
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('GET /userbase/:userId', () => {
    let userId: string;

    beforeEach(async () => {
      // Create a user for testing
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          password_check: 'password123'
        });
      userId = res.body.user.id;
    });

    it('should get user by id', async () => {
      const res = await request(app)
        .get(`/userbase/${userId}`)
        .send();

      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe(userId);
      expect(res.body.user.email).toBe('test@test.com');
      expect(res.body.user).not.toHaveProperty('password_hash');
    });

    it('should return 404 for non-existent user', async () => {
      const res = await request(app)
        .get('/userbase/00000000-0000-0000-0000-000000000000')
        .send();

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /userbase/:userId/password', () => {
    let userId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          password_check: 'password123'
        });
      userId = res.body.user.id;
    });

    it('should update password successfully', async () => {
      const res = await request(app)
        .put(`/userbase/${userId}/password`)
        .send({
          oldPassword: 'password123',
          newPassword: 'newpassword456'
        });

      expect(res.status).toBe(200);
      expect(res.body.user.id).toBe(userId);
    });

    it('should fail with incorrect old password', async () => {
      const res = await request(app)
        .put(`/userbase/${userId}/password`)
        .send({
          oldPassword: 'wrongpassword',
          newPassword: 'newpassword456'
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });

    it('should fail for non-existent user', async () => {
      const res = await request(app)
        .put('/userbase/00000000-0000-0000-0000-000000000000/password')
        .send({
          oldPassword: 'password123',
          newPassword: 'newpassword456'
        });

      expect(res.status).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /userbase/:userId', () => {
    let userId: string;

    beforeEach(async () => {
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          password_check: 'password123'
        });
      userId = res.body.user.id;
    });

    it('should soft delete user successfully', async () => {
      const res = await request(app)
        .delete(`/userbase/${userId}`)
        .send({
          password: 'password123'
        });

      expect(res.status).toBe(200);

      // Verify user is soft deleted (can't be retrieved)
      const getRes = await request(app)
        .get(`/userbase/${userId}`)
        .send();

      expect(getRes.status).toBe(404);
    });

    it('should fail with incorrect password', async () => {
      const res = await request(app)
        .delete(`/userbase/${userId}`)
        .send({
          password: 'wrongpassword'
        });

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR');
    });
  });
});