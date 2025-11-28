//__tests__/integration/viewer.integration.test.ts
import request from 'supertest';
import app from '../../src/app';
import supabase from '../../src/config/supabase';

describe('Viewer API Intergation Tests', () => {
  
  // cleanup
  beforeEach(async () => {
    await supabase
      .from('viewer')
      .delete()
      .like('username', '%test%');

    await supabase
      .from('userbase')
      .delete()
      .eq('email', 'test@test.com');
  });

  describe('POST /viewer', () => {
    let userId: string;

    beforeEach(async () => {
      // Create a user for testing
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          passwordConfirmation: 'password123'
        });
      userId = res.body.user.id;
    });

    it('should create a new viewer successfully', async () => {
      const res = await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username',
          description: 'hi!',
          profile_image_url: 'https://google.com'
        })

      expect(res.status).toBe(201);
      expect(res.body.viewer.user_id).toBe(userId);
      expect(res.body.viewer.description).toBe('hi!');
      expect(res.body.viewer.profile_image_url).toBe('https://google.com')
    });

    it('should create a new viewer successfully with optional parameters', async () => {
      const res = await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username'
        })

      expect(res.status).toBe(201);
      expect(res.body.viewer.user_id).toBe(userId);
      expect(res.body.viewer.description).toBe(null);
      expect(res.body.viewer.profile_image_url).toBe(null);
    });

    it('should fail to create viewer with double userId', async () => {
      
      // create one viewer
      await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username'
        })

      const res = await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username2'
        })
        
      expect(res.status).toBe(409);
      expect(res.body.code).toBe('DUPLICATE_ENTRY');
    })

    it('should fail to create viewer with double username', async () => {
      
      // create one viewer
      await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username'
        })

      const res = await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username'
        })
        
      expect(res.status).toBe(409);
      expect(res.body.code).toBe('DUPLICATE_ENTRY');
    })

    describe('GET viewer/me/:userId', () => {
      let userId: string; 
      
      beforeEach(async () => {
        // Create a user for testing
        const res = await request(app)
          .post('/userbase/register')
          .send({
            email: 'test@test.com',
            password: 'password123',
            passwordConfirmation: 'password123'
          });
        userId = res.body.user.id;
      });

      it('should fetch viewer successfully', async () => {
        const res = await request(app)
          .get(`/viewer/me/${userId}`)
        
        expect(res.body.status).toBe(200);
        expect(res.body).toHaveProperty('viewer');
        expect(res.body.viewer.user_id).toBe(userId);
      });
    });

  });
});