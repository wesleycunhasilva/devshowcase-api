import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';

import { app } from './server';

test('POST /api/profiles cria um perfil com dados válidos', async () => {
  const response = await request(app)
    .post('/api/profiles')
    .send({
      name: 'Ana Souza',
      email: 'ana.souza@example.com',
      bio: 'Desenvolvedora full-stack',
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.name, 'Ana Souza');
  assert.equal(response.body.email, 'ana.souza@example.com');
});

test('GET /api/profiles/:id retorna o perfil buscado', async () => {
  const created = await request(app)
    .post('/api/profiles')
    .send({
      name: 'Bruno',
      email: 'bruno@example.com',
      bio: 'Backend engineer',
    });

  const response = await request(app).get(`/api/profiles/${created.body.id}`);

  assert.equal(response.status, 200);
  assert.equal(response.body.id, created.body.id);
  assert.equal(response.body.name, 'Bruno');
});

test('POST /api/technologies valida nome obrigatório', async () => {
  const response = await request(app)
    .post('/api/technologies')
    .send({ name: '   ' });

  assert.equal(response.status, 400);
  assert.ok(response.body.message);
});

test('POST /api/projects cria projeto com tecnologias', async () => {
  const profile = await request(app)
    .post('/api/profiles')
    .send({
      name: 'Carla',
      email: 'carla@example.com',
      bio: 'DevOps',
    });

  const response = await request(app)
    .post('/api/projects')
    .send({
      title: 'Portfólio',
      description: 'Sistema de portfólio pessoal',
      repositoryUrl: 'https://github.com/example/portfolio',
      profileId: profile.body.id,
      technologies: ['Node.js', 'Prisma'],
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.title, 'Portfólio');
  assert.equal(response.body.profileId, profile.body.id);
  assert.ok(response.body.technologies.length >= 2);
});
