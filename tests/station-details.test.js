import { describe, expect, test } from 'vitest';
import request from 'supertest';
import app from '../app.js';

describe('GET /trips/:tripId station details', () => {
  test('renders controls for both stations and the details dialog', async () => {
    const response = await request(app).get('/trips/alpine-panorama');

    expect(response.status).toBe(200);
    expect(response.text).toContain('data-station-id="nagoya"');
    expect(response.text).toContain('data-station-id="toyama"');
    expect(response.text).toContain('id="station-details-dialog"');
    expect(response.text).toContain('/js/station-details.js');
  });
});
