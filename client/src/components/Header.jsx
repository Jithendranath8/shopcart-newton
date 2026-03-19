import PropTypes from 'prop-types';

function Header({ cartCount, onCartToggle }) {
  return (
    <header className="header">
      <div className="header-logo">
        <span className="logo-icon">🛍️</span>
        <h1>ShopSmart</h1>
      </div>
      <button
        className="cart-btn"
        onClick={onCartToggle}
        aria-label={`View cart with ${cartCount} items`}
        id="cart-toggle-btn"
      >
        <span className="cart-icon">🛒</span>
        <span className="cart-label">Cart</span>
        {cartCount > 0 && (
          <span className="cart-badge" aria-live="polite">
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
}

Header.propTypes = {
  cartCount: PropTypes.number.isRequired,
  onCartToggle: PropTypes.func.isRequired,
};

export default Header;
