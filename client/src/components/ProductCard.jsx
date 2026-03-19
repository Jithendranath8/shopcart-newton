import PropTypes from 'prop-types';

function ProductCard({ product, onAddToCart }) {
  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-category">{product.category}</div>
      <div className="product-emoji">{getCategoryEmoji(product.category)}</div>
      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">${product.price.toFixed(2)}</p>
      <p className="product-stock">
        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
      </p>
      <button
        className="add-to-cart-btn"
        onClick={() => onAddToCart(product)}
        disabled={product.stock === 0}
        id={`add-to-cart-${product.id}`}
        aria-label={`Add ${product.name} to cart`}
      >
        {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}

function getCategoryEmoji(category) {
  const map = {
    Electronics: '💻',
    Sports: '⚽',
    Kitchen: '🍳',
  };
  return map[category] || '📦';
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    category: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired,
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
};

export default ProductCard;
