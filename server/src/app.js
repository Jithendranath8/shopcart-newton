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
  { id: 1, name: 'Wireless Headphones', price: 79.99, originalPrice: 119.99, category: 'Electronics', stock: 50, rating: 4.5, badge: 'Hot', description: 'Premium sound with 30hr battery & ANC' },
  { id: 2, name: 'Running Shoes', price: 89.99, originalPrice: 129.99, category: 'Sports', stock: 30, rating: 4.7, badge: 'Sale', description: 'Lightweight & responsive for all terrains' },
  { id: 3, name: 'Coffee Maker', price: 49.99, originalPrice: null, category: 'Kitchen', stock: 20, rating: 4.3, badge: null, description: '12-cup programmable with brew strength control' },
  { id: 4, name: 'Yoga Mat', price: 29.99, originalPrice: null, category: 'Sports', stock: 100, rating: 4.6, badge: 'New', description: 'Non-slip 6mm thick eco-friendly mat' },
  { id: 5, name: 'Smartphone Stand', price: 19.99, originalPrice: null, category: 'Electronics', stock: 75, rating: 4.2, badge: null, description: 'Adjustable aluminium desk stand' },
  { id: 6, name: 'Mechanical Keyboard', price: 119.99, originalPrice: 159.99, category: 'Electronics', stock: 40, rating: 4.8, badge: 'Hot', description: 'TKL RGB with tactile switches' },
  { id: 7, name: 'Skincare Set', price: 59.99, originalPrice: null, category: 'Beauty', stock: 60, rating: 4.4, badge: 'New', description: 'Vitamin C serum, moisturiser & SPF 50' },
  { id: 8, name: 'Resistance Bands', price: 14.99, originalPrice: null, category: 'Sports', stock: 200, rating: 4.5, badge: null, description: 'Set of 5 levels, latex-free' },
  { id: 9, name: 'Air Fryer', price: 89.99, originalPrice: 129.99, category: 'Kitchen', stock: 15, rating: 4.7, badge: 'Sale', description: '5.5L digital with 8 presets' },
  { id: 10, name: 'Laptop Backpack', price: 44.99, originalPrice: null, category: 'Fashion', stock: 55, rating: 4.3, badge: null, description: 'Water-resistant with USB charging port' },
  { id: 11, name: 'Smartwatch', price: 149.99, originalPrice: 199.99, category: 'Electronics', stock: 25, rating: 4.6, badge: 'Sale', description: 'Heart rate, SpO2 & GPS — 7-day battery' },
  { id: 12, name: 'Perfume', price: 64.99, originalPrice: null, category: 'Beauty', stock: 40, rating: 4.5, badge: null, description: 'Long-lasting floral woody fragrance 100ml' },
  { id: 13, name: 'Blender', price: 39.99, originalPrice: 69.99, category: 'Kitchen', stock: 30, rating: 4.4, badge: 'Sale', description: '1000W with stainless steel blades' },
  { id: 14, name: 'Denim Jacket', price: 54.99, originalPrice: null, category: 'Fashion', stock: 45, rating: 4.2, badge: 'New', description: 'Classic stonewash, unisex fit' },
  { id: 15, name: 'Wireless Charger', price: 24.99, originalPrice: null, category: 'Electronics', stock: 80, rating: 4.4, badge: null, description: '15W fast charge Qi-compatible pad' },
  { id: 16, name: 'Protein Powder', price: 34.99, originalPrice: 49.99, category: 'Sports', stock: 90, rating: 4.6, badge: 'Sale', description: 'Whey isolate 2kg — 25g protein per serving' },
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
