import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ProductCard from '../ProductCard';

const mockProduct = {
  id: 1,
  name: 'Wireless Headphones',
  price: 79.99,
  category: 'Electronics',
  stock: 50,
};

describe('ProductCard component', () => {
  it('renders the product name', () => {
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);
    expect(screen.getByText('Wireless Headphones')).toBeInTheDocument();
  });

  it('renders the product price formatted with $', () => {
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);
    expect(screen.getByText('$79.99')).toBeInTheDocument();
  });

  it('renders the product category', () => {
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('renders Add to Cart button when stock > 0', () => {
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);
    expect(screen.getByRole('button', { name: /add wireless headphones to cart/i })).toBeEnabled();
  });

  it('renders Out of Stock button when stock is 0', () => {
    render(<ProductCard product={{ ...mockProduct, stock: 0 }} onAddToCart={() => {}} />);
    const btn = screen.getByRole('button', { name: /add wireless headphones to cart/i });
    expect(btn).toBeDisabled();
    expect(btn).toHaveTextContent('Out of Stock');
  });

  it('calls onAddToCart with product when Add to Cart is clicked', () => {
    const onAdd = vi.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAdd} />);
    fireEvent.click(screen.getByRole('button', { name: /add wireless headphones to cart/i }));
    expect(onAdd).toHaveBeenCalledWith(mockProduct);
  });
});
