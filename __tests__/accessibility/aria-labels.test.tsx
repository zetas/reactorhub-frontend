import React from 'react';
import { render, screen } from '../utils/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import SearchBar from '@/components/netflix/SearchBar';
import { Button } from '@/components/ui/Button';

expect.extend(toHaveNoViolations);

describe('Phase 1 - ARIA Labels and Accessibility', () => {
  describe('SearchBar ARIA Labels', () => {
    it('should have proper ARIA label on search input', () => {
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-label', 'Search');
    });

    it('should have accessible label for search input', () => {
      render(<SearchBar />);
      const input = screen.getByLabelText(/search/i);
      expect(input).toBeInTheDocument();
    });

    it('should have ARIA label on clear button', () => {
      render(<SearchBar value="test query" />);
      const clearButton = screen.getByLabelText('Clear search');
      expect(clearButton).toBeInTheDocument();
      expect(clearButton).toHaveAccessibleName('Clear search');
    });

    it('should have proper role for search form', () => {
      render(<SearchBar />);
      const input = screen.getByRole('searchbox');
      expect(input.closest('form')).toHaveAttribute('role', 'search');
    });

    it('should indicate loading state to screen readers', () => {
      render(<SearchBar loading={true} value="test" />);
      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('aria-busy', 'true');
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(<SearchBar />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Button ARIA Labels', () => {
    it('should have accessible name for icon-only buttons', () => {
      render(
        <Button aria-label="Settings">
          <span className="icon">⚙</span>
        </Button>
      );
      const button = screen.getByRole('button', { name: 'Settings' });
      expect(button).toBeInTheDocument();
    });

    it('should have aria-label for icon buttons without text', () => {
      render(<Button aria-label="Close" />);
      const button = screen.getByLabelText('Close');
      expect(button).toBeInTheDocument();
    });

    it('should indicate disabled state to screen readers', () => {
      render(<Button disabled aria-label="Submit">Submit</Button>);
      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('should indicate loading state with aria-busy', () => {
      render(<Button loading aria-label="Submit">Submit</Button>);
      const button = screen.getByRole('button', { name: /submit/i });
      expect(button).toHaveAttribute('aria-busy', 'true');
    });

    it('should not have accessibility violations', async () => {
      const { container } = render(<Button>Click me</Button>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Form Controls ARIA Labels', () => {
    it('should have associated labels for all form inputs', () => {
      const { container } = render(
        <form>
          <label htmlFor="email-input">Email</label>
          <input id="email-input" type="email" />

          <label htmlFor="password-input">Password</label>
          <input id="password-input" type="password" />
        </form>
      );

      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
    });

    it('should use aria-describedby for error messages', () => {
      render(
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            aria-describedby="email-error"
            aria-invalid="true"
          />
          <span id="email-error">Please enter a valid email</span>
        </div>
      );

      const input = screen.getByLabelText('Email');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });

    it('should use aria-required for required fields', () => {
      render(
        <div>
          <label htmlFor="name">Name (required)</label>
          <input id="name" type="text" required aria-required="true" />
        </div>
      );

      const input = screen.getByLabelText(/name/i);
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toBeRequired();
    });
  });

  describe('Modal ARIA Labels', () => {
    it('should have role="dialog" on modals', () => {
      render(
        <div role="dialog" aria-labelledby="modal-title" aria-modal="true">
          <h2 id="modal-title">Confirm Action</h2>
          <p>Are you sure?</p>
          <button>Confirm</button>
        </div>
      );

      const dialog = screen.getByRole('dialog', { name: 'Confirm Action' });
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });

    it('should have aria-labelledby pointing to title', () => {
      render(
        <div role="dialog" aria-labelledby="dialog-title">
          <h2 id="dialog-title">Delete Item</h2>
          <button aria-label="Close">X</button>
        </div>
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
    });

    it('should have accessible close button', () => {
      render(
        <div role="dialog">
          <button aria-label="Close dialog">X</button>
        </div>
      );

      const closeButton = screen.getByLabelText('Close dialog');
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Navigation ARIA Labels', () => {
    it('should have aria-current on active navigation items', () => {
      render(
        <nav aria-label="Main navigation">
          <a href="/home" aria-current="page">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      );

      const nav = screen.getByRole('navigation', { name: 'Main navigation' });
      expect(nav).toBeInTheDocument();

      const homeLink = screen.getByRole('link', { name: 'Home' });
      expect(homeLink).toHaveAttribute('aria-current', 'page');
    });

    it('should have descriptive aria-label for navigation regions', () => {
      render(
        <nav aria-label="Primary navigation">
          <a href="/">Home</a>
        </nav>
      );

      const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
      expect(nav).toBeInTheDocument();
    });
  });

  describe('Image ARIA Labels', () => {
    it('should have alt text on all images', () => {
      render(
        <div>
          <img src="/avatar.jpg" alt="User profile picture" />
          <img src="/logo.png" alt="ReactorHub logo" />
        </div>
      );

      const avatar = screen.getByAltText('User profile picture');
      const logo = screen.getByAltText('ReactorHub logo');

      expect(avatar).toBeInTheDocument();
      expect(logo).toBeInTheDocument();
    });

    it('should have empty alt for decorative images', () => {
      render(<img src="/decoration.png" alt="" role="presentation" />);

      const image = screen.getByRole('presentation');
      expect(image).toHaveAttribute('alt', '');
    });
  });

  describe('Screen Reader Only Text', () => {
    it('should include screen reader only text for context', () => {
      render(
        <button>
          <span className="sr-only">Delete item: </span>
          <span>Product Name</span>
        </button>
      );

      const button = screen.getByRole('button', { name: /delete item/i });
      expect(button).toBeInTheDocument();
    });

    it('should have visually hidden labels for icon buttons', () => {
      render(
        <button>
          <span className="sr-only">Share on Twitter</span>
          <span aria-hidden="true">🐦</span>
        </button>
      );

      const button = screen.getByRole('button', { name: 'Share on Twitter' });
      expect(button).toBeInTheDocument();
    });
  });
});
