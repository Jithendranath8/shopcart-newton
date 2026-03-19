import { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartItem from './components/CartItem';

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [backendStatus, setBackendStatus] = useState(null);
  const [notification, setNotification] = useState(null);

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

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app">
      <Header
        cartCount={cartCount}
        onCartToggle={() => setShowCart((s) => !s)}
      />

      {notification && (
        <div className="notification" role="alert" id="notification-banner">
          {notification}
        </div>
      )}

      <main className="main">
        {/* Status Banner */}
        <div className={`status-banner ${backendStatus === 'ok' ? 'status-ok' : 'status-error'}`}>
          <span className="status-dot" />
          Backend: {backendStatus === 'ok' ? 'Connected' : backendStatus === 'error' ? 'Offline' : 'Connecting...'}
        </div>

        {showCart ? (
          /* Cart View */
          <section className="cart-section" id="cart-section" aria-label="Shopping Cart">
            <h2>Your Cart {cartCount > 0 && `(${cartCount} items)`}</h2>
            {cart.length === 0 ? (
              <div className="empty-cart">
                <p>🛒 Your cart is empty</p>
                <button className="continue-btn" onClick={() => setShowCart(false)} id="continue-shopping-btn">
                  Continue Shopping
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
                  <div className="cart-total">
                    <span>Total:</span>
                    <span id="cart-total-price">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button className="checkout-btn" id="checkout-btn">
                    Proceed to Checkout
                  </button>
                  <button className="continue-btn" onClick={() => setShowCart(false)}>
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </section>
        ) : (
          /* Products View */
          <section className="products-section" id="products-section" aria-label="Products">
            <h2>Featured Products</h2>
            {loading ? (
              <div className="loading-grid">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="product-card skeleton" />
                ))}
              </div>
            ) : (
              <div className="products-grid" id="products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
