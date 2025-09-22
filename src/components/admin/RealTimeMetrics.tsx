"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Users, 
  TrendingUp, 
  Clock, 
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface RealTimeMetric {
  id: string;
  title: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  type: 'count' | 'percentage' | 'currency';
  status: 'normal' | 'warning' | 'critical';
  lastUpdated: Date;
}

interface LiveActivity {
  id: string;
  type: 'registration' | 'application' | 'completion' | 'payment';
  message: string;
  timestamp: Date;
  user?: string;
  location?: string;
}

export default function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<RealTimeMetric[]>([
    {
      id: 'live-registrations',
      title: 'Live Registrations',
      value: 1247,
      change: 12.5,
      trend: 'up',
      type: 'count',
      status: 'normal',
      lastUpdated: new Date()
    },
    {
      id: 'active-sessions',
      title: 'Active Sessions',
      value: 3456,
      change: -2.1,
      trend: 'down',
      type: 'count',
      status: 'normal',
      lastUpdated: new Date()
    },
    {
      id: 'application-rate',
      title: 'Application Success Rate',
      value: 94.2,
      change: 1.8,
      trend: 'up',
      type: 'percentage',
      status: 'normal',
      lastUpdated: new Date()
    },
    {
      id: 'system-health',
      title: 'System Health',
      value: 99.7,
      change: 0.0,
      trend: 'stable',
      type: 'percentage',
      status: 'normal',
      lastUpdated: new Date()
    }
  ]);

  const [liveActivities, setLiveActivities] = useState<LiveActivity[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update metrics with random changes
      setMetrics(prev => prev.map(metric => {
        const changeAmount = (Math.random() - 0.5) * 10;
        const newValue = Math.max(0, metric.value + changeAmount);
        const trend = changeAmount > 2 ? 'up' : changeAmount < -2 ? 'down' : 'stable';
        
        return {
          ...metric,
          value: parseFloat(newValue.toFixed(1)),
          change: parseFloat(changeAmount.toFixed(1)),
          trend,
          lastUpdated: new Date()
        };
      }));

      // Add new live activity
      const activities = [
        { type: 'registration' as const, message: 'New user registered from Mumbai', user: 'Priya Sharma' },
        { type: 'application' as const, message: 'Internship application submitted', user: 'Rahul Kumar' },
        { type: 'completion' as const, message: 'Internship completed successfully', user: 'Anjali Patel' },
        { type: 'payment' as const, message: 'Stipend payment processed', user: 'Vikash Singh' }
      ];

      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      const newActivity: LiveActivity = {
        id: Date.now().toString(),
        ...randomActivity,
        timestamp: new Date(),
        location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad'][Math.floor(Math.random() * 5)]
      };

      setLiveActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only last 10 activities
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-green-600';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'registration': return <Users className="h-4 w-4 text-blue-500" />;
      case 'application': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'completion': return <CheckCircle className="h-4 w-4 text-purple-500" />;
      case 'payment': return <Zap className="h-4 w-4 text-yellow-500" />;
      default: return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency': return `₹${value.toLocaleString()}`;
      case 'percentage': return `${value}%`;
      default: return value.toLocaleString();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      {/* Real-time Metrics */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2 text-gov-navy" />
              Real-time Metrics
              <Badge variant="outline" className="ml-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                Live
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {metrics.map((metric) => (
                <motion.div
                  key={metric.id}
                  layout
                  className="p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{metric.title}</span>
                    <div className="flex items-center space-x-1">
                      {metric.trend === 'up' ? (
                        <ArrowUpRight className="h-3 w-3 text-green-500" />
                      ) : metric.trend === 'down' ? (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      ) : (
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      )}
                      <span className={`text-xs ${
                        metric.trend === 'up' ? 'text-green-600' : 
                        metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {metric.change > 0 ? '+' : ''}{metric.change}%
                      </span>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gov-navy mb-1">
                    {formatValue(metric.value, metric.type)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Updated: {metric.lastUpdated.toLocaleTimeString()}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-gov-navy" />
            Live Activity Feed
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <div className="space-y-3">
            <AnimatePresence>
              {liveActivities.map((activity) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex-shrink-0 mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    {activity.user && (
                      <p className="text-xs text-gray-600">
                        User: {activity.user}
                      </p>
                    )}
                    {activity.location && (
                      <p className="text-xs text-gray-500">
                        Location: {activity.location}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {activity.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {liveActivities.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Waiting for live activities...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
