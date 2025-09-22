import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/users';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';

// Generate comprehensive reports for government officials
const generateReports = (reportType: string, period: string) => {
  const currentDate = new Date();
  
  switch (reportType) {
    case 'user-summary':
      return {
        title: 'User Registration Summary',
        period,
        data: {
          totalUsers: users.length + 247856,
          newUsersThisMonth: Math.floor(Math.random() * 5000) + 3000,
          activeUsers: Math.floor(Math.random() * 180000) + 150000,
          usersByState: [
            { state: 'Maharashtra', count: 45678, percentage: 18.4 },
            { state: 'Uttar Pradesh', count: 38945, percentage: 15.7 },
            { state: 'Karnataka', count: 32156, percentage: 13.0 },
            { state: 'Tamil Nadu', count: 28734, percentage: 11.6 },
            { state: 'Gujarat', count: 25432, percentage: 10.3 }
          ],
          usersByAge: [
            { ageGroup: '18-20', count: 62140, percentage: 25.1 },
            { ageGroup: '21-22', count: 98562, percentage: 39.8 },
            { ageGroup: '23-24', count: 74234, percentage: 30.0 },
            { ageGroup: '25+', count: 12920, percentage: 5.2 }
          ],
          usersByEducation: [
            { level: 'Bachelor\'s Degree', count: 148512, percentage: 59.9 },
            { level: 'Master\'s Degree', count: 74256, percentage: 30.0 },
            { level: 'Diploma', count: 19785, percentage: 8.0 },
            { level: 'PhD', count: 3456, percentage: 1.4 },
            { level: 'Professional Course', count: 1847, percentage: 0.7 }
          ]
        }
      };

    case 'internship-performance':
      return {
        title: 'Internship Performance Report',
        period,
        data: {
          totalInternships: 118432,
          activeInternships: 45678,
          completedInternships: 72754,
          successRate: 94.2,
          averageDuration: 10.5, // months
          sectorPerformance: [
            { sector: 'Information Technology', internships: 28456, completionRate: 96.8, avgRating: 4.7 },
            { sector: 'Healthcare', internships: 15234, completionRate: 94.2, avgRating: 4.5 },
            { sector: 'Finance', internships: 12876, completionRate: 92.1, avgRating: 4.3 },
            { sector: 'Manufacturing', internships: 18965, completionRate: 91.7, avgRating: 4.2 },
            { sector: 'Government', internships: 9876, completionRate: 97.5, avgRating: 4.8 }
          ],
          monthlyTrends: Array.from({ length: 12 }, (_, i) => ({
            month: format(subDays(currentDate, (11 - i) * 30), 'MMM yyyy'),
            applications: Math.floor(Math.random() * 5000) + 8000,
            placements: Math.floor(Math.random() * 3000) + 5000,
            completions: Math.floor(Math.random() * 2500) + 4000
          }))
        }
      };

    case 'financial-summary':
      return {
        title: 'Financial Disbursement Report',
        period,
        data: {
          totalDisbursed: 2847500000, // ₹284.75 crores
          monthlyDisbursement: 228600000, // ₹22.86 crores
          averageStipend: 5000,
          governmentContribution: {
            monthly: 4500,
            total: 2062875000 // ₹206.29 crores
          },
          industryContribution: {
            monthly: 500,
            total: 22860000 // ₹2.286 crores
          },
          oneTimeGrants: {
            perIntern: 6000,
            totalDisbursed: 436536000 // ₹43.65 crores
          },
          stateWiseDistribution: [
            { state: 'Maharashtra', amount: 523650000, percentage: 18.4 },
            { state: 'Uttar Pradesh', amount: 447052500, percentage: 15.7 },
            { state: 'Karnataka', amount: 370275000, percentage: 13.0 },
            { state: 'Tamil Nadu', amount: 330390000, percentage: 11.6 },
            { state: 'Gujarat', amount: 292950000, percentage: 10.3 }
          ],
          pendingPayments: 15670000, // ₹1.567 crores
          paymentTimeline: Array.from({ length: 6 }, (_, i) => ({
            month: format(subDays(currentDate, (5 - i) * 30), 'MMM yyyy'),
            disbursed: Math.floor(Math.random() * 50000000) + 200000000,
            pending: Math.floor(Math.random() * 5000000) + 10000000
          }))
        }
      };

    case 'company-partnerships':
      return {
        title: 'Company Partnership Report',
        period,
        data: {
          totalPartners: 5847,
          governmentBodies: 1247,
          privateCompanies: 3456,
          psus: 789,
          startups: 355,
          newPartnersThisMonth: Math.floor(Math.random() * 50) + 25,
          topPerformingCompanies: [
            { name: 'Tata Consultancy Services', internships: 2456, rating: 4.8, retention: 96.5 },
            { name: 'Infosys', internships: 2134, rating: 4.7, retention: 95.2 },
            { name: 'ISRO', internships: 1876, rating: 4.9, retention: 98.1 },
            { name: 'BHEL', internships: 1654, rating: 4.6, retention: 94.8 },
            { name: 'Wipro', internships: 1543, rating: 4.5, retention: 93.7 }
          ],
          sectorDistribution: [
            { sector: 'Information Technology', companies: 1456, percentage: 24.9 },
            { sector: 'Manufacturing', companies: 876, percentage: 15.0 },
            { sector: 'Healthcare', companies: 654, percentage: 11.2 },
            { sector: 'Finance', companies: 543, percentage: 9.3 },
            { sector: 'Government', companies: 789, percentage: 13.5 }
          ]
        }
      };

    case 'outcome-analysis':
      return {
        title: 'Internship Outcome Analysis',
        period,
        data: {
          postInternshipEmployment: 76.8, // percentage
          salaryIncrease: 45.2, // percentage increase
          skillDevelopment: 92.4, // percentage reporting skill improvement
          careerProgression: 68.7, // percentage with career advancement
          employerRetention: 43.5, // percentage hired by same company
          outcomesByEducation: [
            { level: 'Bachelor\'s', employment: 72.4, avgSalary: 35000 },
            { level: 'Master\'s', employment: 84.7, avgSalary: 55000 },
            { level: 'PhD', employment: 91.2, avgSalary: 85000 }
          ],
          outcomesBySector: [
            { sector: 'IT', employment: 89.3, avgSalary: 65000 },
            { sector: 'Finance', employment: 81.7, avgSalary: 58000 },
            { sector: 'Healthcare', employment: 78.9, avgSalary: 52000 },
            { sector: 'Manufacturing', employment: 74.2, avgSalary: 48000 },
            { sector: 'Government', employment: 85.6, avgSalary: 45000 }
          ],
          feedbackScores: {
            overallSatisfaction: 4.4,
            skillDevelopment: 4.6,
            mentorship: 4.2,
            workEnvironment: 4.3,
            careerGuidance: 4.1
          }
        }
      };

    default:
      return {
        title: 'General Report',
        period,
        data: {
          message: 'Report type not found'
        }
      };
  }
};

