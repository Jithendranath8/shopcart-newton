const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'ShopSmart Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Products Route - returns in-memory product list
const products = [
  { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'Electronics', stock: 50 },
  { id: 2, name: 'Running Shoes', price: 129.99, category: 'Sports', stock: 30 },
  { id: 3, name: 'Coffee Maker', price: 49.99, category: 'Kitchen', stock: 20 },
  { id: 4, name: 'Yoga Mat', price: 29.99, category: 'Sports', stock: 100 },
  { id: 5, name: 'Smartphone Stand', price: 19.99, category: 'Electronics', stock: 75 },
];

app.get('/api/products', (req, res) => {
  res.json({ products, total: products.length });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((p) => p.id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  return res.json(product);
});

// Cart operations (in-memory for demo)
const cart = {};

app.get('/api/cart', (req, res) => {
  const items = Object.values(cart);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  res.json({ items, total: Math.round(total * 100) / 100 });
});

app.post('/api/cart', (req, res) => {
  const { productId, quantity = 1 } = req.body;
  if (!productId) {
    return res.status(400).json({ error: 'productId is required' });
  }
  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  if (cart[productId]) {
    cart[productId].quantity += quantity;
  } else {
    cart[productId] = { ...product, quantity };
  }
  return res.status(201).json(cart[productId]);
});

app.delete('/api/cart/:productId', (req, res) => {
  const { productId } = req.params;
  if (!cart[productId]) {
    return res.status(404).json({ error: 'Item not in cart' });
  }
  delete cart[productId];
  res.json({ message: 'Item removed from cart' });
});

// Root Route
app.get('/', (req, res) => {
  res.send('ShopSmart Backend Service');
});

module.exports = app;
