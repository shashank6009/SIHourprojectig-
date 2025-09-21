# ML Model Field Labels and Examples

## 🔴 CRITICAL FIELDS (Add First)

### 1. Application Deadlines
**Label:** `application_deadline`
**Type:** `DATE`
**Format:** `YYYY-MM-DD`
**Examples:**
```json
{
  "application_deadline": "2024-03-15",
  "application_deadline": "2024-12-31",
  "application_deadline": "2024-06-30"
}
```
**Real Sources:** Company career pages, LinkedIn job postings, Indeed listings

### 2. Company Employee Count
**Label:** `employee_count`
**Type:** `INTEGER`
**Format:** Number of employees
**Examples:**
```json
{
  "employee_count": 15000,
  "employee_count": 250,
  "employee_count": 500000
}
```
**Real Sources:** LinkedIn company pages, company websites, Crunchbase

### 3. Application Status
**Label:** `is_currently_accepting`
**Type:** `BOOLEAN`
**Format:** `true`/`false`
**Examples:**
```json
{
  "is_currently_accepting": true,
  "is_currently_accepting": false
}
```
**Real Sources:** Live job posting status, company career page availability

## 🟡 IMPORTANT FIELDS (Add Next)

### 4. Application Statistics
**Label:** `application_stats`
**Type:** `OBJECT`
**Format:** Nested object with multiple fields
**Examples:**
```json
{
  "application_stats": {
    "total_applicants": 450,
    "positions_available": 8,
    "selection_ratio": 0.018,
    "applications_from_tier1": 180,
    "applications_from_tier2": 200,
    "applications_from_tier3": 70
  }
}
```
**Real Sources:** Company HR data, job portal analytics, placement cell records

### 5. Success Score Breakdown
**Label:** `success_breakdown`
**Type:** `OBJECT`
**Format:** Detailed probability components
**Examples:**
```json
{
  "success_breakdown": {
    "skills_match_score": 0.85,
    "experience_score": 0.75,
    "location_preference_score": 0.90,
    "academic_fit_score": 0.88,
    "college_tier_advantage": 0.15,
    "cgpa_score": 0.82,
    "project_relevance_score": 0.78
  }
}
```
**Real Sources:** Historical placement data, ML model analysis, success pattern recognition

### 6. Enhanced Course Data
**Label:** `enhanced_courses`
**Type:** `ARRAY`
**Format:** Array of course objects
**Examples:**
```json
{
  "enhanced_courses": [
    {
      "skill": "React",
      "platform": "Coursera",
      "course_name": "React Fundamentals",
      "link": "https://coursera.org/learn/react-fundamentals",
      "duration_weeks": 4,
      "difficulty": "beginner",
      "success_boost_percentage": 12,
      "completion_rate": 0.78,
      "rating": 4.6,
      "cost": "Free",
      "certificate_available": true
    },
    {
      "skill": "Machine Learning",
      "platform": "edX",
      "course_name": "Introduction to Machine Learning",
      "link": "https://edx.org/course/introduction-machine-learning",
      "duration_weeks": 8,
      "difficulty": "intermediate",
      "success_boost_percentage": 18,
      "completion_rate": 0.65,
      "rating": 4.4,
      "cost": "$99",
      "certificate_available": true
    }
  ]
}
```
**Real Sources:** Course platform APIs, student feedback, completion data

## 🟢 NICE-TO-HAVE FIELDS (Future)

### 7. Interview Process Details
**Label:** `interview_details`
**Type:** `OBJECT`
**Format:** Interview process information
**Examples:**
```json
{
  "interview_details": {
    "interview_type": "virtual",
    "interview_rounds": 3,
    "interview_duration_minutes": 45,
    "interview_topics": ["Technical", "Behavioral", "HR"],
    "preparation_tips": [
      "Review data structures and algorithms",
      "Prepare STAR method examples",
      "Research company culture"
    ],
    "typical_timeline_days": 14
  }
}
```
**Real Sources:** Glassdoor interview reviews, company career pages, alumni feedback

### 8. Real-time Application Counts
**Label:** `live_stats`
**Type:** `OBJECT`
**Format:** Live updating statistics
**Examples:**
```json
{
  "live_stats": {
    "spots_remaining": 3,
    "applications_today": 12,
    "urgency_level": "high",
    "last_updated": "2024-01-20T10:30:00Z",
    "trend": "increasing"
  }
}
```
**Real Sources:** Real-time job portal APIs, company application tracking systems

### 9. Alumni Success Stories
**Label:** `similar_profiles`
**Type:** `ARRAY`
**Format:** Array of success story objects
**Examples:**
```json
{
  "similar_profiles": [
    {
      "profile_id": "alumni_001",
      "college_tier": "Tier-1",
      "cgpa": 8.5,
      "skills": ["Python", "React", "SQL"],
      "outcome": "selected",
      "interview_feedback": "Strong technical skills, good communication",
      "preparation_tips": ["Focused on system design", "Practiced coding daily"]
    }
  ]
}
```
**Real Sources:** Alumni networks, placement cell records, LinkedIn career progression

## 📊 COMPANY METADATA FIELDS

### Company Basic Information
**Label:** `company_metadata`
**Type:** `OBJECT`
**Format:** Company details
**Examples:**
```json
{
  "company_metadata": {
    "founded_year": 2010,
    "headquarters": "Bangalore, India",
    "company_tier": "tier1",
    "industry": "Technology",
    "company_size": "Large",
    "website": "https://company.com",
    "linkedin_url": "https://linkedin.com/company/company-name",
    "glassdoor_rating": 4.2,
    "glassdoor_reviews_count": 1250
  }
}
```

