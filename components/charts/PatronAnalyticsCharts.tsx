'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line
} from 'recharts';

// Performance Chart - Views, Watch Time, Engagement over time
interface PerformanceChartProps {
  metric: 'views' | 'watchTime' | 'engagement';
  timeRange: string;
  className?: string;
}

export function PerformanceChart({ metric, timeRange, className = '' }: PerformanceChartProps) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  
  // Memoize data generation to prevent infinite re-renders
  const data = React.useMemo(() => {
    const chartData = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      let value;
      // Use deterministic values based on date to prevent random changes
      const seed = date.getTime() + (metric === 'views' ? 1 : metric === 'watchTime' ? 2 : 3);
      const random = Math.sin(seed) * 10000;
      const normalizedRandom = (random - Math.floor(random));
      
      switch (metric) {
        case 'views':
          value = Math.floor(normalizedRandom * 3000) + 2000;
          break;
        case 'watchTime':
          value = Math.floor(normalizedRandom * 200) + 150; // minutes
          break;
        case 'engagement':
          value = Math.floor(normalizedRandom * 25) + 65; // percentage
          break;
      }
      
      chartData.push({
        date: date.toISOString().split('T')[0],
        formattedDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        value
      });
    }
    return chartData;
  }, [days, metric]);

  const getColor = () => {
    switch (metric) {
      case 'views': return '#3B82F6';
      case 'watchTime': return '#10B981';
      case 'engagement': return '#8B5CF6';
      default: return '#3B82F6';
    }
  };

  const formatValue = (value: number) => {
    switch (metric) {
      case 'views':
        return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : value.toString();
      case 'watchTime':
        return `${value}m`;
      case 'engagement':
        return `${value}%`;
      default:
        return value.toString();
    }
  };

  return (
    <div className={`w-full h-80 ${className}`}>
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

// Content Performance Chart - shows which content patrons are watching most
interface ContentPerformanceChartProps {
  data: Array<{
    title: string;
    views: number;
    watchTime: number; // in minutes
    engagement: number; // percentage
    color: string;
  }>;
  className?: string;
}

export function ContentPerformanceChart({ data, className = '' }: ContentPerformanceChartProps) {
  const totalViews = data.reduce((sum, item) => sum + item.views, 0);
  
  const chartData = data.map(item => ({
    name: item.title,
    value: Math.round((item.views / totalViews) * 100),
    views: item.views,
    watchTime: item.watchTime,
    engagement: item.engagement,
    fill: item.color.replace('bg-', '#').replace('purple-500', '8b5cf6').replace('blue-500', '3b82f6').replace('green-500', '10b981').replace('yellow-500', 'eab308').replace('red-500', 'ef4444')
  }));

  return (
    <div className={`w-full ${className}`}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string, props: any) => [
                `${value}% (${props.payload.views.toLocaleString()} views)`,
                name
              ]}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-gray-300">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Top Content Performance</h4>
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-gray-300 truncate max-w-[120px]">{item.title}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">{item.views.toLocaleString()} views</div>
              <div className="text-gray-400">{item.watchTime}min avg • {item.engagement}% engaged</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Device Breakdown Chart - shows what devices patrons use to watch
interface DeviceBreakdownChartProps {
  data: Array<{
    name: string;
    percentage: number;
    color: string;
  }>;
  className?: string;
}

export function DeviceBreakdownChart({ data, className = '' }: DeviceBreakdownChartProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded ${item.color}`}></div>
              <span className="text-gray-300 font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
              <span className="text-white font-semibold w-12 text-right">{item.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Traffic Sources Chart - shows how patrons discover content
interface TrafficSourcesChartProps {
  data: Array<{
    source: string;
    percentage: number;
    views: number;
  }>;
  className?: string;
}

export function TrafficSourcesChart({ data, className = '' }: TrafficSourcesChartProps) {
  const colors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  
  const chartData = data.map((item, index) => ({
    name: item.source,
    value: item.percentage,
    views: item.views,
    fill: colors[index % colors.length]
  }));

  return (
    <div className={`w-full ${className}`}>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number, name: string, props: any) => [
                `${value}% (${props.payload.views.toLocaleString()} views)`,
                name
              ]}
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Traffic Source Breakdown</h4>
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="text-gray-300">{item.source}</span>
            </div>
            <div className="text-right">
              <div className="text-white font-medium">{item.views.toLocaleString()}</div>
              <div className="text-gray-400">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Patron Activity Chart - shows when patrons are most active
interface PatronActivityChartProps {
  timeRange: string;
  className?: string;
}

export function PatronActivityChart({ timeRange, className = '' }: PatronActivityChartProps) {
  const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
  
  // Memoize data generation to prevent infinite re-renders
  const data = React.useMemo(() => {
    const chartData = [];
    const now = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Use deterministic values based on date
      const seed = date.getTime();
      const random1 = Math.sin(seed) * 10000;
      const random2 = Math.sin(seed + 1) * 10000;
      const random3 = Math.sin(seed + 2) * 10000;
      
      chartData.push({
        date: date.toISOString().split('T')[0],
        formattedDate: date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        }),
        activePatrons: Math.floor(Math.abs(random1 - Math.floor(random1)) * 400) + 200,
        newPatrons: Math.floor(Math.abs(random2 - Math.floor(random2)) * 40) + 10,
        returningPatrons: Math.floor(Math.abs(random3 - Math.floor(random3)) * 250) + 150
      });
    }
    return chartData;
  }, [days, timeRange]);

  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Legend />
          <Line 
            type="monotone" 
            dataKey="activePatrons" 
            stroke="#8B5CF6" 
            strokeWidth={2}
            name="Active Patrons"
            dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="newPatrons" 
            stroke="#10B981" 
            strokeWidth={2}
            name="New Patrons"
            dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="returningPatrons" 
            stroke="#3B82F6" 
            strokeWidth={2}
            name="Returning Patrons"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// Watch Time Distribution Chart - shows how long patrons watch content
interface WatchTimeDistributionChartProps {
  className?: string;
}

export function WatchTimeDistributionChart({ className = '' }: WatchTimeDistributionChartProps) {
  // Static data to prevent re-renders
  const data = React.useMemo(() => [
    { range: '0-5min', count: 1250, percentage: 25 },
    { range: '5-15min', count: 1875, percentage: 37.5 },
    { range: '15-30min', count: 1000, percentage: 20 },
    { range: '30-60min', count: 625, percentage: 12.5 },
    { range: '60min+', count: 250, percentage: 5 }
  ], []);

  return (
    <div className={`w-full h-80 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="range" 
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
            formatter={(value: number, name: string) => [
              `${value} patrons (${data.find(d => d.count === value)?.percentage}%)`,
              'Watch Time'
            ]}
            labelStyle={{ color: '#D1D5DB' }}
          />
          <Bar 
            dataKey="count" 
            fill="#8B5CF6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}