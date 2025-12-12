//__tests__/integration/viewer.integration.test.ts
import request from 'supertest';
import app from '../../src/app';
import { Response } from 'supertest';
import supabase from '../../src/config/supabase';

async function cleanup(): Promise<void> {
  await supabase
    .from('viewer')
    .delete()
    .like('username', '%test%');

  await supabase
    .from('userbase')
    .delete()
    .like('email', '%@test.com');
}

async function createUser(
  email: string = 'test@test.com',
  password: string = 'password123',
  passwordConfirmation: string = 'password123'
): Promise<Response> {
  const res = await request(app)
    .post('/userbase/register')
    .send({
      email: 'test@test.com',
      password: 'password123',
      passwordConfirmation: 'password123'
    });
  
  return res;
}

describe('Viewer API Integration Tests', () => {
  
  // cleanup
  afterEach(cleanup);

  describe('POST /viewer', () => {
    let userId: string;

    beforeEach(async () => {
      // Create a user for testing
      const res = await createUser();
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
  });

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

      //Create a viewer for testing
      await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username'
        });
    });

    it('should fetch viewer successfully', async () => {
      const res = await request(app)
        .get(`/viewer/me/${userId}`)

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('viewer');
      expect(res.body.viewer.user_id).toBe(userId);
    });

    it('should fail to get unexisting user', async () => {
      const res = await request(app)
        .get('/viewer/me/00000000-0000-0000-0000-000000000000')
    
      expect(res.status).toBe(404);
      expect(res.body.code).toBe('NOT_FOUND');
    })
  });

  describe('GET viewer/:viewerId', () => {
    let viewerId: string;

    beforeEach(async () => {
      // Create a user for testing
      const res = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          passwordConfirmation: 'password123'
        });

      //Create a viewer for testing
      const res1 = await request(app)
        .post('/viewer')
        .send({
          userId: res.body.user.id,
          username: 'test_username'
        });

      viewerId = res1.body.viewer.id;
    });

    it('should retrieve viewer successfully', async () => {
      const res = await request(app)
        .get(`/viewer/${viewerId}`);

      expect(res.status).toBe(200);
      expect(res.body.viewer.id).toBe(viewerId);
      expect(res.body.viewer.username).toBe('test_username');
    });

    it('should fail to retrieve non existing viewer', async () => {
      const res = await request(app)
        .get('/viewer/00000000-0000-0000-0000-000000000000');

      expect(res.status).toBe(200);
      expect(res.body.viewer).toBe(null);
    });
  });

  describe('PUT /viewer/:viewerId', () => {
    let userId: string;
    let viewerId: string;

    beforeEach(async () => {
      // Create a user for testing
      const userRes = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          passwordConfirmation: 'password123'
        });

      userId = userRes.body.user.id;

      //Create a viewer for testing
      const viewerRes = await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username'
        });

      viewerId = viewerRes.body.viewer.id;
    });

    it('should successfully add description to viewer', async () => {
      const res = await request(app)
        .put(`/viewer/${viewerId}`)
        .send({
          userId: userId,
          description: 'test_description'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('viewer');
      expect(res.body.viewer.id).toBe(viewerId);
      expect(res.body.viewer).toHaveProperty('description');
      expect(res.body.viewer.description).toBe('test_description');
    });

    it('shouldn\'t update viewer with unexisting provided userId', async () => {
      const res = await request(app)
      .put(`/viewer/${viewerId}`)
      .send({
        userId: '00000000-0000-0000-0000-000000000000',
        description: 'test_description'
      });

      expect(res.status).toBe(404);
    });

    it('should fail to update viewer with userId of another user', async () => {
      
      // Creating another user to use its userId to update another
      // viewer
      // Should result in FORBIDDEN
      const userRes = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test1@test.com',
          password: 'password456',
          passwordConfirmation: 'password456'
        })

      const otherUserId = userRes.body.user.id;

      const res = await request(app)
        .put(`/viewer/${viewerId}`)
        .send({
          userId: otherUserId,
          description: 'test_description'
        })

      expect(res.status).toBe(403);
      expect(res.body.code).toBe('FORBIDDEN_ERROR');
    });

    it('should raise validation error when no fields to update are provided', async () => {
      const res = await request(app)
        .put(`/viewer/${viewerId}`)
        .send({
          userId: userId
        })

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR')
    });
  });

  describe('DELETE /viewer/:viewerId', () => {
    let userId: string;
    let viewerId: string;

    beforeEach(async () => {
      // Create a user for testing
      const userRes = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          passwordConfirmation: 'password123'
        });

      userId = userRes.body.user.id;

      //Create a viewer for testing
      const viewerRes = await request(app)
        .post('/viewer')
        .send({
          userId: userId,
          username: 'test_username'
        });

      viewerId = viewerRes.body.viewer.id;
    });

    it('should successfully soft delete viewer', async () => {
      const res = await request(app)
        .delete(`/viewer/${viewerId}`)
        .send({
          userId,
          password: 'password123',
          passwordConfirmation:'password123'
        });

      const fetchRes = await request(app)
        .get(`/viewer/${res.body.viewer.id}`)
      
      expect(res.status).toBe(200);
      expect(res.body).not.toHaveProperty('viewer');

      // This test shouldn't actually be here
      // But for now it is the best place to put it into
      expect(fetchRes.status).toBe(404);
    });

    it('should fail to delete user if passwords don\'t match', async () => {
      const res = await request(app)
        .delete(`/viewer/${viewerId}`)
        .send({
          userId: userId,
          password: 'password123',
          passwordConfirmation: 'password456'
        })

      expect(res.status).toBe(400);
    });

    it('should fail to delete user if password is wrong', async () => {
      const res = await request(app)
        .delete(`/viewer/${viewerId}`)
        .send({
          userId: userId,
          password: 'password456',
          passwordConfirmation: 'password456'
        })

      expect(res.status).toBe(400);
      expect(res.body.code).toBe('VALIDATION_ERROR')
      expect(res.body.message).toBe('Wrong password');
    });

    it('should fail to delete user if another viewer\'s userId is provided', async () => {
      // Create another user
      const userRes = await request(app)
        .post('/userbase/register')
        .send({
          email: 'test@test.com',
          password: 'password123',
          passwordConfirmation: 'password123'
        });

      const userId1 = userRes.body.user.id;

      //Create another viewer for testing
      await request(app)
        .post('/viewer')
        .send({
          userId: userId1,
          username: 'test_username_2'
        });
        

      const res = await request(app)
        .delete(`/viewer/${viewerId}`)
        .send({
          userId: userId1,
          password: 'password123',
          passwordConfirmation: 'password123'
        });

      expect(res.status).toBe(403);
    });
  });
});