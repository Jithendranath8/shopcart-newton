import PropTypes from 'prop-types';

const CATEGORY_EMOJI = {
  Electronics: '💻',
  Sports: '⚽',
  Kitchen: '🍳',
  Beauty: '✨',
  Fashion: '👗',
};

const BADGE_COLOR = {
  Hot: { bg: '#ef4444', text: '#fff' },
  Sale: { bg: '#f59e0b', text: '#000' },
  New: { bg: '#10b981', text: '#fff' },
};

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="star-rating" aria-label={`Rating: ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < full ? 'star filled' : i === full && half ? 'star half' : 'star'}>
          ★
        </span>
      ))}
      <span className="rating-num">{rating}</span>
    </div>
  );
}

StarRating.propTypes = { rating: PropTypes.number.isRequired };

function ProductCard({ product, onAddToCart }) {
  const badgeStyle = product.badge ? BADGE_COLOR[product.badge] : null;
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card" id={`product-${product.id}`}>
      {/* Badge */}
      {product.badge && (
        <span
          className="product-badge"
          style={{ background: badgeStyle.bg, color: badgeStyle.text }}
        >
          {product.badge}
        </span>
      )}

      {/* Emoji icon */}
      <div className="product-emoji">{CATEGORY_EMOJI[product.category] || '📦'}</div>

      <div className="product-category">{product.category}</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-desc">{product.description}</p>

      <StarRating rating={product.rating} />

      {/* Price row */}
      <div className="product-price-row">
        <span className="product-price">${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <>
            <span className="product-original-price">${product.originalPrice.toFixed(2)}</span>
            <span className="product-discount">-{discount}%</span>
          </>
        )}
      </div>

      <p className="product-stock">
        {product.stock > 10
          ? '✓ In stock'
          : product.stock > 0
            ? `⚠ Only ${product.stock} left`
            : '✗ Out of stock'}
      </p>

      <button
        className="add-to-cart-btn"
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
        id={`add-to-cart-${product.id}`}
        aria-label={`Add ${product.name} to cart`}
      >
        {product.stock > 0 ? '🛒 Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    originalPrice: PropTypes.number,
    category: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
    rating: PropTypes.number.isRequired,
    badge: PropTypes.string,
    description: PropTypes.string.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
