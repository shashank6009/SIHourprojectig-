import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/lib/users';
import { format, subDays, parseISO, isAfter, isBefore } from 'date-fns';

// Mock data for demonstration - in production this would come from a database
const generateAnalyticsData = () => {
  const states = [
    { name: "Maharashtra", code: "MH" },
    { name: "Uttar Pradesh", code: "UP" },
    { name: "Karnataka", code: "KA" },
    { name: "Tamil Nadu", code: "TN" },
    { name: "Gujarat", code: "GJ" },
    { name: "Rajasthan", code: "RJ" },
    { name: "West Bengal", code: "WB" },
    { name: "Madhya Pradesh", code: "MP" },
    { name: "Haryana", code: "HR" },
    { name: "Punjab", code: "PB" }
  ];
  
  const sectors = [
    "Information Technology",
    "Healthcare & Medical",
    "Financial Services",
    "Manufacturing",
    "Education & Training",
    "Government & Public Sector",
    "Agriculture & Food",
    "Retail & E-commerce",
    "Energy & Utilities",
    "Transportation & Logistics"
  ];

  const companies = [
    "Tata Consultancy Services", "Infosys", "Wipro", "HCL Technologies",
    "Tech Mahindra", "Accenture", "IBM India", "Microsoft India",
    "Amazon India", "Google India", "BHEL", "ONGC", "NTPC", "ISRO",
    "Railways", "SBI", "HDFC Bank", "ICICI Bank", "Reliance Industries"
  ];

  // Generate daily data for the last 90 days
  const dailyData = Array.from({ length: 90 }, (_, i) => {
    const date = subDays(new Date(), 89 - i);
    const baseRegistrations = 150 + Math.sin(i * 0.1) * 50; // Seasonal variation
    const weekendFactor = date.getDay() === 0 || date.getDay() === 6 ? 0.3 : 1;
    
    return {
      date: format(date, "yyyy-MM-dd"),
      displayDate: format(date, "MMM dd"),
      registrations: Math.floor((baseRegistrations + Math.random() * 100) * weekendFactor),
      applications: Math.floor((baseRegistrations * 1.5 + Math.random() * 150) * weekendFactor),
      placements: Math.floor((baseRegistrations * 0.6 + Math.random() * 60) * weekendFactor),
      interviews: Math.floor((baseRegistrations * 0.8 + Math.random() * 80) * weekendFactor),
    };
  });

  // State-wise distribution
  const stateData = states.map(state => ({
    state: state.name,
    code: state.code,
    totalUsers: Math.floor(Math.random() * 20000) + 5000,
    activeInternships: Math.floor(Math.random() * 3000) + 500,
    completedInternships: Math.floor(Math.random() * 5000) + 1000,
    completionRate: Math.floor(Math.random() * 25) + 75, // 75-100%
    avgStipend: Math.floor(Math.random() * 2000) + 4000, // 4000-6000
    topSector: sectors[Math.floor(Math.random() * sectors.length)]
  }));

  // Sector-wise data
  const sectorData = sectors.map(sector => ({
    sector,
    totalInternships: Math.floor(Math.random() * 5000) + 2000,
    activeInternships: Math.floor(Math.random() * 2000) + 500,
    avgStipend: Math.floor(Math.random() * 3000) + 3500,
    avgDuration: Math.floor(Math.random() * 6) + 6, // 6-12 months
    satisfactionRate: Math.floor(Math.random() * 20) + 80, // 80-100%
    topCompanies: companies.slice(0, 3).sort(() => Math.random() - 0.5)
  }));

  // Company-wise data
  const companyData = companies.map(company => ({
    name: company,
    totalInternships: Math.floor(Math.random() * 1000) + 100,
    activeInternships: Math.floor(Math.random() * 300) + 50,
    avgStipend: Math.floor(Math.random() * 4000) + 3000,
    rating: (Math.random() * 1.5 + 3.5).toFixed(1), // 3.5-5.0
    sector: sectors[Math.floor(Math.random() * sectors.length)],
    locations: Math.floor(Math.random() * 15) + 5
  }));

  // Age distribution
  const ageData = [
    { ageGroup: "18-20", count: Math.floor(Math.random() * 15000) + 5000, percentage: 0 },
    { ageGroup: "21-22", count: Math.floor(Math.random() * 25000) + 15000, percentage: 0 },
    { ageGroup: "23-24", count: Math.floor(Math.random() * 20000) + 10000, percentage: 0 },
    { ageGroup: "25+", count: Math.floor(Math.random() * 8000) + 2000, percentage: 0 }
  ];
  
  const totalAge = ageData.reduce((sum, item) => sum + item.count, 0);
  ageData.forEach(item => {
    item.percentage = Math.round((item.count / totalAge) * 100);
  });

  // Education distribution
  const educationData = [
    { level: "Bachelor's Degree", count: Math.floor(Math.random() * 40000) + 30000 },
    { level: "Master's Degree", count: Math.floor(Math.random() * 20000) + 15000 },
    { level: "Diploma", count: Math.floor(Math.random() * 15000) + 8000 },
    { level: "PhD", count: Math.floor(Math.random() * 3000) + 1000 },
    { level: "Professional Course", count: Math.floor(Math.random() * 10000) + 5000 }
  ];

  // Financial data
  const financialData = {
    totalDisbursed: 2847500000, // ₹284.75 crores
    monthlyDisbursement: 228600000, // ₹22.86 crores
    avgStipend: 5000,
    govtContribution: 4500,
    industryContribution: 500,
    oneTimeGrant: 6000,
    pendingPayments: 15670000, // ₹1.567 crores
    totalBeneficiaries: 247856
  };

  // Performance metrics
  const performanceData = {
    applicationProcessingTime: 5.2, // days
    placementRate: 87.3, // percentage
    retentionRate: 92.8, // percentage
    employerSatisfaction: 4.6, // out of 5
    internSatisfaction: 4.4, // out of 5
    completionRate: 94.2, // percentage
    postInternshipEmployment: 76.8 // percentage
  };

  return {
    dailyData,
    stateData,
    sectorData,
    companyData,
    ageData,
    educationData,
    financialData,
    performanceData,
    summary: {
      totalUsers: users.length + 247856, // Add mock data to real users
      totalInternships: 118432, // Add missing property
      activeInternships: 45678,
      completedInternships: 72754,
      totalCompanies: 5847,
      governmentBodies: 1247,
      avgStipend: 5000,
      successRate: 94.2,
      newRegistrationsToday: Math.floor(Math.random() * 200) + 100,
      applicationsToday: Math.floor(Math.random() * 350) + 200,
      placementsToday: Math.floor(Math.random() * 150) + 75
    }
  };
};

