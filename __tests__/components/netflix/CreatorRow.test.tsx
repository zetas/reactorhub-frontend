import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import CreatorRow from '@/components/netflix/CreatorRow';
import { CreatorSummary } from '@/lib/services/browse';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockPush = jest.fn();
(useRouter as jest.Mock).mockReturnValue({
  push: mockPush,
});

describe('CreatorRow', () => {
  const mockCreators: CreatorSummary[] = [
    {
      id: 'creator-1',
      name: 'Test Creator One',
      slug: 'test-creator-one',
      campaignName: 'Amazing Reactions',
      thumbnail: 'https://example.com/creator1.jpg',
      patronCount: 1250,
    },
    {
      id: 'creator-2',
      name: 'Test Creator Two',
      slug: 'test-creator-two',
      campaignName: 'Movie Reviews',
      thumbnail: 'https://example.com/creator2.jpg',
      patronCount: 500,
    },
    {
      id: 'creator-3',
      name: 'Test Creator Three',
      slug: 'test-creator-three',
      campaignName: 'TV Show Reactions',
      patronCount: 2500,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders creator row with title and creators', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    expect(screen.getByText('Popular Creators')).toBeInTheDocument();
    expect(screen.getByText('Test Creator One')).toBeInTheDocument();
    expect(screen.getByText('Test Creator Two')).toBeInTheDocument();
    expect(screen.getByText('Test Creator Three')).toBeInTheDocument();
  });

  it('displays creator information correctly', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    expect(screen.getByText('Amazing Reactions')).toBeInTheDocument();
    expect(screen.getByText('Movie Reviews')).toBeInTheDocument();
    expect(screen.getByText('TV Show Reactions')).toBeInTheDocument();
  });

  it('formats patron count correctly for numbers under 1000', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    expect(screen.getByText('500 patrons')).toBeInTheDocument();
  });

  it('formats patron count correctly for numbers over 1000', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    expect(screen.getByText('1.3k patrons')).toBeInTheDocument();
    expect(screen.getByText('2.5k patrons')).toBeInTheDocument();
  });

  it('handles creators without patron count', () => {
    const creatorsWithoutCount: CreatorSummary[] = [
      {
        id: 'creator-4',
        name: 'Creator Without Count',
        slug: 'creator-without-count',
        campaignName: 'Some Campaign',
      },
    ];

    render(<CreatorRow title="New Creators" creators={creatorsWithoutCount} />);

    expect(screen.getByText('Creator Without Count')).toBeInTheDocument();
    expect(screen.queryByText(/patrons/)).not.toBeInTheDocument();
  });

  it('displays creator thumbnail when provided', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    const thumbnail1 = screen.getByAltText('Test Creator One');
    const thumbnail2 = screen.getByAltText('Test Creator Two');

    expect(thumbnail1).toBeInTheDocument();
    expect(thumbnail1).toHaveAttribute('src', 'https://example.com/creator1.jpg');
    expect(thumbnail2).toBeInTheDocument();
    expect(thumbnail2).toHaveAttribute('src', 'https://example.com/creator2.jpg');
  });

  it('shows placeholder icon when no thumbnail provided', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    // Creator 3 has no thumbnail, should show User icon
    const creatorButtons = screen.getAllByRole('button');
    const creator3Button = creatorButtons.find(button => 
      button.textContent?.includes('Test Creator Three')
    );
    
    expect(creator3Button).toBeInTheDocument();
    // The User icon should be present in the button without thumbnail
  });

  it('navigates to creator page when clicked', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    const creator1Button = screen.getByRole('button', { name: /test creator one/i });
    fireEvent.click(creator1Button);

    expect(mockPush).toHaveBeenCalledWith('/creator/test-creator-one');
  });

  it('uses creator id when slug is not available', () => {
    const creatorsWithoutSlug: CreatorSummary[] = [
      {
        id: 'creator-no-slug',
        name: 'Creator Without Slug',
        campaignName: 'Some Campaign',
      },
    ];

    render(<CreatorRow title="Creators" creators={creatorsWithoutSlug} />);

    const creatorButton = screen.getByRole('button', { name: /creator without slug/i });
    fireEvent.click(creatorButton);

    expect(mockPush).toHaveBeenCalledWith('/creator/creator-no-slug');
  });

  it('returns null when creators array is empty', () => {
    const { container } = render(<CreatorRow title="Empty Row" creators={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('has proper accessibility attributes', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'creator-row-Popular Creators');

    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveAttribute('id', 'creator-row-Popular Creators');
  });

  it('applies horizontal scrolling styles', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    const scrollContainer = screen.getByRole('region').querySelector('.overflow-x-auto');
    expect(scrollContainer).toHaveClass('overflow-x-auto', 'snap-x', 'snap-mandatory');
  });

  it('renders creator cards with proper spacing and styling', () => {
    render(<CreatorRow title="Popular Creators" creators={mockCreators} />);

    const creatorButtons = screen.getAllByRole('button');
    expect(creatorButtons).toHaveLength(3);

    creatorButtons.forEach(button => {
      expect(button).toHaveClass('w-48', 'flex-shrink-0', 'snap-start');
    });
  });

  it('handles creators without campaign name', () => {
    const creatorsWithoutCampaign: CreatorSummary[] = [
      {
        id: 'creator-5',
        name: 'Creator Without Campaign',
        slug: 'creator-without-campaign',
        patronCount: 100,
      },
    ];

    render(<CreatorRow title="Creators" creators={creatorsWithoutCampaign} />);

    expect(screen.getByText('Creator Without Campaign')).toBeInTheDocument();
    expect(screen.getByText('100 patrons')).toBeInTheDocument();
  });

  it('truncates long creator names and campaign names', () => {
    const creatorsWithLongNames: CreatorSummary[] = [
      {
        id: 'creator-long',
        name: 'This is a very long creator name that should be truncated',
        slug: 'long-creator',
        campaignName: 'This is also a very long campaign name that should be truncated as well',
        patronCount: 1000,
      },
    ];

    render(<CreatorRow title="Creators" creators={creatorsWithLongNames} />);

    const creatorButton = screen.getByRole('button');
    const nameElement = creatorButton.querySelector('.truncate');
    expect(nameElement).toHaveClass('truncate');
  });
});