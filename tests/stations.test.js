import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /api/stations', () => {
  test('returns seeded stations as JSON', async () => {
    const response = await request(app).get('/api/stations');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('application/json');
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'nagoya',
          name: 'Nagoya Station',
          prefecture: 'Aichi',
          region: 'central',
        }),
      ])
    );
  });

  test('returns one station by ID', async () => {
    const response = await request(app).get('/api/stations/nagoya');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      id: 'nagoya',
      name: 'Nagoya Station',
      facilities: expect.arrayContaining(['restaurant', 'tourist_info']),
    });
  });

  test('returns 404 JSON for a missing station', async () => {
    const response = await request(app).get('/api/stations/unknown-station');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: 'Station not found' });
  });
});

describe('Station API documentation', () => {
  test('serves the OpenAPI document with both station endpoints', async () => {
    const response = await request(app).get('/api/openapi.json');

    expect(response.status).toBe(200);
    expect(response.body.paths).toHaveProperty('/api/stations');
    expect(response.body.paths).toHaveProperty('/api/stations/{id}');
    expect(response.body.paths['/api/stations/{id}'].get.responses).toHaveProperty('404');
  });

  test('serves the Swagger UI', async () => {
    const response = await request(app).get('/api/docs/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('text/html');
    expect(response.text).toContain('swagger-ui');
  });
});
