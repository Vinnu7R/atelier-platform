import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

test.describe('API Routes', () => {
  test('POST /api/waitlist - validation', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/waitlist`, {
      data: {
        email: 'invalid-email',
      },
    });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Invalid email');
  });

  test('POST /api/admin/waitlist - unauthorized', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/admin/waitlist`, {
      data: {
        password: 'wrong-password',
      },
    });
    expect(response.status()).toBe(401);
  });
});
