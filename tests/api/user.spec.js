const { test, expect, request } = require('@playwright/test');
import path from 'path';
import fs from 'fs';

let apiContext;

let newName = 'TESTER_MODIFIED';

test.beforeAll('TC_A001: sign in', async () => {
  apiContext = await request.newContext();
  const signinResponse = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`,
    {
      form: {
        email: process.env.NEXT_PUBLIC_USER,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      },
      maxRedirects: 0,
    }
  );
  expect(signinResponse._initializer).toHaveProperty('status', 301);
});

test('TC_A101: get user information', async () => {
  const response = await apiContext.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
  expect(responseBody.name).toBe(newName);
  expect(responseBody.email).toBe(process.env.NEXT_PUBLIC_USER);
  expect(responseBody).toHaveProperty('image');
});

test('TC_A102: edit user information', async () => {
  const file = path.resolve('./tests/picture', 'Wendy.jpg');
  const image = fs.readFileSync(file);
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user`,
    {
      headers: {
        ContentType: 'multipart/form-data',
      },
      multipart: {
        name: newName,
        picture: fs.createReadStream('./tests/picture/Wendy.jpg'),
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
  expect(responseBody.name).toBe(newName);
  expect(responseBody.email).toBe(process.env.NEXT_PUBLIC_USER);
  expect(responseBody).toHaveProperty('image');
  expect(responseBody).toHaveProperty('userId');
  expect(responseBody).toHaveProperty('aboutMe');
});
