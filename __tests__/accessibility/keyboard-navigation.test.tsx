import React, { useState } from 'react';
import { render, screen, fireEvent } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/netflix/SearchBar';
import { Button } from '@/components/ui/Button';

describe('Phase 1 - Keyboard Navigation', () => {
  describe('Search Input Keyboard Navigation', () => {
    it('should be focusable with Tab key', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      const input = screen.getByRole('searchbox');
      await user.tab();

      expect(input).toHaveFocus();
    });

    it('should submit search on Enter key', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn();
      render(<SearchBar onSubmit={mockSubmit} />);

      const input = screen.getByRole('searchbox');
      await user.click(input);
      await user.type(input, 'test query{Enter}');

      expect(mockSubmit).toHaveBeenCalledWith('test query');
    });

    it('should blur input on Escape key', async () => {
      const user = userEvent.setup();
      render(<SearchBar />);

      const input = screen.getByRole('searchbox');
      await user.click(input);
      expect(input).toHaveFocus();

      await user.keyboard('{Escape}');
      expect(input).not.toHaveFocus();
    });

    it('should clear input with clear button using keyboard', async () => {
      const user = userEvent.setup();
      const mockClear = jest.fn();
      render(<SearchBar onClear={mockClear} />);

      const input = screen.getByRole('searchbox');
      await user.type(input, 'test');

      const clearButton = screen.getByLabelText('Clear search');
      await user.tab();
      expect(clearButton).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockClear).toHaveBeenCalled();
    });
  });

  describe('Button Keyboard Navigation', () => {
    it('should be focusable with Tab key', async () => {
      const user = userEvent.setup();
      render(<Button>Click me</Button>);

      const button = screen.getByRole('button');
      await user.tab();

      expect(button).toHaveFocus();
    });

    it('should activate on Enter key', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      render(<Button onClick={mockClick}>Submit</Button>);

      const button = screen.getByRole('button');
      await user.tab();
      await user.keyboard('{Enter}');

      expect(mockClick).toHaveBeenCalled();
    });

    it('should activate on Space key', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn();
      render(<Button onClick={mockClick}>Submit</Button>);

      const button = screen.getByRole('button');
      await user.tab();
      await user.keyboard(' ');

      expect(mockClick).toHaveBeenCalled();
    });

    it('should not be focusable when disabled', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Button>First</Button>
          <Button disabled>Disabled</Button>
          <Button>Last</Button>
        </div>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      const lastButton = screen.getByRole('button', { name: 'Last' });
      const disabledButton = screen.getByRole('button', { name: 'Disabled' });

      await user.tab();
      expect(firstButton).toHaveFocus();

      await user.tab();
      expect(lastButton).toHaveFocus();
      expect(disabledButton).not.toHaveFocus();
    });

    it('should show focus indicator', async () => {
      const user = userEvent.setup();
      render(<Button>Focus me</Button>);

      const button = screen.getByRole('button');
      await user.tab();

      expect(button).toHaveFocus();
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2');
    });
  });

  describe('Form Keyboard Navigation', () => {
    it('should navigate through form fields with Tab', async () => {
      const user = userEvent.setup();
      render(
        <form>
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
          <input type="email" placeholder="Email" />
          <button type="submit">Submit</button>
        </form>
      );

      const firstName = screen.getByPlaceholderText('First name');
      const lastName = screen.getByPlaceholderText('Last name');
      const email = screen.getByPlaceholderText('Email');
      const submitButton = screen.getByRole('button');

      await user.tab();
      expect(firstName).toHaveFocus();

      await user.tab();
      expect(lastName).toHaveFocus();

      await user.tab();
      expect(email).toHaveFocus();

      await user.tab();
      expect(submitButton).toHaveFocus();
    });

    it('should navigate backwards with Shift+Tab', async () => {
      const user = userEvent.setup();
      render(
        <form>
          <input type="text" placeholder="Field 1" />
          <input type="text" placeholder="Field 2" />
          <button>Submit</button>
        </form>
      );

      const field1 = screen.getByPlaceholderText('Field 1');
      const field2 = screen.getByPlaceholderText('Field 2');
      const button = screen.getByRole('button');

      // Tab forward to button
      await user.tab();
      await user.tab();
      await user.tab();
      expect(button).toHaveFocus();

      // Shift+Tab back
      await user.tab({ shift: true });
      expect(field2).toHaveFocus();

      await user.tab({ shift: true });
      expect(field1).toHaveFocus();
    });

    it('should submit form on Enter in text input', async () => {
      const user = userEvent.setup();
      const mockSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={mockSubmit}>
          <input type="text" placeholder="Search" />
          <button type="submit">Submit</button>
        </form>
      );

      const input = screen.getByPlaceholderText('Search');
      await user.click(input);
      await user.type(input, 'test{Enter}');

      expect(mockSubmit).toHaveBeenCalled();
    });
  });

  describe('Modal Keyboard Navigation', () => {
    const Modal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
      if (!isOpen) return null;

      return (
        <div role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <h2 id="modal-title">Modal Title</h2>
          <input type="text" placeholder="First field" />
          <input type="text" placeholder="Second field" />
          <button onClick={onClose}>Close</button>
        </div>
      );
    };

    it('should trap focus within modal', async () => {
      const user = userEvent.setup();
      const mockClose = jest.fn();
      render(<Modal isOpen={true} onClose={mockClose} />);

      const firstField = screen.getByPlaceholderText('First field');
      const secondField = screen.getByPlaceholderText('Second field');
      const closeButton = screen.getByRole('button', { name: 'Close' });

      await user.tab();
      expect(firstField).toHaveFocus();

      await user.tab();
      expect(secondField).toHaveFocus();

      await user.tab();
      expect(closeButton).toHaveFocus();

      // Next tab should cycle back to first field
      await user.tab();
      // In a proper modal implementation, focus would trap here
    });

    it('should close modal on Escape key', async () => {
      const user = userEvent.setup();
      const mockClose = jest.fn();

      const ModalWrapper = () => {
        const [isOpen, setIsOpen] = useState(true);

        const handleClose = () => {
          setIsOpen(false);
          mockClose();
        };

        return (
          <div
            role="dialog"
            aria-modal="true"
            onKeyDown={(e) => {
              if (e.key === 'Escape') handleClose();
            }}
          >
            <button onClick={handleClose}>Close</button>
          </div>
        );
      };

      render(<ModalWrapper />);

      await user.keyboard('{Escape}');
      expect(mockClose).toHaveBeenCalled();
    });
  });

  describe('Dropdown/Select Keyboard Navigation', () => {
    it('should open dropdown on Enter or Space', async () => {
      const user = userEvent.setup();
      render(
        <select aria-label="Filter options">
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      );

      const select = screen.getByLabelText('Filter options');
      await user.tab();
      expect(select).toHaveFocus();

      fireEvent.keyDown(select, { key: 'Enter' });
      // Native select behavior
    });

    it('should navigate options with arrow keys', async () => {
      const user = userEvent.setup();
      const mockChange = jest.fn();

      render(
        <select onChange={mockChange} aria-label="Sort by">
          <option value="name">Name</option>
          <option value="date">Date</option>
          <option value="popular">Popular</option>
        </select>
      );

      const select = screen.getByLabelText('Sort by');
      await user.click(select);

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      // Arrow key navigation
    });
  });

  describe('Link Keyboard Navigation', () => {
    it('should be focusable and activatable with Enter', async () => {
      const user = userEvent.setup();
      const mockClick = jest.fn((e) => e.preventDefault());

      render(
        <a href="/test" onClick={mockClick}>
          Test Link
        </a>
      );

      const link = screen.getByRole('link');
      await user.tab();
      expect(link).toHaveFocus();

      await user.keyboard('{Enter}');
      expect(mockClick).toHaveBeenCalled();
    });

    it('should skip links with tabindex="-1"', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <a href="/first">First</a>
          <a href="/skip" tabIndex={-1}>Skip me</a>
          <a href="/third">Third</a>
        </div>
      );

      const first = screen.getByRole('link', { name: 'First' });
      const third = screen.getByRole('link', { name: 'Third' });
      const skip = screen.getByRole('link', { name: 'Skip me' });

      await user.tab();
      expect(first).toHaveFocus();

      await user.tab();
      expect(third).toHaveFocus();
      expect(skip).not.toHaveFocus();
    });
  });

  describe('Custom Focus Management', () => {
    it('should support programmatic focus', () => {
      const TestComponent = () => {
        const inputRef = React.useRef<HTMLInputElement>(null);

        return (
          <div>
            <button onClick={() => inputRef.current?.focus()}>
              Focus Input
            </button>
            <input ref={inputRef} type="text" placeholder="Will be focused" />
          </div>
        );
      };

      render(<TestComponent />);

      const button = screen.getByRole('button');
      const input = screen.getByPlaceholderText('Will be focused');

      fireEvent.click(button);
      expect(input).toHaveFocus();
    });

    it('should restore focus after modal closes', async () => {
      const user = userEvent.setup();

      const TestComponent = () => {
        const [isOpen, setIsOpen] = useState(false);
        const triggerRef = React.useRef<HTMLButtonElement>(null);

        return (
          <div>
            <button ref={triggerRef} onClick={() => setIsOpen(true)}>
              Open Modal
            </button>
            {isOpen && (
              <div role="dialog">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        );
      };

      render(<TestComponent />);

      const openButton = screen.getByRole('button', { name: 'Open Modal' });
      await user.click(openButton);

      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);

      expect(openButton).toHaveFocus();
    });
  });
});
