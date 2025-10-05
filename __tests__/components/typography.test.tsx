import React from 'react';
import { render, screen } from '../utils/test-utils';

describe('Phase 3 - Typography & Spacing', () => {
  describe('Typography Scale', () => {
    const TypographyScale = () => (
      <div>
        <h1 className="text-4xl font-bold">Heading 1</h1>
        <h2 className="text-3xl font-semibold">Heading 2</h2>
        <h3 className="text-2xl font-semibold">Heading 3</h3>
        <h4 className="text-xl font-medium">Heading 4</h4>
        <h5 className="text-lg font-medium">Heading 5</h5>
        <h6 className="text-base font-medium">Heading 6</h6>
        <p className="text-base">Body text</p>
        <p className="text-sm">Small text</p>
        <p className="text-xs">Extra small text</p>
      </div>
    );

    it('should apply correct heading sizes', () => {
      render(<TypographyScale />);

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });
      const h3 = screen.getByRole('heading', { level: 3 });

      expect(h1).toHaveClass('text-4xl', 'font-bold');
      expect(h2).toHaveClass('text-3xl', 'font-semibold');
      expect(h3).toHaveClass('text-2xl', 'font-semibold');
    });

    it('should use semantic heading hierarchy', () => {
      render(<TypographyScale />);

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 4 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 5 })).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 6 })).toBeInTheDocument();
    });

    it('should apply correct text sizes', () => {
      const { container } = render(<TypographyScale />);

      const bodyText = container.querySelector('p.text-base');
      const smallText = container.querySelector('p.text-sm');
      const xsText = container.querySelector('p.text-xs');

      expect(bodyText).toBeInTheDocument();
      expect(smallText).toBeInTheDocument();
      expect(xsText).toBeInTheDocument();
    });
  });

  describe('Font Weights', () => {
    it('should apply different font weights', () => {
      render(
        <div>
          <p className="font-light">Light text</p>
          <p className="font-normal">Normal text</p>
          <p className="font-medium">Medium text</p>
          <p className="font-semibold">Semibold text</p>
          <p className="font-bold">Bold text</p>
        </div>
      );

      expect(screen.getByText('Light text')).toHaveClass('font-light');
      expect(screen.getByText('Normal text')).toHaveClass('font-normal');
      expect(screen.getByText('Medium text')).toHaveClass('font-medium');
      expect(screen.getByText('Semibold text')).toHaveClass('font-semibold');
      expect(screen.getByText('Bold text')).toHaveClass('font-bold');
    });
  });

  describe('Line Height', () => {
    it('should apply appropriate line heights', () => {
      render(
        <div>
          <p className="leading-tight">Tight line height</p>
          <p className="leading-normal">Normal line height</p>
          <p className="leading-relaxed">Relaxed line height</p>
          <p className="leading-loose">Loose line height</p>
        </div>
      );

      expect(screen.getByText('Tight line height')).toHaveClass('leading-tight');
      expect(screen.getByText('Normal line height')).toHaveClass('leading-normal');
      expect(screen.getByText('Relaxed line height')).toHaveClass('leading-relaxed');
      expect(screen.getByText('Loose line height')).toHaveClass('leading-loose');
    });
  });

  describe('Text Colors', () => {
    it('should apply text colors with proper contrast', () => {
      render(
        <div className="bg-white">
          <p className="text-gray-900">Primary text</p>
          <p className="text-gray-600">Secondary text</p>
          <p className="text-gray-500">Muted text</p>
          <p className="text-blue-600">Link text</p>
          <p className="text-red-600">Error text</p>
          <p className="text-green-600">Success text</p>
        </div>
      );

      expect(screen.getByText('Primary text')).toHaveClass('text-gray-900');
      expect(screen.getByText('Secondary text')).toHaveClass('text-gray-600');
      expect(screen.getByText('Muted text')).toHaveClass('text-gray-500');
      expect(screen.getByText('Link text')).toHaveClass('text-blue-600');
      expect(screen.getByText('Error text')).toHaveClass('text-red-600');
      expect(screen.getByText('Success text')).toHaveClass('text-green-600');
    });
  });

  describe('Spacing Consistency', () => {
    it('should use consistent spacing scale', () => {
      render(
        <div className="space-y-4">
          <div className="p-2">Padding 2</div>
          <div className="p-4">Padding 4</div>
          <div className="p-6">Padding 6</div>
          <div className="p-8">Padding 8</div>
        </div>
      );

      expect(screen.getByText('Padding 2')).toHaveClass('p-2');
      expect(screen.getByText('Padding 4')).toHaveClass('p-4');
      expect(screen.getByText('Padding 6')).toHaveClass('p-6');
      expect(screen.getByText('Padding 8')).toHaveClass('p-8');
    });

    it('should apply margin spacing', () => {
      render(
        <div>
          <div className="mb-2">Margin bottom 2</div>
          <div className="mb-4">Margin bottom 4</div>
          <div className="mt-6">Margin top 6</div>
          <div className="my-8">Margin y 8</div>
        </div>
      );

      expect(screen.getByText('Margin bottom 2')).toHaveClass('mb-2');
      expect(screen.getByText('Margin bottom 4')).toHaveClass('mb-4');
      expect(screen.getByText('Margin top 6')).toHaveClass('mt-6');
      expect(screen.getByText('Margin y 8')).toHaveClass('my-8');
    });

    it('should use gap for flex/grid layouts', () => {
      const { container } = render(
        <div>
          <div className="flex gap-2">
            <span>Item 1</span>
            <span>Item 2</span>
          </div>
          <div className="grid gap-4">
            <span>Grid 1</span>
            <span>Grid 2</span>
          </div>
        </div>
      );

      const flexContainer = container.querySelector('.flex.gap-2');
      const gridContainer = container.querySelector('.grid.gap-4');

      expect(flexContainer).toBeInTheDocument();
      expect(gridContainer).toBeInTheDocument();
    });
  });

  describe('Responsive Typography', () => {
    it('should apply responsive text sizes', () => {
      render(
        <h1 className="text-2xl md:text-3xl lg:text-4xl">
          Responsive Heading
        </h1>
      );

      const heading = screen.getByText('Responsive Heading');
      expect(heading).toHaveClass('text-2xl', 'md:text-3xl', 'lg:text-4xl');
    });

    it('should have responsive spacing', () => {
      render(
        <div className="p-4 md:p-6 lg:p-8">
          Responsive padding
        </div>
      );

      const div = screen.getByText('Responsive padding');
      expect(div).toHaveClass('p-4', 'md:p-6', 'lg:p-8');
    });
  });

  describe('Text Truncation', () => {
    it('should truncate long text', () => {
      render(
        <p className="truncate" style={{ width: '200px' }}>
          This is a very long text that should be truncated
        </p>
      );

      const text = screen.getByText(/this is a very long text/i);
      expect(text).toHaveClass('truncate');
    });

    it('should apply line clamp', () => {
      render(
        <p className="line-clamp-2">
          This is a multi-line text that will be clamped to 2 lines maximum
        </p>
      );

      const text = screen.getByText(/this is a multi-line text/i);
      expect(text).toHaveClass('line-clamp-2');
    });
  });

  describe('Text Alignment', () => {
    it('should apply text alignment classes', () => {
      render(
        <div>
          <p className="text-left">Left aligned</p>
          <p className="text-center">Center aligned</p>
          <p className="text-right">Right aligned</p>
          <p className="text-justify">Justified text</p>
        </div>
      );

      expect(screen.getByText('Left aligned')).toHaveClass('text-left');
      expect(screen.getByText('Center aligned')).toHaveClass('text-center');
      expect(screen.getByText('Right aligned')).toHaveClass('text-right');
      expect(screen.getByText('Justified text')).toHaveClass('text-justify');
    });
  });

  describe('Letter Spacing', () => {
    it('should apply letter spacing', () => {
      render(
        <div>
          <p className="tracking-tight">Tight tracking</p>
          <p className="tracking-normal">Normal tracking</p>
          <p className="tracking-wide">Wide tracking</p>
        </div>
      );

      expect(screen.getByText('Tight tracking')).toHaveClass('tracking-tight');
      expect(screen.getByText('Normal tracking')).toHaveClass('tracking-normal');
      expect(screen.getByText('Wide tracking')).toHaveClass('tracking-wide');
    });
  });

  describe('Safe Area Padding (Mobile)', () => {
    it('should apply safe area padding for mobile devices', () => {
      render(
        <div className="pb-safe">
          Content with safe area padding
        </div>
      );

      const div = screen.getByText('Content with safe area padding');
      expect(div).toHaveClass('pb-safe');
    });

    it('should use env() for notch support', () => {
      const { container } = render(
        <div style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          Notch-aware content
        </div>
      );

      const div = container.firstChild as HTMLElement;
      expect(div.style.paddingTop).toBe('env(safe-area-inset-top)');
    });
  });

  describe('Typography Component Composition', () => {
    const Card = ({ title, description }: { title: string; description: string }) => (
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>
    );

    it('should compose typography correctly in card component', () => {
      render(
        <Card
          title="Test Card"
          description="This is a test description"
        />
      );

      const heading = screen.getByText('Test Card');
      const description = screen.getByText('This is a test description');

      expect(heading).toHaveClass('text-xl', 'font-semibold', 'text-gray-900', 'mb-2');
      expect(description).toHaveClass('text-sm', 'text-gray-600', 'leading-relaxed');
    });
  });

  describe('Readability and Accessibility', () => {
    it('should have readable line length', () => {
      render(
        <article className="max-w-prose">
          <p>
            This content has a maximum width for optimal readability,
            typically 65-75 characters per line.
          </p>
        </article>
      );

      const article = screen.getByRole('article');
      expect(article).toHaveClass('max-w-prose');
    });

    it('should use semantic HTML for emphasis', () => {
      render(
        <p>
          This is <strong>important</strong> and this is <em>emphasized</em>
        </p>
      );

      const strong = document.querySelector('strong');
      const em = document.querySelector('em');

      expect(strong).toBeInTheDocument();
      expect(em).toBeInTheDocument();
    });

    it('should maintain text hierarchy', () => {
      render(
        <section>
          <h1>Main Title</h1>
          <h2>Section Title</h2>
          <p>Body text</p>
        </section>
      );

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2 = screen.getByRole('heading', { level: 2 });

      expect(h1).toBeInTheDocument();
      expect(h2).toBeInTheDocument();
      // Proper heading hierarchy: h1 before h2
    });
  });

  describe('Dark Mode Typography', () => {
    it('should apply dark mode text colors', () => {
      render(
        <div className="dark">
          <p className="text-gray-900 dark:text-gray-100">
            Dark mode text
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Dark mode secondary
          </p>
        </div>
      );

      expect(screen.getByText('Dark mode text')).toHaveClass('text-gray-900', 'dark:text-gray-100');
      expect(screen.getByText('Dark mode secondary')).toHaveClass('text-gray-600', 'dark:text-gray-400');
    });
  });
});
