// Integration tests. They talk to the real database in DATABASE_URL and only
// delete rows whose email ends in @example.test. Use a development/test database.
process.env.NODE_ENV = 'test';

import { after, before, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

const { default: app } = await import('../src/app.js');
const { prisma } = await import('../src/lib/prisma.js');

const run = Date.now().toString(36);
const valid = {
  fullName: 'Ada Okafor',
  username: `ada_${run}`,
  email: `ada_${run}@example.test`,
  phone: '+234 801 234 5678',
  dateOfBirth: '1998-04-12',
  gender: 'female',
  password: 'Sup3rSecret',
  confirmPassword: 'Sup3rSecret',
  acceptedTerms: true,
};

const cleanup = () => prisma.user.deleteMany({ where: { email: { endsWith: '@example.test' } } });

describe('auth and profile API', () => {
  before(cleanup);
  after(async () => {
    await cleanup();
    await prisma.$disconnect();
  });

  const agent = request.agent(app);

  it('registers a user, hides the hash and sets an HttpOnly cookie', async () => {
    const res = await agent.post('/api/auth/register').send(valid);
    assert.equal(res.status, 201);
    assert.equal(res.body.user.email, valid.email);
    assert.equal(res.body.user.passwordHash, undefined);
    assert.equal(res.body.user.password_hash, undefined);
    assert.match(res.headers['set-cookie'][0], /HttpOnly/i);
  });

  it('stores a bcrypt hash, not the password', async () => {
    const row = await prisma.user.findUnique({ where: { email: valid.email } });
    assert.notEqual(row.passwordHash, valid.password);
    assert.match(row.passwordHash, /^\$2[aby]\$/);
  });

  it('rejects missing required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({});
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.fullName && res.body.errors.email && res.body.errors.password);
  });

  it('rejects an invalid email', async () => {
    const res = await request(app).post('/api/auth/register').send({ ...valid, email: 'nope' });
    assert.equal(res.status, 400);
    assert.ok(res.body.errors.email);
  });

  it('rejects mismatched passwords', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...valid, confirmPassword: 'Different1' });
    assert.equal(res.status, 400);
    assert.equal(res.body.errors.confirmPassword, 'Passwords do not match');
  });

  it('rejects a duplicate email or username', async () => {
    const res = await request(app).post('/api/auth/register').send(valid);
    assert.equal(res.status, 409);
    assert.ok(res.body.errors.email);
    assert.ok(res.body.errors.username);
  });

  it('returns the profile after a refresh (cookie still valid)', async () => {
    const res = await agent.get('/api/users/me');
    assert.equal(res.status, 200);
    assert.equal(res.body.user.username, valid.username);
    assert.equal(res.body.user.profileCompletion, 100);
  });

  it('blocks the profile without authentication', async () => {
    const res = await request(app).get('/api/users/me');
    assert.equal(res.status, 401);
  });

  it('updates permitted fields and persists them', async () => {
    const res = await agent.patch('/api/users/me').send({ fullName: 'Ada N. Okafor', gender: null });
    assert.equal(res.status, 200);
    const again = await agent.get('/api/users/me');
    assert.equal(again.body.user.fullName, 'Ada N. Okafor');
    assert.equal(again.body.user.gender, null);
  });

  it('refuses to change email, username or id', async () => {
    const res = await agent.patch('/api/users/me').send({ email: 'x@example.test', id: 'abc' });
    assert.equal(res.status, 400);
  });

  it('logs out and then loses access', async () => {
    const out = await agent.post('/api/auth/logout');
    assert.equal(out.status, 200);
    const res = await agent.get('/api/users/me');
    assert.equal(res.status, 401);
  });

  it('rejects wrong credentials with a generic message', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ identifier: valid.email, password: 'WrongPass1' });
    assert.equal(res.status, 401);
  });

  it('logs in with email or username', async () => {
    const byEmail = await request(app)
      .post('/api/auth/login')
      .send({ identifier: valid.email, password: valid.password });
    assert.equal(byEmail.status, 200);
    const byUsername = await request(app)
      .post('/api/auth/login')
      .send({ identifier: valid.username.toUpperCase(), password: valid.password });
    assert.equal(byUsername.status, 200);
  });
});
