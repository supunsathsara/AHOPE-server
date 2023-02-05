const supertest = require('supertest');
const app = require('../app');

describe('Test User Route', () => {
  test('It should response the GET method', () => {
    return supertest(app)
      .get('/user')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('code', 200);
        expect(response.body).toHaveProperty('results');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('users');
        expect(Array.isArray(response.body.data.users)).toBe(true);
      });
  });

  test('It should response the GET method with user data', () => {
    return supertest(app)
      .get('/user/2')
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('code', 200);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('user');
        expect(Array.isArray(response.body.data.user)).toBe(true);
        expect(response.body.data.user[0]).toHaveProperty('id', 2);
        expect(response.body.data.user[0]).toHaveProperty('name');
        expect(response.body.data.user[0]).toHaveProperty('email');
        expect(response.body.data.user[0]).toHaveProperty('created_at');
        expect(response.body.data.user[0]).toHaveProperty('updated_at');
      });
  });
});
