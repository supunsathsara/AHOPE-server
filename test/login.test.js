const supertest = require('supertest');
require('dotenv').config();
const app = require('../app');

describe('Test login', () => {
  test('It should response the POST method', () => {
    const email = process.env.TEST_LOGIN_EMAIL;
    const password = process.env.TEST_LOGIN_PASSWORD;
    return supertest(app)
      .post('/user/login')
      .send({ email, password })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('status', true);
        expect(response.body).toHaveProperty('code', 200);
        expect(response.body).toHaveProperty('message', 'Login Success');
      });
  });

  test('It should respond with 401 for invalid credentials', () => {
    const email = process.env.TEST_LOGIN_EMAIL;
    const password = 'wrongpassword';
    return supertest(app)
      .post('/user/login')
      .send({ email, password })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('status', false);
        expect(response.body).toHaveProperty('code', 401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
      });
  });

  test('It should respond with Invalid Email message for invalid email', () => {
    const email = '4444@XXXX.com';
    const password = 'wrongpassword';
    return supertest(app)
      .post('/user/login')
      .send({ email, password })
      .then((response) => {
        expect(response.statusCode).toBe(401);
        expect(response.body).toHaveProperty('status', false);
        expect(response.body).toHaveProperty('code', 401);
        expect(response.body).toHaveProperty('message', 'Invalid Email');
      });
  });
});
