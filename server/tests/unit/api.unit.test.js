const request = require('supertest');
const app = require('../../src/app');

describe('Unit: GET /api/health', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
  });

  it('should return JSON with status "ok"', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('should return a message field', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('message');
    expect(typeof res.body.message).toBe('string');
  });

  it('should return a valid ISO timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.body).toHaveProperty('timestamp');
    expect(() => new Date(res.body.timestamp).toISOString()).not.toThrow();
  });
});

describe('Unit: GET /api/products', () => {
  it('should return status 200', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
  });

  it('should return an array of products', async () => {
    const res = await request(app).get('/api/products');
    expect(Array.isArray(res.body.products)).toBe(true);
    expect(res.body.products.length).toBeGreaterThan(0);
  });

  it('each product should have id, name, price, category, stock', async () => {
    const res = await request(app).get('/api/products');
    const product = res.body.products[0];
    expect(product).toHaveProperty('id');
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price');
    expect(product).toHaveProperty('category');
    expect(product).toHaveProperty('stock');
  });
});

describe('Unit: GET /api/products/:id', () => {
  it('should return a single product by id', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('should return 404 for a non-existent product', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
