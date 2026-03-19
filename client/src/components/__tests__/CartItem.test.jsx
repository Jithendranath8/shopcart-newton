import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CartItem from '../CartItem';

const mockItem = {
  id: 1,
  name: 'Wireless Headphones',
  price: 79.99,
  quantity: 2,
};

describe('CartItem component', () => {
  it('renders the item name', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} />);
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('renders price and quantity', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} />);
    expect(screen.getByText(/79.99 × 2/)).toBeInTheDocument();
  });

  it('renders the correct subtotal', () => {
    render(<CartItem item={mockItem} onRemove={() => {}} />);
    expect(screen.getByText('$159.98')).toBeInTheDocument();
  });

  it('calls onRemove with item id when remove button is clicked', () => {
    const onRemove = vi.fn();
    render(<CartItem item={mockItem} onRemove={onRemove} />);
    fireEvent.click(screen.getByRole('button', { name: /remove wireless headphones from cart/i }));
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});
