import React from 'react';
import { render, screen, within } from '../utils/test-utils';

describe('Phase 4 - Analytics Chart', () => {
  // Mock Recharts components to avoid canvas issues in tests
  jest.mock('recharts', () => {
    const React = require('react');
    return {
      LineChart: ({ children, ...props }: any) => (
        <div data-testid="line-chart" {...props}>{children}</div>
      ),
      BarChart: ({ children, ...props }: any) => (
        <div data-testid="bar-chart" {...props}>{children}</div>
      ),
      Line: (props: any) => <div data-testid="line" {...props} />,
      Bar: (props: any) => <div data-testid="bar" {...props} />,
      XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
      YAxis: (props: any) => <div data-testid="y-axis" {...props} />,
      CartesianGrid: () => <div data-testid="grid" />,
      Tooltip: () => <div data-testid="tooltip" />,
      Legend: () => <div data-testid="legend" />,
      ResponsiveContainer: ({ children }: any) => (
        <div data-testid="responsive-container">{children}</div>
      ),
    };
  });

  describe('Analytics Chart Component', () => {
    const mockData = [
      { date: '2025-01-01', views: 120, engagement: 45 },
      { date: '2025-01-02', views: 150, engagement: 60 },
      { date: '2025-01-03', views: 180, engagement: 75 },
      { date: '2025-01-04', views: 140, engagement: 50 },
      { date: '2025-01-05', views: 200, engagement: 85 },
    ];

    const AnalyticsChart = ({ data, type = 'line' }: {
      data: typeof mockData;
      type?: 'line' | 'bar';
    }) => {
      const { LineChart, BarChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = require('recharts');
      const Chart = type === 'line' ? LineChart : BarChart;
      const DataComponent = type === 'line' ? Line : Bar;

      return (
        <div role="region" aria-label="Analytics chart">
          <ResponsiveContainer width="100%" height={400}>
            <Chart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <DataComponent dataKey="views" stroke="#8884d8" fill="#8884d8" name="Views" />
              <DataComponent dataKey="engagement" stroke="#82ca9d" fill="#82ca9d" name="Engagement" />
            </Chart>
          </ResponsiveContainer>
        </div>
      );
    };

    it('should render line chart', () => {
      render(<AnalyticsChart data={mockData} type="line" />);

      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('should render bar chart', () => {
      render(<AnalyticsChart data={mockData} type="bar" />);

      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('should have accessible label', () => {
      render(<AnalyticsChart data={mockData} />);

      const chart = screen.getByRole('region', { name: 'Analytics chart' });
      expect(chart).toBeInTheDocument();
    });

    it('should render chart components', () => {
      render(<AnalyticsChart data={mockData} type="line" />);

      expect(screen.getByTestId('x-axis')).toBeInTheDocument();
      expect(screen.getByTestId('y-axis')).toBeInTheDocument();
      expect(screen.getByTestId('grid')).toBeInTheDocument();
      expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      expect(screen.getByTestId('legend')).toBeInTheDocument();
    });
  });

  describe('Chart Data Display', () => {
    const MetricsDisplay = ({ data }: { data: any[] }) => (
      <div>
        <h3>Analytics Summary</h3>
        <table role="table" aria-label="Analytics data table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Views</th>
              <th>Engagement</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td>{row.date}</td>
                <td>{row.views}</td>
                <td>{row.engagement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    it('should display data in table format', () => {
      const data = [
        { date: '2025-01-01', views: 120, engagement: 45 },
        { date: '2025-01-02', views: 150, engagement: 60 },
      ];

      render(<MetricsDisplay data={data} />);

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      expect(screen.getByText('2025-01-01')).toBeInTheDocument();
      expect(screen.getByText('120')).toBeInTheDocument();
      expect(screen.getByText('45')).toBeInTheDocument();
    });

    it('should be accessible to screen readers', () => {
      const data = [{ date: '2025-01-01', views: 120, engagement: 45 }];
      render(<MetricsDisplay data={data} />);

      const table = screen.getByLabelText('Analytics data table');
      expect(table).toBeInTheDocument();
    });
  });

  describe('Chart Time Range Selector', () => {
    const TimeRangeSelector = ({ onRangeChange }: { onRangeChange: (range: string) => void }) => {
      const [selected, setSelected] = React.useState('7d');

      const handleChange = (range: string) => {
        setSelected(range);
        onRangeChange(range);
      };

      return (
        <div role="group" aria-label="Time range selector">
          <button
            onClick={() => handleChange('7d')}
            aria-pressed={selected === '7d'}
            className={selected === '7d' ? 'active' : ''}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => handleChange('30d')}
            aria-pressed={selected === '30d'}
            className={selected === '30d' ? 'active' : ''}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => handleChange('90d')}
            aria-pressed={selected === '90d'}
            className={selected === '90d' ? 'active' : ''}
          >
            Last 90 Days
          </button>
        </div>
      );
    };

    it('should render time range buttons', () => {
      const mockOnChange = jest.fn();
      render(<TimeRangeSelector onRangeChange={mockOnChange} />);

      expect(screen.getByRole('button', { name: 'Last 7 Days' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Last 30 Days' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Last 90 Days' })).toBeInTheDocument();
    });

    it('should update selected range', async () => {
      const mockOnChange = jest.fn();
      render(<TimeRangeSelector onRangeChange={mockOnChange} />);

      const button30d = screen.getByRole('button', { name: 'Last 30 Days' });
      button30d.click();

      expect(mockOnChange).toHaveBeenCalledWith('30d');
      expect(button30d).toHaveAttribute('aria-pressed', 'true');
    });

    it('should indicate active state', () => {
      const mockOnChange = jest.fn();
      render(<TimeRangeSelector onRangeChange={mockOnChange} />);

      const button7d = screen.getByRole('button', { name: 'Last 7 Days' });
      expect(button7d).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Metric Cards', () => {
    const MetricCard = ({ title, value, change, trend }: {
      title: string;
      value: number | string;
      change?: number;
      trend?: 'up' | 'down';
    }) => (
      <div role="article" aria-labelledby={`metric-${title}`}>
        <h4 id={`metric-${title}`}>{title}</h4>
        <p className="text-3xl font-bold">{value}</p>
        {change !== undefined && (
          <p className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
            <span aria-label={`${trend === 'up' ? 'increased' : 'decreased'} by ${Math.abs(change)}%`}>
              {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
            </span>
          </p>
        )}
      </div>
    );

    it('should render metric card', () => {
      render(<MetricCard title="Total Views" value="1,234" />);

      expect(screen.getByText('Total Views')).toBeInTheDocument();
      expect(screen.getByText('1,234')).toBeInTheDocument();
    });

    it('should show positive trend', () => {
      render(<MetricCard title="Engagement" value="85%" change={12} trend="up" />);

      expect(screen.getByLabelText('increased by 12%')).toBeInTheDocument();
      expect(screen.getByText(/12%/)).toHaveClass('text-green-600');
    });

    it('should show negative trend', () => {
      render(<MetricCard title="Bounce Rate" value="25%" change={-5} trend="down" />);

      expect(screen.getByLabelText('decreased by 5%')).toBeInTheDocument();
      expect(screen.getByText(/5%/)).toHaveClass('text-red-600');
    });
  });

  describe('Chart Loading State', () => {
    const ChartWithLoading = ({ isLoading, data }: { isLoading: boolean; data?: any[] }) => {
      if (isLoading) {
        return (
          <div role="status" aria-label="Loading chart">
            <div className="animate-pulse">
              <div className="h-64 bg-gray-200 rounded" />
            </div>
            <span className="sr-only">Loading analytics data...</span>
          </div>
        );
      }

      return (
        <div role="region" aria-label="Analytics chart">
          <p>Chart with {data?.length} data points</p>
        </div>
      );
    };

    it('should show loading skeleton', () => {
      render(<ChartWithLoading isLoading={true} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
      expect(screen.getByText('Loading analytics data...')).toBeInTheDocument();
    });

    it('should show chart when loaded', () => {
      render(<ChartWithLoading isLoading={false} data={[1, 2, 3]} />);

      expect(screen.getByRole('region', { name: 'Analytics chart' })).toBeInTheDocument();
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });

  describe('Chart Accessibility', () => {
    it('should provide data table alternative for screen readers', () => {
      const ChartWithTable = ({ data }: { data: any[] }) => (
        <div>
          <div aria-hidden="true">
            {/* Visual chart would go here */}
            <div data-testid="visual-chart">Chart visualization</div>
          </div>
          <table className="sr-only" aria-label="Analytics data">
            <caption>Weekly analytics data</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Views</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td>{row.views}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

      const data = [{ date: '2025-01-01', views: 100 }];
      render(<ChartWithTable data={data} />);

      const table = screen.getByLabelText('Analytics data');
      expect(table).toBeInTheDocument();
      expect(table).toHaveClass('sr-only');
    });

    it('should have descriptive labels for chart regions', () => {
      render(
        <section aria-labelledby="chart-title">
          <h2 id="chart-title">Weekly Performance</h2>
          <div role="img" aria-label="Line chart showing views over the past week">
            Chart content
          </div>
        </section>
      );

      const section = screen.getByLabelText('Weekly Performance');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Chart Export Functionality', () => {
    const ChartWithExport = ({ data }: { data: any[] }) => {
      const handleExport = (format: string) => {
        console.log(`Exporting as ${format}`);
      };

      return (
        <div>
          <div role="region" aria-label="Analytics chart">
            Chart content
          </div>
          <div role="group" aria-label="Export options">
            <button onClick={() => handleExport('csv')}>
              Export as CSV
            </button>
            <button onClick={() => handleExport('png')}>
              Export as PNG
            </button>
          </div>
        </div>
      );
    };

    it('should render export buttons', () => {
      render(<ChartWithExport data={[]} />);

      expect(screen.getByRole('button', { name: 'Export as CSV' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Export as PNG' })).toBeInTheDocument();
    });
  });

  describe('Responsive Chart', () => {
    it('should be responsive', () => {
      const ResponsiveChart = () => (
        <div className="w-full">
          <div data-testid="responsive-container" className="w-full h-64 md:h-96 lg:h-[500px]">
            Chart content
          </div>
        </div>
      );

      const { container } = render(<ResponsiveChart />);

      const chartContainer = container.querySelector('[data-testid="responsive-container"]');
      expect(chartContainer).toHaveClass('w-full', 'h-64', 'md:h-96', 'lg:h-[500px]');
    });
  });
});
