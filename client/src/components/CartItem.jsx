import PropTypes from 'prop-types';

function CartItem({ item, onRemove }) {
  return (
    <div className="cart-item" id={`cart-item-${item.id}`}>
      <div className="cart-item-info">
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-price">
          ${item.price.toFixed(2)} × {item.quantity}
        </p>
      </div>
      <div className="cart-item-subtotal">
        <p>${(item.price * item.quantity).toFixed(2)}</p>
        <button
          className="remove-btn"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.name} from cart`}
          id={`remove-cart-${item.id}`}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CartItem;
