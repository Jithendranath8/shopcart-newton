const request = require('supertest');
const app = require('../../src/app');

describe('Integration: Cart API', () => {
  it('GET /api/cart should return empty cart initially', async () => {
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(typeof res.body.total).toBe('number');
  });

  it('POST /api/cart should add a product to the cart', async () => {
    const res = await request(app)
      .post('/api/cart')
      .send({ productId: 1, quantity: 2 });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id', 1);
    expect(res.body).toHaveProperty('quantity', 2);
  });

  it('POST /api/cart should return 400 when productId is missing', async () => {
    const res = await request(app)
      .post('/api/cart')
      .send({ quantity: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /api/cart should return 404 for non-existent product', async () => {
    const res = await request(app)
      .post('/api/cart')
      .send({ productId: 9999 });
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('DELETE /api/cart/:productId should remove item from cart', async () => {
    // First add the item
    await request(app).post('/api/cart').send({ productId: 3, quantity: 1 });
    // Then remove it
    const res = await request(app).delete('/api/cart/3');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  it('DELETE /api/cart/:productId should return 404 if item not in cart', async () => {
    const res = await request(app).delete('/api/cart/9999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  it('Full flow: add to cart → GET cart → verify total', async () => {
    await request(app).post('/api/cart').send({ productId: 5, quantity: 1 });
    const res = await request(app).get('/api/cart');
    expect(res.statusCode).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.total).toBeGreaterThan(0);
  });
});
