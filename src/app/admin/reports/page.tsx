"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  Users,
  Building,
  IndianRupee,
  Award,
  ChevronRight,
  Clock,
  BarChart3
} from "lucide-react";

interface Report {
  id: string;
  title: string;
  description: string;
  type: string;
  lastGenerated: Date;
  size: string;
  format: string;
  status: 'ready' | 'generating' | 'error';
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<string>('');

  useEffect(() => {
    // Simulate loading reports
    setTimeout(() => {
      setReports([
        {
          id: 'user-summary',
          title: 'User Registration Summary',
          description: 'Complete overview of user registrations, demographics, and activity patterns',
          type: 'user-summary',
          lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          size: '2.4 MB',
          format: 'PDF',
          status: 'ready'
        },
        {
          id: 'internship-performance',
          title: 'Internship Performance Report',
          description: 'Detailed analysis of internship programs, completion rates, and outcomes',
          type: 'internship-performance',
          lastGenerated: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          size: '3.1 MB',
          format: 'PDF',
          status: 'ready'
        },
        {
          id: 'financial-summary',
          title: 'Financial Disbursement Report',
          description: 'Comprehensive financial overview including stipends, grants, and budget allocation',
          type: 'financial-summary',
          lastGenerated: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          size: '1.8 MB',
          format: 'Excel',
          status: 'ready'
        },
        {
          id: 'company-partnerships',
          title: 'Company Partnership Report',
          description: 'Analysis of partner organizations, performance metrics, and collaboration insights',
          type: 'company-partnerships',
          lastGenerated: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
          size: '2.7 MB',
          format: 'PDF',
          status: 'ready'
        },
        {
          id: 'outcome-analysis',
          title: 'Internship Outcome Analysis',
          description: 'Post-internship employment rates, salary improvements, and career progression data',
          type: 'outcome-analysis',
          lastGenerated: new Date(),
          size: '4.2 MB',
          format: 'PDF',
          status: 'generating'
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const generateReport = async (reportType: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType,
          filters: {
            period: 'monthly'
          },
          customFields: [],
          recipients: []
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Update the report status
        setReports(prev => prev.map(report => 
          report.type === reportType 
            ? { ...report, status: 'ready' as const, lastGenerated: new Date() }
            : report
        ));
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = (reportId: string) => {
    // In a real application, this would trigger the actual download
    console.log(`Downloading report: ${reportId}`);
    // You could call an API endpoint here to get the actual file
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-100 text-green-800">Ready</Badge>;
      case 'generating':
        return <Badge className="bg-blue-100 text-blue-800">Generating...</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'user-summary':
        return <Users className="h-5 w-5 text-blue-500" />;
      case 'internship-performance':
        return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'financial-summary':
        return <IndianRupee className="h-5 w-5 text-yellow-500" />;
      case 'company-partnerships':
        return <Building className="h-5 w-5 text-purple-500" />;
      case 'outcome-analysis':
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const quickStats = [
    { label: 'Total Reports Generated', value: '1,247', icon: <FileText className="h-5 w-5" /> },
    { label: 'Reports This Month', value: '89', icon: <Calendar className="h-5 w-5" /> },
    { label: 'Average Report Size', value: '2.8 MB', icon: <BarChart3 className="h-5 w-5" /> },
    { label: 'Last Updated', value: '2 hours ago', icon: <Clock className="h-5 w-5" /> }
  ];

  if (isLoading && reports.length === 0) {
    return (
      <div className="min-h-screen bg-gov-gray flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gov-navy mx-auto mb-4"></div>
          <p className="text-gov-text">Loading reports...</p>
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
              <h1 className="text-3xl font-bold text-gov-navy">Government Reports</h1>
              <p className="text-gov-text mt-1">Comprehensive analytics and insights for PM Internship Scheme</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.history.back()}
              >
                ← Back to Dashboard
              </Button>
              <Button size="sm" className="bg-gov-navy hover:bg-gov-blue">
                <FileText className="h-4 w-4 mr-2" />
                Generate Custom Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="flex items-center p-6">
                  <div className="p-2 bg-gov-lightBlue rounded-lg mr-4">
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gov-navy">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Reports Section */}
        <Tabs defaultValue="available" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">Available Reports</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
            <TabsTrigger value="custom">Custom Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {reports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <Card className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          {getReportIcon(report.type)}
                          <div>
                            <CardTitle className="text-lg">{report.title}</CardTitle>
                            <CardDescription className="mt-1">
                              {report.description}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(report.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>Size: {report.size}</span>
                        <span>Format: {report.format}</span>
                        <span>Updated: {report.lastGenerated.toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2">
                        {report.status === 'ready' ? (
                          <Button 
                            size="sm" 
                            onClick={() => downloadReport(report.id)}
                            className="flex-1"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            disabled={report.status === 'generating'}
                            onClick={() => generateReport(report.type)}
                            className="flex-1"
                          >
                            {report.status === 'generating' ? 'Generating...' : 'Generate'}
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Report Generation</CardTitle>
                <CardDescription>
                  Automatically generate and distribute reports on a regular schedule
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Scheduled Reports</h3>
                  <p className="text-gray-600 mb-4">Set up automated report generation to receive regular insights.</p>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule New Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
                <CardDescription>
                  Create tailored reports with specific data points and filters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Custom Report Builder</h3>
                  <p className="text-gray-600 mb-4">Build custom reports with your specific requirements and filters.</p>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Custom Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
