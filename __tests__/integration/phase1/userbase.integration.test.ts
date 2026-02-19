//__tests__/integration/userbase.integration.test.ts
import request from 'supertest';
import app from '../../../src/app';
import { Response } from 'supertest';
import supabase from '../../../src/core/database/supabase';

/**
 * Integration: UserBase service + repository layer.
 * Note: Input validation testing deferred until Zod implementation.
 */

/* TO DO:
 * - User creation:
 *  - Creates user when data is okay DONE SUCCESS
 *  - Doesn't create user when data is not okay DONE SUCCESS
 * - User update:
 *  - Changes password when data is correct DONE SUCCESS
 *  - Raise error when password confirmation is wrong DONE SUCCESS
 *  - Raise error when old password is wrong DONE SUCCESS
 * - User fetch:
 *  - By id ( return 404 if doesn't exist )
 *  - By email ( return 404 if doesn't exist )
 * - User soft deletition:
 *  - Soft deletes correctly if user has provided right password ( 200 )
 *  - Doesn't soft delete if password is wrong ( 400 )
 */
const testEmail = () => `test-${Date.now()}@test.com`;
let createdUserIds: string[] = [];

async function createUser(
  email: string = testEmail(),
  password: string = 'password123',
  passwordConfirmation: string = 'password123'
): Promise<Response> {
  const res = await request(app)
    .post('/userbase/register')
    .send({ email, password, passwordConfirmation });
  
  if (res.status === 201 && res.body.user?.id) {
    createdUserIds.push(res.body.user.id);
  }
  
  return res;
}

afterEach(async () => {
  // Cleanup created users
  if (createdUserIds.length > 0) {
    await supabase
      .from('users')
      .delete()
      .in('id', createdUserIds);
    createdUserIds = [];
  }
});

describe('UserBase API Integration Tests', () => {
  describe('POST /userbase/register', () => {
    it('should create user with valid data', async () => {
      const email = testEmail();
      const res = await createUser(email);

      expect(res.status).toBe(201);
      expect(res.body.user).toMatchObject({
        email,
        id: expect.any(String)
      });
      expect(Object.keys(res.body.user)).not.toContain("password_hash");
      
      createdUserIds.push(res.body.user.id);
    });

    it('shouldn\'t allow the creation of a user with an email already used', async () => {
      const email = testEmail();

      // creating two users with the same email
      await createUser(email);
      const res = await createUser(email);

      expect(res.status).toBe(409);
      expect(res.body.user).toBe(undefined);
    });
  });

  describe('PUT /userbase/:userId/password', () => {
    it('should update password correctly', async () => {

      // I know this is ugly, but it's not the focus of the test
      const userId = (await createUser(
        testEmail(),
        'password123',
        'password123'
      )).body.user.id;

      const res = await request(app)
        .put(`/userbase/${userId}/password`)
        .send({
          oldPassword: 'password123',
          newPassword: 'wordpass456', 
          newPasswordConfirmation: 'wordpass456'
        });

      expect(res.status).toBe(200);
    });

    it('should raise error when oldPassoword is wrong', async () => {
      const userId = (await createUser(
        testEmail(),
        'password123',
        'password123'
      )).body.user.id;

      const res = await request(app)
        .put(`/userbase/${userId}/password`)
        .send({
          oldPassword: 'wrong_oldPassword123',
          newPassword: 'wordpass456', 
          newPasswordConfirmation: 'wordpass456'
        });

      expect(res.status).toBe(403);
    });

    it('should raise error when passwordConfirmation is wrong', async () => {
      const userId = (await createUser(
        testEmail(),
        'password123',
        'password123'
      )).body.user.id;

      const res = await request(app)
        .put(`/userbase/${userId}/password`)
        .send({
          oldPassword: 'password123',
          newPassword: 'wordpass456', 
          newPasswordConfirmation: 'wrongPasswordConfirmation789'
        });

      expect(res.status).toBe(400);
    });
  });
});