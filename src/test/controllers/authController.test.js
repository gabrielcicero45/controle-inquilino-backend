const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const server = require('../../server');
const mongoose = require('mongoose');
const connectDB = require('../../config/database');

let user;

beforeAll(async () => {
  await connectDB();
  const hashedPassword = await bcrypt.hash('senha123', 10);

  user = await User.create({
    name: 'joao',
    email: 'joao@test.com',
    password: hashedPassword,
  });

});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
  server.close();
});

describe('Authorization flow', () => {

  it('returns status 200 and an auth token if the login is correct', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'joao@test.com',
        password: 'senha123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    const decodedToken = jwt.verify(response.body.token, process.env.JWT_SECRET);
    expect(decodedToken.userId).toBe(user._id.toString());
  });

  it('returns status 400 if the user does not exist', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'inexistent@test.com',
        password: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
  });

  it('returns status 400 if the password is incorrect', async () => {
    const response = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'joao@test.com',
        password: 'senhaErrada',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Senha incorreta');
  });

  it('returns status 201 and a token when registration is successful', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Maria',
        email: 'maria@test.com',
        password: 'senha123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('message', 'Usuário registrado com sucesso!');

    const decodedToken = jwt.verify(response.body.token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: 'maria@test.com' });
    expect(decodedToken.id).toBe(user._id.toString());
  });

  it('returns status 400 if a required field is missing', async () => {
    const response = await request(server)
      .post('/api/auth/register')
      .send({
        email: 'maria@test.com',
        password: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Todos os campos são obrigatórios.');
  });

  it('returns status 400 if the email is already registered', async () => {
    await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Maria',
        email: 'maria@test.com',
        password: 'senha123',
      });

    const response = await request(server)
      .post('/api/auth/register')
      .send({
        name: 'Maria',
        email: 'maria@test.com',
        password: 'senha123',
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('message', 'Email já registrado.');
  });

  it('returns the user data if the user is found', async () => {
    const userLoggedResponse = await request(server)
      .post('/api/auth/login')
      .send({
        email: 'joao@test.com',
        password: 'senha123',
      });

    const response = await request(server)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userLoggedResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('name', 'joao');
    expect(response.body).toHaveProperty('email', 'joao@test.com');
    expect(response.body).not.toHaveProperty('password');
  });

});