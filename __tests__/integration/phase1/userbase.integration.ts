//__tests__/integration/userbase.integration.test.ts
import request from 'supertest';
import app from '../../../src/app';
import { Response } from 'supertest';
import supabase from '../../../src/config/supabase';

/**
 * Integration: UserBase service + repository layer.
 * Note: Input validation testing deferred until Zod implementation.
 */

/* TO DO:
 * - User creation:
 *  - Creates user when data is okay
 *  - Doesn't create user when data is not okay
 * - User update:
 *  - Changes password when data is correct
 *  - Doesn't change password when data is incorrect
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
  return await request(app)
    .post('/userbase/register')
    .send({ email, password, passwordConfirmation });
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
  it('should create user with valid data', async () => {
    const email = testEmail();
    const res = await createUser(email);

    expect(res.status).toBe(200);
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

    expect(res.status).toBe(400);
  });
});