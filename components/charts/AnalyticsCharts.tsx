'use client';

import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Sample data generators for different time ranges
const generateTimeSeriesData = (days: number, metric: 'views' | 'revenue' | 'engagement') => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    let value;
    switch (metric) {
      case 'views':
        value = Math.floor(Math.random() * 5000) + 2000 + (Math.sin(i / 7) * 1000);
        break;
      case 'revenue':
        value = Math.floor(Math.random() * 200) + 100 + (Math.sin(i / 7) * 50);
        break;
      case 'engagement':
        value = Math.random() * 0.3 + 0.4 + (Math.sin(i / 7) * 0.1);
        break;
      default:
        value = 0;
    }
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(0, value),
      formattedDate: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      })
    });
  }
  
  return data;
};

interface PerformanceChartProps {
  metric: 'views' | 'revenue' | 'engagement';
  timeRange: string;
  className?: string;
}

export function PerformanceChart({ metric, timeRange, className = '' }: PerformanceChartProps) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  const data = generateTimeSeriesData(days, metric);
  
  const formatValue = (value: number) => {
    switch (metric) {
      case 'views':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
      case 'revenue':
        return `$${value.toFixed(0)}`;
      case 'engagement':
        return `${(value * 100).toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  const getColor = () => {
    switch (metric) {
      case 'views':
        return '#3B82F6'; // blue
      case 'revenue':
        return '#10B981'; // green
      case 'engagement':
        return '#F59E0B'; // yellow
      default:
        return '#6B7280';
    }
  };

  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`gradient-${metric}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={getColor()} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={getColor()} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={formatValue}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: number) => [formatValue(value), metric.charAt(0).toUpperCase() + metric.slice(1)]}
            labelStyle={{ color: '#D1D5DB' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={getColor()}
            strokeWidth={2}
            fill={`url(#gradient-${metric})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface RevenueBreakdownChartProps {
  data: Array<{
    tier: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  className?: string;
}

export function RevenueBreakdownChart({ data, className = '' }: RevenueBreakdownChartProps) {
  // Convert Tailwind colors to hex
  const colorMap: { [key: string]: string } = {
    'bg-purple-500': '#8B5CF6',
    'bg-blue-500': '#3B82F6',
    'bg-green-500': '#10B981',
    'bg-yellow-500': '#F59E0B',
    'bg-red-500': '#EF4444',
    'bg-indigo-500': '#6366F1'
  };

  const processedData = data.map(item => ({
    name: item.tier,
    value: item.amount,
    percentage: item.percentage,
    fill: colorMap[item.color] || '#6B7280'
  }));

  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
          />
          <Legend
            wrapperStyle={{ color: '#D1D5DB', fontSize: '12px' }}
            formatter={(value) => value}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface DeviceBreakdownChartProps {
  data: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  className?: string;
}

export function DeviceBreakdownChart({ data, className = '' }: DeviceBreakdownChartProps) {
  const colorMap: { [key: string]: string } = {
    'bg-blue-500': '#3B82F6',
    'bg-green-500': '#10B981',
    'bg-purple-500': '#8B5CF6',
    'bg-yellow-500': '#F59E0B',
    'bg-red-500': '#EF4444'
  };

  const chartData = data.map(item => ({
    name: item.name,
    value: item.percentage,
    fill: colorMap[item.color] || '#6B7280'
  }));

  return (
    <div className={`w-full h-48 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="horizontal" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            type="number" 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <YAxis 
            type="category" 
            dataKey="name"
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: number) => [`${value}%`, 'Usage']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

interface TrafficSourcesChartProps {
  data: Array<{
    source: string;
    percentage: number;
    views: number;
  }>;
  className?: string;
}

export function TrafficSourcesChart({ data, className = '' }: TrafficSourcesChartProps) {
  const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6'];
  
  const chartData = data.map((item, index) => ({
    name: item.source,
    value: item.percentage,
    views: item.views,
    fill: colors[index % colors.length]
  }));

  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            formatter={(value: number, name: string, props: any) => [
              `${value}% (${props.payload.views.toLocaleString()} views)`,
              'Traffic Share'
            ]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

interface EngagementOverviewChartProps {
  timeRange: string;
  className?: string;
}

export function EngagementOverviewChart({ timeRange, className = '' }: EngagementOverviewChartProps) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  
  // Generate sample engagement data
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toISOString().split('T')[0],
      formattedDate: date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      likes: Math.floor(Math.random() * 500) + 200,
      comments: Math.floor(Math.random() * 100) + 50,
      shares: Math.floor(Math.random() * 50) + 20,
      saves: Math.floor(Math.random() * 80) + 30
    });
  }

  return (
    <div className={`w-full h-64 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#9CA3AF"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB'
            }}
            labelStyle={{ color: '#D1D5DB' }}
          />
          <Legend wrapperStyle={{ color: '#D1D5DB' }} />
          <Line 
            type="monotone" 
            dataKey="likes" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
            name="Likes"
          />
          <Line 
            type="monotone" 
            dataKey="comments" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            name="Comments"
          />
          <Line 
            type="monotone" 
            dataKey="shares" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            name="Shares"
          />
          <Line 
            type="monotone" 
            dataKey="saves" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
            name="Saves"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}