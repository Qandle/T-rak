/** To run tests, you need to specify following variables in `.env.local`:
 * NEXT_PUBLIC_BASE_URL,
 * NEXT_PUBLIC_USER,
 * NEXT_PUBLIC_PASSWORD
 * */

const { test, expect, request } = require('@playwright/test');

import fs from 'fs';

const generateRandomString = function (length = 6) {
  return Math.random().toString(20).substr(2, length) + '@example';
};

let apiContext;

// To run tests, you also need to specify following variables:
const testTierlistId = '3647cdb9-fdf6-40fd-aacd-2debd7bfb8e3';
const testTierlistRowId = 'd424a47e-6005-425b-945d-9a2a9d3cfeb2';
// please ensure that current user authorized to delete this tierlist and row:
const delTierlistId = '';
const delTierlistRowId = '';

test.beforeAll('TC_A002: sign in', async () => {
  apiContext = await request.newContext();
  console.log(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`);
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signin`,
    {
      form: {
        email: process.env.NEXT_PUBLIC_USER,
        password: process.env.NEXT_PUBLIC_PASSWORD,
      },
      maxRedirects: 1,
    }
  );
  expect(response.status()).toBe(200);
});

test('TC_A401_1: create new tierlist (success)', async () => {
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/create`,
    {
      headers: {
        ContentType: 'multipart/form-data',
      },
      multipart: {
        description: generateRandomString(),
        name: generateRandomString(),
        rowCount: 1,
        categoryName: 'Kpop',
        coverPhoto: fs.createReadStream('./tests/picture/Wendy.jpg'),
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty('tierlistId');
  expect(responseBody).toHaveProperty('categoryId');
  expect(responseBody).toHaveProperty('userId');
  expect(responseBody).toHaveProperty('name');
  expect(responseBody).toHaveProperty('description');
  expect(responseBody).toHaveProperty('coverPhotoUrl');
});

test('TC_A401_2: create new tierlist (fail due to category missing)', async () => {
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/create`,
    {
      headers: {
        ContentType: 'multipart/form-data',
      },
      multipart: {
        description: generateRandomString(),
        name: generateRandomString(),
        rowCount: 1,
        categoryName: '',
        coverPhoto: fs.createReadStream('./tests/picture/Wendy.jpg'),
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(400);
  expect(responseBody.message).toBe('Category name is required');
});

test('TC_A401_3: create new tierlist (fail due to name missing)', async () => {
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/create`,
    {
      headers: {
        ContentType: 'multipart/form-data',
      },
      multipart: {
        description: generateRandomString(),
        name: '',
        rowCount: 1,
        categoryName: 'Kpop',
        coverPhoto: fs.createReadStream('./tests/picture/Wendy.jpg'),
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(400);
  expect(responseBody.message).toBe('Tierlist name is required');
});

test('TC_A401_4: create new tierlist (fail due to description missing)', async () => {
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/create`,
    {
      headers: {
        ContentType: 'multipart/form-data',
      },
      multipart: {
        description: '',
        name: generateRandomString(),
        rowCount: 1,
        categoryName: 'Kpop',
        coverPhoto: fs.createReadStream('./tests/picture/Wendy.jpg'),
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(400);
  expect(responseBody.message).toBe('Tierlist description is required');
});

test('TC_A401_5: create new tierlist (fail due to coverPhoto missing)', async () => {
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/create`,
    {
      headers: {
        ContentType: 'multipart/form-data',
      },
      multipart: {
        description: generateRandomString(),
        name: generateRandomString(),
        rowCount: 1,
        categoryName: 'Kpop',
        coverPhoto: '',
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(400);
  expect(responseBody.message).toBe('Tierlist cover photo is required');
});

test('TC_A402: update tierlist', async () => {
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/update`,
    {
      headers: {
        ContentType: 'multipart/form-data',
      },
      multipart: {
        tierlistId: testTierlistId,
        name: generateRandomString(),
        description: generateRandomString(),
        categoryName: 'Kpop',
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
  expect(responseBody).toHaveProperty('tierlistId');
  expect(responseBody).toHaveProperty('categoryId');
  expect(responseBody).toHaveProperty('userId');
  expect(responseBody).toHaveProperty('name');
  expect(responseBody).toHaveProperty('description');
  expect(responseBody).toHaveProperty('coverPhotoUrl');
});

test.skip('TC_A403: update row (no picture version)', async () => {
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/row-x`,
    {
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
});

test.skip('TC_A404: modify tierlist/ update all rows (no picture insert version)', async () => {
  const response = await apiContext.post(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/modify-x`,
    {
      params: {
        id: testTierlistId,
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
});

test.skip('TC_A405: show all element in row', async () => {
  const response = await apiContext.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/row`,
    {
      params: {
        id: testTierlistRowId,
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
});

test('TC_A406: show all rows and elements in tierlist', async () => {
  const response = await apiContext.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/show`,
    {
      params: {
        id: testTierlistId,
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
});

test('TC_A407: show all tierlists of user', async () => {
  const response = await apiContext.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist`,
    {
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
});

test('TC_A408: delete row', async () => {
  const response = await apiContext.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist/row`,
    {
      params: {
        id: delTierlistRowId,
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
});

test('TC_A409: delete tierlist', async () => {
  const response = await apiContext.delete(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/tierlist`,
    {
      params: {
        id: delTierlistId,
      },
      maxRedirects: 0,
    }
  );
  const responseBody = JSON.parse(await response.text());
  console.log(responseBody);
  expect(response.status()).toBe(200);
});
