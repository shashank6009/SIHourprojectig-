"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Building, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  IndianRupee
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart as RechartsPieChart,
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { format, subDays, startOfWeek, endOfWeek } from "date-fns";
import FilterPanel, { FilterState } from "@/components/admin/FilterPanel";
import RealTimeMetrics from "@/components/admin/RealTimeMetrics";

// API data fetching functions
const fetchAnalyticsData = async (timeframe: string = '30d') => {
  try {
    const response = await fetch(`/api/admin/analytics?timeframe=${timeframe}`);
    const result = await response.json();
    
    if (result.success) {
      return result.data;
    } else {
      throw new Error(result.error || 'Failed to fetch analytics data');
    }
  } catch (error) {
    console.error('Error fetching analytics:', error);
    // Fallback to mock data if API fails
    return generateFallbackData();
  }
};

const generateFallbackData = () => {
  const states = [
    "Maharashtra", "Uttar Pradesh", "Karnataka", "Tamil Nadu", "Gujarat", 
    "Rajasthan", "West Bengal", "Madhya Pradesh", "Haryana", "Punjab"
  ];
  
  const sectors = [
    "Technology", "Healthcare", "Finance", "Manufacturing", "Education",
    "Government", "Agriculture", "Retail", "Energy", "Transportation"
  ];

  // Generate daily registration data for last 30 days
  const dailyData = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i);
    return {
      date: format(date, "yyyy-MM-dd"),
      displayDate: format(date, "MMM dd"),
      registrations: Math.floor(Math.random() * 500) + 200,
      applications: Math.floor(Math.random() * 800) + 400,
      placements: Math.floor(Math.random() * 300) + 100,
    };
  });

  // State-wise data
  const stateData = states.map(state => ({
    state,
    totalUsers: Math.floor(Math.random() * 15000) + 5000,
    activeInternships: Math.floor(Math.random() * 2000) + 500,
    completionRate: Math.floor(Math.random() * 30) + 70,
  }));

  // Sector-wise data
  const sectorData = sectors.map(sector => ({
    sector,
    totalInternships: Math.floor(Math.random() * 3000) + 1000,
    avgStipend: Math.floor(Math.random() * 20000) + 25000,
  }));

  return { 
    dailyData, 
    stateData, 
    sectorData,
    summary: {
      totalUsers: 247856,
      activeInternships: 45678,
      completedInternships: 72754,
      totalCompanies: 5847,
      successRate: 94.2
    }
  };
};

