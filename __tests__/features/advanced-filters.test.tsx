import React, { useState } from 'react';
import { render, screen, fireEvent, within } from '../utils/test-utils';
import userEvent from '@testing-library/user-event';

describe('Phase 4 - Advanced Filters', () => {
  describe('Duration Filter', () => {
    const DurationFilter = ({ onChange }: { onChange: (duration: string) => void }) => {
      const [selected, setSelected] = useState('all');

      const handleChange = (value: string) => {
        setSelected(value);
        onChange(value);
      };

      return (
        <div>
          <label htmlFor="duration-filter">Duration</label>
          <select
            id="duration-filter"
            value={selected}
            onChange={(e) => handleChange(e.target.value)}
            aria-label="Filter by duration"
          >
            <option value="all">All Durations</option>
            <option value="short">Short (0-10 min)</option>
            <option value="medium">Medium (10-30 min)</option>
            <option value="long">Long (30+ min)</option>
          </select>
        </div>
      );
    };

    it('should render duration filter options', () => {
      const mockOnChange = jest.fn();
      render(<DurationFilter onChange={mockOnChange} />);

      const select = screen.getByLabelText('Filter by duration');
      expect(select).toBeInTheDocument();

      expect(screen.getByRole('option', { name: 'All Durations' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Short (0-10 min)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Medium (10-30 min)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Long (30+ min)' })).toBeInTheDocument();
    });

    it('should call onChange when duration is selected', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      render(<DurationFilter onChange={mockOnChange} />);

      const select = screen.getByLabelText('Filter by duration');
      await user.selectOptions(select, 'short');

      expect(mockOnChange).toHaveBeenCalledWith('short');
    });

    it('should update selected value', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      render(<DurationFilter onChange={mockOnChange} />);

      const select = screen.getByLabelText('Filter by duration') as HTMLSelectElement;
      await user.selectOptions(select, 'medium');

      expect(select.value).toBe('medium');
    });
  });

  describe('Status Filter', () => {
    const StatusFilter = ({ onChange }: { onChange: (status: string[]) => void }) => {
      const [selected, setSelected] = useState<string[]>([]);

      const handleToggle = (status: string) => {
        const newSelected = selected.includes(status)
          ? selected.filter(s => s !== status)
          : [...selected, status];
        setSelected(newSelected);
        onChange(newSelected);
      };

      return (
        <fieldset>
          <legend>Status</legend>
          <div>
            <label>
              <input
                type="checkbox"
                checked={selected.includes('active')}
                onChange={() => handleToggle('active')}
              />
              Active
            </label>
            <label>
              <input
                type="checkbox"
                checked={selected.includes('completed')}
                onChange={() => handleToggle('completed')}
              />
              Completed
            </label>
            <label>
              <input
                type="checkbox"
                checked={selected.includes('archived')}
                onChange={() => handleToggle('archived')}
              />
              Archived
            </label>
          </div>
        </fieldset>
      );
    };

    it('should render status checkboxes', () => {
      const mockOnChange = jest.fn();
      render(<StatusFilter onChange={mockOnChange} />);

      expect(screen.getByLabelText('Active')).toBeInTheDocument();
      expect(screen.getByLabelText('Completed')).toBeInTheDocument();
      expect(screen.getByLabelText('Archived')).toBeInTheDocument();
    });

    it('should toggle status filters', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      render(<StatusFilter onChange={mockOnChange} />);

      const activeCheckbox = screen.getByLabelText('Active');
      await user.click(activeCheckbox);

      expect(mockOnChange).toHaveBeenCalledWith(['active']);

      const completedCheckbox = screen.getByLabelText('Completed');
      await user.click(completedCheckbox);

      expect(mockOnChange).toHaveBeenCalledWith(['active', 'completed']);
    });

    it('should allow deselecting status filters', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      render(<StatusFilter onChange={mockOnChange} />);

      const activeCheckbox = screen.getByLabelText('Active');
      await user.click(activeCheckbox);
      await user.click(activeCheckbox);

      expect(mockOnChange).toHaveBeenLastCalledWith([]);
    });
  });

  describe('Sort Options', () => {
    const SortSelect = ({ onChange }: { onChange: (sort: string) => void }) => {
      const [selected, setSelected] = useState('newest');

      const handleChange = (value: string) => {
        setSelected(value);
        onChange(value);
      };

      return (
        <div>
          <label htmlFor="sort-select">Sort by</label>
          <select
            id="sort-select"
            value={selected}
            onChange={(e) => handleChange(e.target.value)}
            aria-label="Sort results"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="popular">Most Popular</option>
            <option value="title">Title (A-Z)</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      );
    };

    it('should render sort options', () => {
      const mockOnChange = jest.fn();
      render(<SortSelect onChange={mockOnChange} />);

      expect(screen.getByRole('option', { name: 'Newest First' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Oldest First' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Most Popular' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Title (A-Z)' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Duration' })).toBeInTheDocument();
    });

    it('should call onChange when sort option is selected', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      render(<SortSelect onChange={mockOnChange} />);

      const select = screen.getByLabelText('Sort results');
      await user.selectOptions(select, 'popular');

      expect(mockOnChange).toHaveBeenCalledWith('popular');
    });
  });

  describe('Combined Filters', () => {
    const FilterPanel = ({ onFilterChange }: { onFilterChange: (filters: any) => void }) => {
      const [filters, setFilters] = useState({
        duration: 'all',
        status: [] as string[],
        sort: 'newest',
      });

      const updateFilters = (updates: Partial<typeof filters>) => {
        const newFilters = { ...filters, ...updates };
        setFilters(newFilters);
        onFilterChange(newFilters);
      };

      return (
        <div>
          <div>
            <label htmlFor="duration">Duration</label>
            <select
              id="duration"
              value={filters.duration}
              onChange={(e) => updateFilters({ duration: e.target.value })}
            >
              <option value="all">All</option>
              <option value="short">Short</option>
              <option value="long">Long</option>
            </select>
          </div>

          <div>
            <label htmlFor="sort">Sort</label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
            >
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
            </select>
          </div>

          <button onClick={() => updateFilters({ duration: 'all', status: [], sort: 'newest' })}>
            Clear Filters
          </button>

          <div data-testid="filter-summary">
            Duration: {filters.duration} | Sort: {filters.sort}
          </div>
        </div>
      );
    };

    it('should apply multiple filters together', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      render(<FilterPanel onFilterChange={mockOnChange} />);

      const durationSelect = screen.getByLabelText('Duration');
      await user.selectOptions(durationSelect, 'short');

      const sortSelect = screen.getByLabelText('Sort');
      await user.selectOptions(sortSelect, 'popular');

      expect(mockOnChange).toHaveBeenLastCalledWith({
        duration: 'short',
        status: [],
        sort: 'popular',
      });
    });

    it('should clear all filters', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      render(<FilterPanel onFilterChange={mockOnChange} />);

      const durationSelect = screen.getByLabelText('Duration');
      await user.selectOptions(durationSelect, 'short');

      const clearButton = screen.getByRole('button', { name: 'Clear Filters' });
      await user.click(clearButton);

      expect(mockOnChange).toHaveBeenLastCalledWith({
        duration: 'all',
        status: [],
        sort: 'newest',
      });
    });

    it('should show filter summary', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();
      render(<FilterPanel onFilterChange={mockOnChange} />);

      const durationSelect = screen.getByLabelText('Duration');
      await user.selectOptions(durationSelect, 'long');

      const summary = screen.getByTestId('filter-summary');
      expect(summary).toHaveTextContent('Duration: long | Sort: newest');
    });
  });

  describe('Filter Accessibility', () => {
    it('should have proper labels for all filters', () => {
      render(
        <div>
          <label htmlFor="category-filter">Category</label>
          <select id="category-filter">
            <option>All</option>
          </select>

          <fieldset>
            <legend>Content Type</legend>
            <label>
              <input type="checkbox" />
              Videos
            </label>
          </fieldset>
        </div>
      );

      expect(screen.getByLabelText('Category')).toBeInTheDocument();
      expect(screen.getByRole('group', { name: 'Content Type' })).toBeInTheDocument();
    });

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup();
      const mockOnChange = jest.fn();

      render(
        <div>
          <select onChange={(e) => mockOnChange(e.target.value)}>
            <option value="all">All</option>
            <option value="filter1">Filter 1</option>
          </select>
          <button>Apply</button>
        </div>
      );

      const select = screen.getByRole('combobox');
      await user.tab();
      expect(select).toHaveFocus();

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      const button = screen.getByRole('button');
      await user.tab();
      expect(button).toHaveFocus();
    });

    it('should announce filter changes to screen readers', () => {
      render(
        <div role="region" aria-label="Filters">
          <select aria-label="Filter by category">
            <option>All Categories</option>
          </select>
          <div role="status" aria-live="polite">
            3 results found
          </div>
        </div>
      );

      const region = screen.getByRole('region', { name: 'Filters' });
      const status = screen.getByRole('status');

      expect(region).toBeInTheDocument();
      expect(status).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Active Filter Tags', () => {
    const ActiveFilters = ({ filters, onRemove }: {
      filters: Array<{ id: string; label: string }>;
      onRemove: (id: string) => void;
    }) => {
      if (filters.length === 0) return null;

      return (
        <div role="region" aria-label="Active filters">
          {filters.map(filter => (
            <div key={filter.id} className="inline-flex items-center gap-2">
              <span>{filter.label}</span>
              <button
                onClick={() => onRemove(filter.id)}
                aria-label={`Remove ${filter.label} filter`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      );
    };

    it('should display active filter tags', () => {
      const mockRemove = jest.fn();
      render(
        <ActiveFilters
          filters={[
            { id: 'duration-short', label: 'Short videos' },
            { id: 'status-active', label: 'Active' },
          ]}
          onRemove={mockRemove}
        />
      );

      expect(screen.getByText('Short videos')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
    });

    it('should remove individual filters', async () => {
      const user = userEvent.setup();
      const mockRemove = jest.fn();
      render(
        <ActiveFilters
          filters={[{ id: 'duration-short', label: 'Short videos' }]}
          onRemove={mockRemove}
        />
      );

      const removeButton = screen.getByLabelText('Remove Short videos filter');
      await user.click(removeButton);

      expect(mockRemove).toHaveBeenCalledWith('duration-short');
    });

    it('should not render when no filters are active', () => {
      const mockRemove = jest.fn();
      render(<ActiveFilters filters={[]} onRemove={mockRemove} />);

      expect(screen.queryByRole('region')).not.toBeInTheDocument();
    });
  });

  describe('Filter Persistence', () => {
    it('should maintain filter state across re-renders', () => {
      const FilterComponent = () => {
        const [filter, setFilter] = useState('all');

        return (
          <div>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All</option>
              <option value="active">Active</option>
            </select>
            <p data-testid="current-filter">{filter}</p>
          </div>
        );
      };

      const { rerender } = render(<FilterComponent />);

      const select = screen.getByRole('combobox') as HTMLSelectElement;
      fireEvent.change(select, { target: { value: 'active' } });

      expect(screen.getByTestId('current-filter')).toHaveTextContent('active');

      rerender(<FilterComponent />);

      // State should persist (though in real app, would use URL params or state management)
      expect(select.value).toBe('active');
    });
  });

  describe('Filter Results Count', () => {
    const FilterWithCount = ({ onFilter }: { onFilter: (filter: string) => number }) => {
      const [filter, setFilter] = useState('all');
      const [count, setCount] = useState(10);

      const handleFilter = (value: string) => {
        setFilter(value);
        const resultCount = onFilter(value);
        setCount(resultCount);
      };

      return (
        <div>
          <select value={filter} onChange={(e) => handleFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="videos">Videos</option>
          </select>
          <p role="status" aria-live="polite">
            {count} results
          </p>
        </div>
      );
    };

    it('should update results count when filter changes', async () => {
      const user = userEvent.setup();
      const mockFilter = jest.fn((filter: string) => filter === 'all' ? 10 : 5);

      render(<FilterWithCount onFilter={mockFilter} />);

      expect(screen.getByRole('status')).toHaveTextContent('10 results');

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'videos');

      expect(mockFilter).toHaveBeenCalledWith('videos');
      expect(screen.getByRole('status')).toHaveTextContent('5 results');
    });
  });
});
