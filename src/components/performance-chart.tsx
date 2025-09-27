'use client';

import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTheme } from 'next-themes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface PerformanceChartProps {
  type: 'line' | 'bar' | 'doughnut';
  title: string;
  description?: string;
  data: any;
  height?: number;
}

export default function PerformanceChart({ 
  type, 
  title, 
  description, 
  data, 
  height = 300 
}: PerformanceChartProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#e5e7eb' : '#374151',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1f2937' : '#ffffff',
        titleColor: isDark ? '#f9fafb' : '#111827',
        bodyColor: isDark ? '#e5e7eb' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
      },
    },
    scales: type !== 'doughnut' ? {
      x: {
        grid: {
          color: isDark ? '#374151' : '#f3f4f6',
          borderColor: isDark ? '#4b5563' : '#d1d5db',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
        },
      },
      y: {
        grid: {
          color: isDark ? '#374151' : '#f3f4f6',
          borderColor: isDark ? '#4b5563' : '#d1d5db',
        },
        ticks: {
          color: isDark ? '#9ca3af' : '#6b7280',
          font: {
            family: 'Inter, sans-serif',
            size: 11,
          },
        },
      },
    } : undefined,
  };

  const enhancedData = {
    ...data,
    datasets: data.datasets.map((dataset: any, index: number) => ({
      ...dataset,
      backgroundColor: type === 'doughnut' 
        ? ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981']
        : type === 'line'
        ? `rgba(6, 182, 212, 0.1)`
        : `rgba(6, 182, 212, 0.8)`,
      borderColor: type === 'doughnut'
        ? ['#06b6d4', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981']
        : '#06b6d4',
      borderWidth: type === 'line' ? 3 : 1,
      tension: type === 'line' ? 0.4 : undefined,
      fill: type === 'line',
      pointBackgroundColor: '#06b6d4',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
      pointRadius: type === 'line' ? 6 : undefined,
      pointHoverRadius: type === 'line' ? 8 : undefined,
    })),
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={enhancedData} options={chartOptions} />;
      case 'bar':
        return <Bar data={enhancedData} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={enhancedData} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-gray-600 dark:text-gray-300">
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          {renderChart()}
        </div>
      </CardContent>
    </Card>
  );
}

// Sample data generators for different chart types
export const generateAttendanceData = () => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  datasets: [
    {
      label: 'Attendance Rate (%)',
      data: [95, 87, 92, 88, 94, 89],
    },
  ],
});

export const generateGradeDistribution = () => ({
  labels: ['A+', 'A', 'B+', 'B', 'C+', 'C'],
  datasets: [
    {
      label: 'Students',
      data: [12, 19, 15, 8, 5, 2],
    },
  ],
});

export const generateSubjectPerformance = () => ({
  labels: ['Math', 'Science', 'English', 'History', 'Art'],
  datasets: [
    {
      label: 'Average Score',
      data: [85, 92, 78, 88, 95],
    },
  ],
});

export const generateProgressOverTime = () => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Class Average',
      data: [75, 78, 82, 85, 87, 89],
    },
    {
      label: 'Student Performance',
      data: [70, 75, 80, 83, 86, 88],
    },
  ],
});