// GET endpoint for reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'user-summary';
    const period = searchParams.get('period') || 'monthly';
    const format = searchParams.get('format') || 'json';

    const report = generateReports(reportType, period);

    // Add metadata
    const reportData = {
      ...report,
      metadata: {
        generatedAt: new Date().toISOString(),
        generatedBy: 'PM Internship Portal Analytics System',
        reportId: `RPT-${Date.now()}`,
        version: '1.0',
        period,
        format
      }
    };

    // Handle different format requests
    if (format === 'csv') {
      // In a real application, you would convert to CSV format
      return new NextResponse(
        JSON.stringify(reportData, null, 2),
        {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${reportType}-${period}-report.json"`
          }
        }
      );
    }

    return NextResponse.json({
      success: true,
      report: reportData,
      availableReports: [
        'user-summary',
        'internship-performance', 
        'financial-summary',
        'company-partnerships',
        'outcome-analysis'
      ],
      availablePeriods: ['daily', 'weekly', 'monthly', 'quarterly', 'yearly'],
      availableFormats: ['json', 'csv', 'pdf']
    });

  } catch (error) {
    console.error('Reports API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate report',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for custom report generation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportType, filters, customFields, recipients } = body;

    // Generate custom report based on filters
    const baseReport = generateReports(reportType, filters?.period || 'monthly');
    
    // Apply custom filters
    let filteredData = baseReport.data;
    
    if (filters?.states) {
      // Filter by states if specified
      if (filteredData.usersByState) {
        filteredData.usersByState = filteredData.usersByState.filter((item: any) => 
          filters.states.includes(item.state)
        );
      }
    }

    if (filters?.sectors) {
      // Filter by sectors if specified
      if (filteredData.sectorPerformance) {
        filteredData.sectorPerformance = filteredData.sectorPerformance.filter((item: any) => 
          filters.sectors.includes(item.sector)
        );
      }
    }

    const customReport = {
      ...baseReport,
      data: filteredData,
      customFields: customFields || [],
      filters,
      recipients: recipients || [],
      metadata: {
        generatedAt: new Date().toISOString(),
        reportId: `CUSTOM-RPT-${Date.now()}`,
        customReport: true,
        requestedBy: 'admin', // In real app, get from auth
        version: '1.0'
      }
    };

    // In a real application, you might:
    // 1. Save the report to database
    // 2. Send email notifications to recipients
    // 3. Generate PDF/Excel files
    // 4. Schedule recurring reports

    return NextResponse.json({
      success: true,
      report: customReport,
      message: 'Custom report generated successfully',
      reportId: customReport.metadata.reportId
    });

  } catch (error) {
    console.error('Custom report generation error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate custom report',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