// GET endpoint for analytics data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '30d';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const state = searchParams.get('state');
    const sector = searchParams.get('sector');

    let analyticsData = generateAnalyticsData();

    // Filter data based on timeframe or date range
    if (startDate && endDate) {
      const start = parseISO(startDate);
      const end = parseISO(endDate);
      
      analyticsData.dailyData = analyticsData.dailyData.filter(item => {
        const itemDate = parseISO(item.date);
        return isAfter(itemDate, start) && isBefore(itemDate, end);
      });
    } else {
      // Filter based on timeframe
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      analyticsData.dailyData = analyticsData.dailyData.slice(-days);
    }

    // Filter by state if specified
    if (state) {
      analyticsData.stateData = analyticsData.stateData.filter(item => 
        item.state.toLowerCase() === state.toLowerCase()
      );
    }

    // Filter by sector if specified
    if (sector) {
      analyticsData.sectorData = analyticsData.sectorData.filter(item => 
        item.sector.toLowerCase().includes(sector.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: analyticsData,
      timestamp: new Date().toISOString(),
      filters: {
        timeframe,
        startDate,
        endDate,
        state,
        sector
      }
    });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST endpoint for real-time updates (webhook simulation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data } = body;

    // Simulate processing different types of events
    switch (event) {
      case 'user_registered':
        // In a real app, you would update the database
        console.log('New user registered:', data);
        break;
      case 'application_submitted':
        console.log('New application submitted:', data);
        break;
      case 'internship_completed':
        console.log('Internship completed:', data);
        break;
      default:
        console.log('Unknown event:', event);
    }

    return NextResponse.json({
      success: true,
      message: 'Event processed successfully',
      event,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Analytics event processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process event',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
