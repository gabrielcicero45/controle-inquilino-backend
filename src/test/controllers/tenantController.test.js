const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const server = require('../../server');
const mongoose = require('mongoose');
const connectDB = require('../../config/database');
const Tenant = require('../../models/Tenant');


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
describe('Tenant Controller Flow', () => {

  it('should create a new tenant', async () => {
    const tenantData = {
      name: 'João Silva',
      cpf: '92345678902',
      kitnetSize: 'médio',
      isDelinquent: false,
      delinquencyTime: 0,
      rentAmount: 1200,
    };

    const userLoggedResponse = await request(server)
    .post('/api/auth/login')
    .send({
      email: 'joao@test.com',
      password: 'senha123',
    });

    const response = await request(server)
    .post('/api/tenants/')
    .set('Authorization', `Bearer ${userLoggedResponse.body.token}`)
    .send(tenantData);
    
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(tenantData.name);

  });

  it('should edit a tenant', async () => {

    const updatedTenantData = {
      name: 'João Silva atualizado',
      cpf: '12345678923',
      kitnetSize: 'médio',
      isDelinquent: false,
      delinquencyTime: 0,
      rentAmount: 1200,
    };

    const userLoggedResponse = await request(server)
    .post('/api/auth/login')
    .send({
      email: 'joao@test.com',
      password: 'senha123',
    });

    const firstDocument = await Tenant.findOne();

    const tenantId = firstDocument._id;

    const response = await request(server)
      .put(`/api/tenants/${tenantId}`) 
      .set('Authorization', `Bearer ${userLoggedResponse.body.token}`)
      .send(updatedTenantData);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedTenantData.name);
    expect(response.body.kitnetSize).toBe(updatedTenantData.kitnetSize);
  });
});
