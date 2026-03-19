import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartItem from './components/CartItem';
import HeroCarousel from './components/HeroCarousel';

const ALL = 'All';
const CATEGORIES = [ALL, 'Electronics', 'Sports', 'Kitchen', 'Beauty', 'Fashion'];

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [searchQuery, setSearchQuery] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [healthRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/api/health`),
          fetch(`${apiUrl}/api/products`),
        ]);
        const health = await healthRes.json();
        const { products: productList } = await productsRes.json();
        setBackendStatus(health.status);
        setProducts(productList);
      } catch (err) {
        console.error('Failed to fetch:', err);
        setBackendStatus('error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl]);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showNotification(`✅ ${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleCategoryFilter = (cat) => {
    setActiveCategory(cat);
    setShowCart(false);
    document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredProducts = products
    .filter((p) => activeCategory === ALL || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const dealProducts = products.filter((p) => p.badge === 'Sale').slice(0, 4);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <Header cartCount={cartCount} onCartToggle={() => setShowCart((s) => !s)} />

      {notification && (
        <div className="notification" role="alert" id="notification-banner">
          {notification}
        </div>
      )}

      {!showCart ? (
        <>
          {/* Hero Carousel */}
          <HeroCarousel onCategoryFilter={handleCategoryFilter} />

          <main className="main">
            {/* Status */}
            <div className={`status-banner ${backendStatus === 'ok' ? 'status-ok' : 'status-error'}`}>
              <span className="status-dot" />
              Backend: {backendStatus === 'ok' ? 'Connected' : backendStatus === 'error' ? 'Offline' : 'Connecting...'}
            </div>

            {/* Deals Strip */}
            {!loading && dealProducts.length > 0 && (
              <section className="deals-section" aria-label="Deals of the day">
                <div className="section-header">
                  <h2>🔥 Deals of the Day</h2>
                  <span className="deal-timer">Ends soon!</span>
                </div>
                <div className="deals-strip">
                  {dealProducts.map((p) => (
                    <div key={p.id} className="deal-chip" onClick={() => handleAddToCart(p)}>
                      <span className="deal-chip-name">{p.name}</span>
                      <span className="deal-chip-price">${p.price.toFixed(2)}</span>
                      <span className="deal-chip-original">${p.originalPrice?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Category Tabs + Search */}
            <section className="products-section" id="products-section" aria-label="Products">
              <div className="filter-bar">
                <div className="category-tabs" role="tablist">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      role="tab"
                      aria-selected={activeCategory === cat}
                      className={`cat-tab ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => setActiveCategory(cat)}
                      id={`cat-tab-${cat}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <input
                  type="search"
                  className="search-input"
                  placeholder="🔍 Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search products"
                  id="search-input"
                />
              </div>

              <div className="products-header">
                <h2>
                  {activeCategory === ALL ? 'All Products' : activeCategory}
                  {!loading && <span className="product-count"> ({filteredProducts.length})</span>}
                </h2>
              </div>

              {loading ? (
                <div className="products-grid" id="products-grid">
                  {Array.from({ length: 8 }, (_, n) => (
                    <div key={n} className="product-card skeleton" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="empty-products">
                  <p>😕 No products found</p>
                  <button className="continue-btn" onClick={() => { setActiveCategory(ALL); setSearchQuery(''); }}>
                    Clear filters
                  </button>
                </div>
              ) : (
                <div className="products-grid" id="products-grid">
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              )}
            </section>

            {/* Category Showcase */}
            {!loading && activeCategory === ALL && (
              <section className="category-showcase" aria-label="Shop by category">
                <h2>Shop by Category</h2>
                <div className="category-grid">
                  {[
                    { name: 'Electronics', emoji: '💻', color: '#3b82f6' },
                    { name: 'Sports', emoji: '⚽', color: '#10b981' },
                    { name: 'Kitchen', emoji: '🍳', color: '#f59e0b' },
                    { name: 'Beauty', emoji: '✨', color: '#8b5cf6' },
                    { name: 'Fashion', emoji: '👗', color: '#ec4899' },
                  ].map((cat) => (
                    <button
                      key={cat.name}
                      className="category-card"
                      style={{ '--cat-color': cat.color }}
                      onClick={() => handleCategoryFilter(cat.name)}
                      id={`cat-card-${cat.name}`}
                    >
                      <span className="cat-emoji">{cat.emoji}</span>
                      <span className="cat-name">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </section>
            )}
          </main>
        </>
      ) : (
        /* Cart View */
        <main className="main">
          <section className="cart-section" id="cart-section" aria-label="Shopping Cart">
            <div className="cart-header">
              <h2>🛒 Your Cart {cartCount > 0 && <span className="cart-count-badge">{cartCount}</span>}</h2>
              <button className="back-btn" onClick={() => setShowCart(false)}>← Back to Shop</button>
            </div>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <div className="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <button className="continue-btn" onClick={() => setShowCart(false)} id="continue-shopping-btn">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="cart-content">
                <div className="cart-items">
                  {cart.map((item) => (
                    <CartItem key={item.id} item={item} onRemove={handleRemoveFromCart} />
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Subtotal ({cartCount} items)</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="cart-summary-row">
                    <span>Shipping</span>
                    <span className="free-shipping">FREE</span>
                  </div>
                  <div className="cart-divider" />
                  <div className="cart-total">
                    <span>Total</span>
                    <span id="cart-total-price">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="checkout-btn" id="checkout-btn">
                    Proceed to Checkout →
                  </button>
                  <button className="continue-btn" onClick={() => setShowCart(false)}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      <footer className="footer">
        <p>© 2025 ShopSmart — Built with ❤️</p>
      </footer>
    </div>
  );
}

export default App;