const COLORS = ['#1e40af', '#dc2626', '#059669', '#d97706', '#7c3aed', '#be123c'];

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState("30d");
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ timeframe: "30d" });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const analyticsData = await fetchAnalyticsData(filters.timeframe);
        console.log('Analytics data loaded:', analyticsData);
        setData(analyticsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setData(generateFallbackData());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [filters]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setSelectedTimeframe(newFilters.timeframe);
  };

  const handleExport = (format: string) => {
    // In a real application, this would trigger the export
    console.log(`Exporting data as ${format}`);
    // You could call an API endpoint here to generate and download the report
  };

  const handleRefresh = () => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const analyticsData = await fetchAnalyticsData(filters.timeframe);
        setData(analyticsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setData(generateFallbackData());
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  };

  const totalStats = data?.summary || {
    totalUsers: 247856,
    totalInternships: 118432,
    activeInternships: 45678,
    completedInternships: 72754,
    totalCompanies: 5847,
    governmentBodies: 1247,
    avgStipend: 5000,
    successRate: 94.2
  };

  const recentActivity = [
    { id: 1, action: "New user registration", user: "Priya Sharma", time: "2 minutes ago", type: "user" },
    { id: 2, action: "Internship completed", user: "Rahul Kumar", company: "TCS", time: "15 minutes ago", type: "completion" },
    { id: 3, action: "New company registered", user: "Infosys Ltd", time: "1 hour ago", type: "company" },
    { id: 4, action: "Internship application", user: "Anjali Patel", position: "Software Developer", time: "2 hours ago", type: "application" },
    { id: 5, action: "Payment processed", user: "Vikash Singh", amount: "₹5,000", time: "3 hours ago", type: "payment" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gov-gray flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <RefreshCw className="h-8 w-8 animate-spin text-gov-navy" />
          <p className="text-gov-text">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gov-gray">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gov-navy">Government Portal Dashboard</h1>
              <p className="text-gov-text mt-1">PM Internship Scheme Analytics & Management</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/admin/reports'}
              >
                <Download className="h-4 w-4 mr-2" />
                Reports
              </Button>
              <Button size="sm" className="bg-gov-navy hover:bg-gov-blue">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filter Panel */}
        <FilterPanel 
          onFilterChange={handleFilterChange}
          onExport={handleExport}
          onRefresh={handleRefresh}
          isLoading={isLoading}
        />

        {/* Real-time Metrics */}
        <RealTimeMetrics />

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gov-navy">{(totalStats.totalUsers || 247856).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  +12.5% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Internships</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gov-navy">{(totalStats.activeInternships || 45678).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  +8.2% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Partner Companies</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gov-navy">{(totalStats.totalCompanies || 5847).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  +15.3% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gov-navy">{(totalStats.successRate || 94.2)}%</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                  +2.1% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Dashboard Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users & Applications</TabsTrigger>
            <TabsTrigger value="geography">Geographic Data</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Registration Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-gov-navy" />
                    Registration Trends
                  </CardTitle>
                  <CardDescription>Daily registrations and applications over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={data?.dailyData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="displayDate" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="registrations" stackId="1" stroke="#1e40af" fill="#1e40af" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="applications" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sector Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-gov-navy" />
                    Sector Distribution
                  </CardTitle>
                  <CardDescription>Internship distribution across sectors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={data?.sectorData?.slice(0, 6) || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="totalInternships"
                        nameKey="sector"
                      >
                        {(data?.sectorData?.slice(0, 6) || []).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gov-navy" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest activities and updates from the portal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          activity.type === 'user' ? 'bg-blue-500' :
                          activity.type === 'completion' ? 'bg-green-500' :
                          activity.type === 'company' ? 'bg-orange-500' :
                          activity.type === 'application' ? 'bg-purple-500' : 'bg-yellow-500'
                        }`} />
                        <div>
                          <p className="font-medium text-gray-900">{activity.action}</p>
                          <p className="text-sm text-gray-600">
                            {activity.user}
                            {activity.company && ` at ${activity.company}`}
                            {activity.position && ` - ${activity.position}`}
                            {activity.amount && ` - ${activity.amount}`}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* User Growth */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>User Growth & Applications</CardTitle>
                  <CardDescription>Monthly user registrations and internship applications</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={data?.dailyData || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="displayDate" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="registrations" stroke="#1e40af" strokeWidth={2} />
                      <Line type="monotone" dataKey="applications" stroke="#059669" strokeWidth={2} />
                      <Line type="monotone" dataKey="placements" stroke="#dc2626" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Stats */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">User Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Registered</span>
                      <Badge variant="secondary">{(totalStats.totalUsers || 247856).toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Active This Month</span>
                      <Badge variant="secondary">45,231</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Completed Profiles</span>
                      <Badge variant="secondary">89.4%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Avg. Age</span>
                      <Badge variant="secondary">22.5 years</Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Application Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Total Applications</span>
                      <Badge variant="secondary">{(totalStats.totalInternships || 118432).toLocaleString()}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Review</span>
                      <Badge variant="secondary">8,432</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Approved</span>
                      <Badge variant="secondary">67,234</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Success Rate</span>
                      <Badge variant="secondary">{(totalStats.successRate || 94.2)}%</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="geography" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* State-wise Data */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gov-navy" />
                    State-wise Distribution
                  </CardTitle>
                  <CardDescription>User registrations by state</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data?.stateData?.slice(0, 8) || []} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="state" width={100} />
                      <Tooltip />
                      <Bar dataKey="totalUsers" fill="#1e40af" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Completion Rates by State */}
              <Card>
                <CardHeader>
                  <CardTitle>Completion Rates by State</CardTitle>
                  <CardDescription>Internship completion percentages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(data?.stateData?.slice(0, 8) || []).map((state: any, index: number) => (
                      <div key={state.state} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{state.state}</span>
                          <span className="text-sm text-gray-600">{state.completionRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gov-navy h-2 rounded-full transition-all duration-300"
                            style={{ width: `${state.completionRate}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <IndianRupee className="h-5 w-5 mr-2 text-gov-navy" />
                    Financial Overview
                  </CardTitle>
                  <CardDescription>Stipend and financial metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-gov-navy">₹{((totalStats.avgStipend || 5000) * (totalStats.activeInternships || 45678) / 1000000).toFixed(1)}M</p>
                      <p className="text-sm text-gray-600">Monthly Disbursement</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-gov-navy">₹{(totalStats.avgStipend || 5000).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Avg. Stipend</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Government Contribution</span>
                      <span className="font-medium">₹4,500/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Industry Contribution</span>
                      <span className="font-medium">₹500/month</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">One-time Grant</span>
                      <span className="font-medium">₹6,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2 text-gov-navy" />
                    Performance Metrics
                  </CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Application Processing Time</p>
                        <p className="text-sm text-gray-600">Average time to process applications</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">5.2 days</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Placement Rate</p>
                        <p className="text-sm text-gray-600">Successful placements percentage</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">87.3%</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Retention Rate</p>
                        <p className="text-sm text-gray-600">Interns completing full duration</p>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">92.8%</Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Employer Satisfaction</p>
                        <p className="text-sm text-gray-600">Average employer rating</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">4.6/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
