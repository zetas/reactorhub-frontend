import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SearchBar, { CompactSearchBar } from '@/components/netflix/SearchBar';

describe('SearchBar', () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search content...');
    expect(input).toHaveAttribute('aria-label', 'Search');
  });

  it('renders with custom placeholder', () => {
    render(<SearchBar placeholder="Search videos..." />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Search videos...');
  });

  it('displays initial value', () => {
    render(<SearchBar value="initial search" />);

    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial search');
  });

  it('calls onChange when typing', () => {
    render(<SearchBar onChange={mockOnChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });

    expect(mockOnChange).toHaveBeenCalledWith('test query');
  });

  it('calls onSubmit when form is submitted', () => {
    render(<SearchBar onSubmit={mockOnSubmit} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });

  it('calls onSubmit when Enter key is pressed', () => {
    render(<SearchBar onSubmit={mockOnSubmit} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSubmit).toHaveBeenCalledWith('test query');
  });

  it('shows clear button when there is text', () => {
    render(<SearchBar value="test" onClear={mockOnClear} />);

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('does not show clear button when text is empty', () => {
    render(<SearchBar value="" onClear={mockOnClear} />);

    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('calls onClear and clears input when clear button is clicked', () => {
    render(<SearchBar onChange={mockOnChange} onClear={mockOnClear} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test query' } });

    const clearButton = screen.getByLabelText('Clear search');
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
    expect(mockOnChange).toHaveBeenCalledWith('');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(<SearchBar size="sm" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveClass('h-8', 'text-sm');

    rerender(<SearchBar size="md" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveClass('h-10', 'text-base');

    rerender(<SearchBar size="lg" />);
    input = screen.getByRole('textbox');
    expect(input).toHaveClass('h-12', 'text-lg');
  });

  it('shows loading spinner when loading', () => {
    render(<SearchBar loading={true} value="test" />);

    const spinner = screen.getByRole('textbox').parentElement?.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('animate-spin');
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument();
  });

  it('disables input when loading', () => {
    render(<SearchBar loading={true} />);

    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
  });

  it('focuses input when autoFocus is true', () => {
    render(<SearchBar autoFocus={true} />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveFocus();
  });

  it('applies custom className', () => {
    render(<SearchBar className="custom-search" />);

    const form = screen.getByRole('textbox').closest('form');
    expect(form).toHaveClass('custom-search');
  });

  it('handles focus and blur events', () => {
    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    const container = input.parentElement;

    fireEvent.focus(input);
    expect(container).toHaveClass('border-white/50', 'bg-gray-800');

    fireEvent.blur(input);
    expect(container).not.toHaveClass('border-white/50', 'bg-gray-800');
  });

  it('blurs input when Escape key is pressed', () => {
    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    act(() => {
      input.focus();
    });
    expect(input).toHaveFocus();

    fireEvent.keyDown(input, { key: 'Escape' });
    expect(input).not.toHaveFocus();
  });

  it('updates internal value when value prop changes', () => {
    const { rerender } = render(<SearchBar value="initial" />);
    
    let input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('initial');

    rerender(<SearchBar value="updated" />);
    expect(input.value).toBe('updated');
  });
});

describe('CompactSearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders collapsed by default', () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />);

    expect(screen.getByLabelText('Open search')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('expands when search button is clicked', async () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />);

    const openButton = screen.getByLabelText('Open search');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  it('collapses when close button is clicked', async () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />);

    // Expand first
    const openButton = screen.getByLabelText('Open search');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Then collapse
    const closeButton = screen.getByLabelText('Close search');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  it('calls onSearch when form is submitted with query', async () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />);

    // Expand
    const openButton = screen.getByLabelText('Open search');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Type and submit
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('does not call onSearch when submitting empty query', async () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />);

    // Expand
    const openButton = screen.getByLabelText('Open search');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Submit without typing
    const input = screen.getByRole('textbox');
    fireEvent.submit(input.closest('form')!);

    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('collapses after successful search', async () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />);

    // Expand
    const openButton = screen.getByLabelText('Open search');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Search
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.submit(input.closest('form')!);

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  it('collapses when input loses focus with empty query', async () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />);

    // Expand
    const openButton = screen.getByLabelText('Open search');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Blur without typing
    const input = screen.getByRole('textbox');
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  it('does not collapse when input loses focus with query', async () => {
    render(<CompactSearchBar onSearch={mockOnSearch} />);

    // Expand
    const openButton = screen.getByLabelText('Open search');
    fireEvent.click(openButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    // Type and blur
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.blur(input);

    // Should still be expanded
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('uses custom placeholder', async () => {
    render(<CompactSearchBar onSearch={mockOnSearch} placeholder="Find videos..." />);

    // Expand
    const openButton = screen.getByLabelText('Open search');
    fireEvent.click(openButton);

    await waitFor(() => {
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Find videos...');
    });
  });
});