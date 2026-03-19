import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

describe('App component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn((url) => {
      if (url.includes('/api/health')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({ status: 'ok', message: 'Running', timestamp: new Date().toISOString() }),
        });
      }
      if (url.includes('/api/products')) {
        return Promise.resolve({
          json: () =>
            Promise.resolve({
              products: [
                { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'Electronics', stock: 50 },
                { id: 2, name: 'Running Shoes', price: 129.99, category: 'Sports', stock: 30 },
              ],
              total: 2,
            }),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    }));
  });

  it('renders the ShopSmart header', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /ShopSmart/i, level: 1 })).toBeInTheDocument();
  });

  it('renders the cart button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /cart/i })).toBeInTheDocument();
  });

  it('shows All Products section initially', () => {
    render(<App />);
    expect(screen.getByText(/All Products/i)).toBeInTheDocument();
  });
});
