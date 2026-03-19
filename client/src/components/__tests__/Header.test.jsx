import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../Header';

describe('Header component', () => {
  it('renders the ShopSmart title', () => {
    render(<Header cartCount={0} onCartToggle={() => {}} />);
    expect(screen.getByText(/ShopSmart/i)).toBeInTheDocument();
  });

  it('renders cart button', () => {
    render(<Header cartCount={0} onCartToggle={() => {}} />);
    expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
  });

  it('does not show badge when cart count is 0', () => {
    render(<Header cartCount={0} onCartToggle={() => {}} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('shows badge with correct count when cart has items', () => {
    render(<Header cartCount={3} onCartToggle={() => {}} />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('calls onCartToggle when cart button is clicked', () => {
    const onToggle = vi.fn();
    render(<Header cartCount={0} onCartToggle={onToggle} />);
    fireEvent.click(screen.getByRole('button', { name: /cart/i }));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
