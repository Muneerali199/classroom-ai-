'use client';

import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  BookOpen, 
  Award,
  AlertCircle,
  CheckCircle,
  Clock,
  Target,
  Zap,
  Brain
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: 'attendance' | 'score' | 'assignments' | 'gpa' | 'trend';
  trend?: 'up' | 'down' | 'stable';
  color?: 'cyan' | 'blue' | 'green' | 'orange' | 'red';
}

export function MetricCard({ title, value, subtitle, icon, trend, color = 'cyan' }: MetricCardProps) {
  const iconMap = {
    attendance: Calendar,
    score: Award,
    assignments: BookOpen,
    gpa: Target,
    trend: TrendingUp
  };

  const Icon = iconMap[icon];
  
  const colorMap = {
    cyan: 'from-cyan-500 to-blue-600',
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-red-600',
    red: 'from-red-500 to-pink-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg relative overflow-hidden"
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colorMap[color]} opacity-10`} />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <Icon className="w-5 h-5 text-white/70" />
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${
              trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-white/50'
            }`}>
              {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <div className="text-xs text-white/60">{title}</div>
        {subtitle && <div className="text-xs text-white/40 mt-1">{subtitle}</div>}
      </div>
    </motion.div>
  );
}

interface InsightCardProps {
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function InsightCard({ type, title, description, actionLabel, onAction }: InsightCardProps) {
  const icons = {
    success: CheckCircle,
    warning: AlertCircle,
    info: Brain,
    error: AlertCircle
  };

  const colors = {
    success: 'from-green-500 to-emerald-600',
    warning: 'from-orange-500 to-red-600',
    info: 'from-cyan-500 to-blue-600',
    error: 'from-red-500 to-pink-600'
  };

  const Icon = icons[type];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`p-4 rounded-xl bg-gradient-to-r ${colors[type]} bg-opacity-10 border-l-4 border-white/20`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-white/80">{description}</p>
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="mt-2 text-sm text-white/90 hover:text-white font-semibold underline"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

interface RecommendationCardProps {
  number: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

export function RecommendationCard({ number, title, description, priority }: RecommendationCardProps) {
  const priorityColors = {
    high: 'from-red-500 to-orange-600',
    medium: 'from-orange-500 to-yellow-600',
    low: 'from-cyan-500 to-blue-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: number * 0.1 }}
      className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-lg"
    >
      <div className="flex gap-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r ${priorityColors[priority]} flex items-center justify-center font-bold text-white`}>
          {number}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm text-white/70">{description}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              priority === 'high' ? 'bg-red-500/20 text-red-400' :
              priority === 'medium' ? 'bg-orange-500/20 text-orange-400' :
              'bg-blue-500/20 text-blue-400'
            }`}>
              {priority.toUpperCase()} PRIORITY
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: 'cyan' | 'green' | 'orange' | 'red';
}

export function ProgressBar({ label, value, max, color = 'cyan' }: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  const colorMap = {
    cyan: 'from-cyan-500 to-blue-600',
    green: 'from-green-500 to-emerald-600',
    orange: 'from-orange-500 to-yellow-600',
    red: 'from-red-500 to-pink-600'
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-white/80">{label}</span>
        <span className="text-white font-semibold">{value}/{max}</span>
      </div>
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`h-full bg-gradient-to-r ${colorMap[color]}`}
        />
      </div>
    </div>
  );
}

interface TimelineItemProps {
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
}

export function TimelineItem({ time, title, description, status }: TimelineItemProps) {
  const statusColors = {
    completed: 'bg-green-500',
    current: 'bg-cyan-500 animate-pulse',
    upcoming: 'bg-white/20'
  };

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
        {status !== 'upcoming' && <div className="w-0.5 h-full bg-white/10 mt-2" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="text-xs text-white/50 mb-1">{time}</div>
        <div className="font-semibold text-white mb-1">{title}</div>
        <div className="text-sm text-white/70">{description}</div>
      </div>
    </div>
  );
}

interface QuickActionProps {
  icon: 'analyze' | 'plan' | 'reminder' | 'help';
  label: string;
  onClick: () => void;
}

export function QuickAction({ icon, label, onClick }: QuickActionProps) {
  const iconMap = {
    analyze: TrendingUp,
    plan: Target,
    reminder: Clock,
    help: Zap
  };

  const Icon = iconMap[icon];

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-all flex items-center gap-3 text-left"
    >
      <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
        <Icon className="w-4 h-4 text-white" />
      </div>
      <span className="text-sm font-semibold text-white">{label}</span>
    </motion.button>
  );
}

interface CompactResponseProps {
  data: {
    summary: string;
    keyPoints: string[];
    metrics?: Record<string, string | number>;
  };
}

export function CompactResponse({ data }: CompactResponseProps) {
  return (
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-white/5 border border-white/10">
        <p className="text-sm text-white/90">{data.summary}</p>
      </div>

      {data.metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(data.metrics).map(([key, value]) => (
            <div key={key} className="p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-xs text-white/50">{key}</div>
              <div className="text-lg font-bold text-white">{value}</div>
            </div>
          ))}
        </div>
      )}

      {data.keyPoints.length > 0 && (
        <div className="space-y-2">
          {data.keyPoints.map((point, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-cyan-500 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-white/80">{point}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