### Company Hiring Patterns
**Label:** `hiring_patterns`
**Type:** `OBJECT`
**Format:** Historical hiring data
**Examples:**
```json
{
  "hiring_patterns": {
    "hiring_rate_percentage": 85,
    "average_response_time_days": 7,
    "preferred_colleges": ["IIT", "NIT", "IIIT"],
    "preferred_streams": ["Computer Science", "Information Technology"],
    "minimum_cgpa": 7.0,
    "typical_internship_duration_months": 2
  }
}
```

## 🎯 STUDENT PROFILE ENHANCEMENT

### Enhanced Student Profile Fields
**Label:** `enhanced_student_profile`
**Type:** `OBJECT`
**Format:** Detailed student information
**Examples:**
```json
{
  "enhanced_student_profile": {
    "student_id": "STU_001",
    "college_tier": "Tier-1",
    "stream": "Computer Science",
    "cgpa": 8.5,
    "skills": ["Python", "React", "SQL", "Machine Learning"],
    "projects": [
      {
        "title": "E-commerce Website",
        "technologies": ["React", "Node.js", "MongoDB"],
        "duration_months": 3,
        "github_url": "https://github.com/user/ecommerce"
      }
    ],
    "internships": [
      {
        "company": "Tech Corp",
        "role": "Frontend Developer",
        "duration_months": 2,
        "stipend": 15000
      }
    ],
    "certifications": [
      {
        "name": "AWS Cloud Practitioner",
        "issuer": "Amazon",
        "date": "2023-12-01"
      }
    ],
    "location_preference": ["Bangalore", "Mumbai", "Remote"],
    "availability_start_date": "2024-06-01"
  }
}
```

## 🔄 DATA VALIDATION EXAMPLES

### Field Validation Rules
```json
{
  "validation_rules": {
    "application_deadline": {
      "type": "date",
      "format": "YYYY-MM-DD",
      "min_date": "today",
      "max_date": "2025-12-31"
    },
    "employee_count": {
      "type": "integer",
      "min": 1,
      "max": 10000000
    },
    "success_prob": {
      "type": "float",
      "min": 0.0,
      "max": 1.0
    },
    "stipend": {
      "type": "integer",
      "min": 0,
      "max": 100000
    }
  }
}
```

## 📝 API RESPONSE FORMAT

### Complete Enhanced Response
```json
{
  "student_id": "STU_001",
  "total_recommendations": 5,
  "recommendations": [
    {
      "internship_id": "INT_001",
      "title": "Data Analyst Intern",
      "organization_name": "TechCorp India",
      "domain": "Data Science",
      "location": "Bangalore",
      "duration": "2 months",
      "stipend": 25000,
      "success_prob": 0.85,
      "missing_skills": ["Tableau", "Power BI"],
      "courses": ["Data Visualization with Tableau"],
      "reasons": ["Strong Python skills", "Good academic record"],
      
      // NEW ENHANCED FIELDS
      "application_deadline": "2024-03-15",
      "is_currently_accepting": true,
      "company_metadata": {
        "employee_count": 15000,
        "founded_year": 2010,
        "headquarters": "Bangalore, India",
        "company_tier": "tier1"
      },
      "application_stats": {
        "total_applicants": 450,
        "positions_available": 8,
        "selection_ratio": 0.018
      },
      "success_breakdown": {
        "skills_match_score": 0.85,
        "experience_score": 0.75,
        "location_preference_score": 0.90,
        "academic_fit_score": 0.88
      },
      "enhanced_courses": [
        {
          "skill": "Tableau",
          "platform": "Coursera",
          "course_name": "Tableau for Data Visualization",
          "duration_weeks": 4,
          "difficulty": "beginner",
          "success_boost_percentage": 15
        }
      ],
      "interview_details": {
        "interview_type": "virtual",
        "interview_rounds": 3,
        "interview_duration_minutes": 45
      },
      "live_stats": {
        "spots_remaining": 3,
        "urgency_level": "high",
        "last_updated": "2024-01-20T10:30:00Z"
      }
    }
  ]
}
```

## 🛠️ IMPLEMENTATION NOTES

### Database Schema Updates
```sql
-- Add new columns to existing internships table
ALTER TABLE internships ADD COLUMN application_deadline DATE;
ALTER TABLE internships ADD COLUMN employee_count INTEGER;
ALTER TABLE internships ADD COLUMN is_currently_accepting BOOLEAN DEFAULT true;
ALTER TABLE internships ADD COLUMN application_stats JSON;
ALTER TABLE internships ADD COLUMN success_breakdown JSON;
ALTER TABLE internships ADD COLUMN enhanced_courses JSON;
ALTER TABLE internships ADD COLUMN interview_details JSON;
ALTER TABLE internships ADD COLUMN live_stats JSON;

-- Create new company metadata table
CREATE TABLE company_metadata (
    organization_name VARCHAR(255) PRIMARY KEY,
    founded_year INTEGER,
    headquarters VARCHAR(255),
    company_tier VARCHAR(10),
    industry VARCHAR(100),
    website VARCHAR(500),
    linkedin_url VARCHAR(500),
    glassdoor_rating DECIMAL(3,2),
    glassdoor_reviews_count INTEGER,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Data Sources Priority
1. **LinkedIn Jobs API** - Application deadlines, company info
2. **Company Career Pages** - Direct scraping for accuracy
3. **Glassdoor API** - Company reviews, interview data
4. **Placement Cell Records** - Historical success data
5. **Alumni Networks** - Success stories and feedback

This comprehensive reference should help you implement each field with proper labels, types, and real-world examples!
