"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, CheckCircle, User, GraduationCap, Briefcase, MapPin, Award, Target, Calendar, Building2, Mail, Phone } from "lucide-react";
import { useSession } from "next-auth/react";
import { ProfileStorage, ProfileFormUtils } from "@/lib/profile";
import { GoogleDataExtractor } from "@/lib/googleData";
import { MLService } from "@/lib/mlService";
import { useRouter } from "next/navigation";

interface ResumeData {
  // Personal Information
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  nationality?: string;
  
  // Education
  university?: string;
  degree?: string;
  graduationYear?: string;
  cgpa?: string;
  educationDetails?: string;
  
  // Experience
  experience?: string;
  internships?: string;
  projects?: string;
  
  // Skills & Certifications
  technicalSkills?: string;
  softSkills?: string;
  languages?: string;
  certifications?: string;
  
  // Preferences
  preferredLocation?: string;
  preferredDomain?: string;
  careerObjective?: string;
  
  // Additional
  achievements?: string;
  extracurriculars?: string;
  references?: string;
}

export default function InternshipPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState<ResumeData>({});
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load profile data and auto-fill form
  useEffect(() => {
    const loadProfileData = () => {
      try {
        const userId = session?.user?.email || 'demo@pmis.gov.in';
        const savedProfile = ProfileStorage.getProfileForUser(userId);
        
        if (savedProfile) {
          // Auto-fill form with profile data (only if fields have values)
          const personalData = ProfileFormUtils.getPersonalData(savedProfile);
          const educationData = ProfileFormUtils.getEducationData(savedProfile);
          const professionalData = ProfileFormUtils.getProfessionalData(savedProfile);
          const pmisData = ProfileFormUtils.getPMISData(savedProfile);
          
          const autoFillData: ResumeData = {};
          
          // Only auto-fill if data exists
          if (personalData.firstName && personalData.lastName) {
            autoFillData.name = `${personalData.firstName} ${personalData.lastName}`;
          }
          if (personalData.email) autoFillData.email = personalData.email;
          if (personalData.phone) autoFillData.phone = personalData.phone;
          if (personalData.address) autoFillData.address = personalData.address;
          if (personalData.dateOfBirth) autoFillData.dateOfBirth = personalData.dateOfBirth;
          if (personalData.nationality) autoFillData.nationality = personalData.nationality;
          
          if (educationData.university) autoFillData.university = educationData.university;
          if (educationData.degree) autoFillData.degree = educationData.degree;
          if (educationData.graduationYear) autoFillData.graduationYear = educationData.graduationYear;
          if (educationData.cgpa) autoFillData.cgpa = educationData.cgpa;
          
          if (professionalData.workExperience) autoFillData.experience = professionalData.workExperience;
          if (professionalData.skills.length > 0) autoFillData.technicalSkills = professionalData.skills.join(', ');
          if (professionalData.languages.length > 0) autoFillData.languages = professionalData.languages.join(', ');
          
          if (pmisData.preferredLocation) autoFillData.preferredLocation = pmisData.preferredLocation;
          if (pmisData.careerObjective) autoFillData.careerObjective = pmisData.careerObjective;
          
          setFormData(autoFillData);
          console.log('Form auto-filled with profile data:', autoFillData);
        } else if (session?.user) {
          // If no profile exists, try to use Google data (only if session exists)
          const googleData = GoogleDataExtractor.extractFromSession(session as Record<string, unknown>);
          
          if (googleData.email || googleData.firstName) {
            const googleFillData: ResumeData = {};
            
            if (googleData.email) googleFillData.email = googleData.email;
            if (googleData.firstName && googleData.lastName) {
              googleFillData.name = `${googleData.firstName} ${googleData.lastName}`;
            }
            if (googleData.nationality) googleFillData.nationality = googleData.nationality;
            
            setFormData(googleFillData);
            console.log('Form auto-filled with Google data:', googleFillData);
          }
        }
      } catch (error) {
        console.error('Error loading profile for auto-fill:', error);
      } finally {
        setProfileLoaded(true);
      }
    };

    if (session) {
      loadProfileData();
    } else {
      setProfileLoaded(true);
    }
  }, [session]);

  const extractResumeData = async (file: File): Promise<ResumeData> => {
    console.log('Starting resume extraction for:', file.name, file.type);
    let text = '';

    try {
      if (file.type === 'text/plain') {
        // Simple text file - just read it
        text = await file.text();
        console.log('Read text file, length:', text.length);
      } else if (file.type === 'application/pdf' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For PDF and DOCX, try server-side parsing
        console.log('Attempting server-side parsing...');
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/parse-resume', {
          method: 'POST',
          body: formData
        });
        
        if (response.ok) {
          const data = await response.json();
          text = data.text || '';
          console.log('Server parsing successful, text length:', text.length);
        } else {
          // Surface server error details
          let serverMessage = '';
          try {
            const err = await response.json();
            serverMessage = err?.error || '';
          } catch {}
          const msg = serverMessage || `Server parsing failed (HTTP ${response.status})`;
          throw new Error(msg);
        }
      } else {
        throw new Error('Unsupported file type');
      }

      if (!text || text.trim().length < 10) {
        throw new Error('No text could be extracted from the file');
      }

      // Parse the extracted text
      const parsedData = parseResumeText(text);
      
      // Check if we got any useful data
      const filledFields = Object.values(parsedData).filter(v => v && String(v).trim().length > 0).length;
      if (filledFields === 0) {
        throw new Error('Could not extract any information from the resume');
      }
      
      return parsedData;
    } catch (error) {
      console.error('Resume extraction error:', error);
      throw new Error(`Failed to process resume: ${(error as Error).message}. Please use the text paste option or fill manually.`);
    }
  };


  // Removed - we'll use server-side parsing for PDFs

  // Removed - we'll use server-side parsing for DOCX files

  // Removed - old DOC format not supported

  const parseResumeText = (text: string): ResumeData => {
    const data: ResumeData = {};
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    console.log('Parsing text with', lines.length, 'lines');
    console.log('First few lines:', lines.slice(0, 5));
    
    // Extract email using regex
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.[\w]+/gi);
    if (emailMatch) {
      data.email = emailMatch[0];
      console.log('Found email:', data.email);
    }

    // Extract phone numbers (Indian and international formats)
    const phoneMatch = text.match(/(?:\+91[-\s]?|\+?91)?[6-9]\d{9}|\(\d{3,4}\)\s?\d{6,8}|\d{10,12}/g);
    if (phoneMatch) {
      data.phone = phoneMatch[0].replace(/\s+/g, '').trim();
      console.log('Found phone:', data.phone);
    }

    // Extract name (more intelligent approach)
    const nameCandidate = findName(lines);
    if (nameCandidate) {
      data.name = nameCandidate;
      console.log('Found name:', data.name);
    }

    // Extract address - look for lines with location indicators
    const addressLines = lines.filter(line => {
      const lower = line.toLowerCase();
      return (
        lower.includes('address') || 
        lower.includes('location') || 
        lower.includes('city') || 
        lower.includes('state') ||
        /\b\d{6}\b/.test(line) || // PIN code
        /(mumbai|delhi|bangalore|chennai|hyderabad|pune|kolkata|gurgaon|noida)/i.test(line)
      );
    });
    if (addressLines.length > 0) {
      data.address = addressLines.join(', ');
      console.log('Found address:', data.address);
    }

    // Extract education information
    const educationData = extractEducation(text, lines);
    Object.assign(data, educationData);
    if (educationData.university) console.log('Found university:', educationData.university);

    // Extract graduation year
    const yearMatch = text.match(/(?:graduation|graduated|passing|year)[\s:]*(?:year[\s:]*)?(\d{4})|(\d{4})(?:\s*(?:graduation|graduated|passing|year))/gi);
    if (yearMatch) {
      const year = yearMatch[0].match(/\d{4}/)?.[0];
      if (year && parseInt(year) >= 2000 && parseInt(year) <= 2030) {
        data.graduationYear = year;
        console.log('Found graduation year:', data.graduationYear);
      }
    }

    // Extract CGPA/Percentage with more patterns
    const cgpaMatch = text.match(/(?:cgpa|gpa|percentage|marks)[\s:]*(\d+\.?\d*)(?:\/10|%)?/i);
    if (cgpaMatch) {
      data.cgpa = cgpaMatch[1] + (cgpaMatch[0].includes('%') ? '%' : cgpaMatch[0].includes('/10') ? '/10' : '');
      console.log('Found CGPA:', data.cgpa);
    }

    // Extract various sections with better logging
    const sections = [
      { key: 'technicalSkills', keywords: ['technical skills', 'skills', 'technologies', 'programming languages', 'technical'] },
      { key: 'softSkills', keywords: ['soft skills', 'interpersonal', 'personal skills'] },
      { key: 'experience', keywords: ['work experience', 'experience', 'employment', 'professional experience'] },
      { key: 'internships', keywords: ['internships', 'internship', 'training', 'industrial training'] },
      { key: 'projects', keywords: ['projects', 'project work', 'academic projects', 'personal projects'] },
      { key: 'achievements', keywords: ['achievements', 'awards', 'honors', 'accomplishments', 'recognition'] },
      { key: 'certifications', keywords: ['certifications', 'certificates', 'credentials', 'certification'] },
      { key: 'languages', keywords: ['languages', 'language proficiency', 'linguistic skills'] },
      { key: 'extracurriculars', keywords: ['extracurricular', 'activities', 'volunteer', 'clubs', 'societies'] },
      { key: 'careerObjective', keywords: ['objective', 'career objective', 'summary', 'profile', 'about'] }
    ];

    sections.forEach(section => {
      const extracted = extractSection(text, section.keywords);
      if (extracted) {
        (data as Record<string, unknown>)[section.key] = extracted;
        console.log(`Found ${section.key}:`, extracted.substring(0, 50) + '...');
      }
    });

    // Extract nationality
    const nationalityMatch = text.match(/(?:nationality|citizen)[\s:]*(\w+)/i);
    if (nationalityMatch) {
      data.nationality = nationalityMatch[1];
      console.log('Found nationality:', data.nationality);
    }

    // Extract date of birth
    const dobMatch = text.match(/(?:birth|born|dob)[\s:]*(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4})/i);
    if (dobMatch) {
      data.dateOfBirth = dobMatch[1];
      console.log('Found DOB:', data.dateOfBirth);
    }

    console.log('Final parsed data:', data);
    return data;
  };

  const findName = (lines: string[]): string | undefined => {
    // Look for name in first few lines, avoiding common resume headers
    const skipPatterns = ['resume', 'cv', 'curriculum vitae', '@', 'phone', 'email', 'address'];
    
    for (let i = 0; i < Math.min(5, lines.length); i++) {
      const line = lines[i];
      
      // Skip if line contains common non-name patterns
      if (skipPatterns.some(pattern => line.toLowerCase().includes(pattern))) {
        continue;
      }
      
      // Check if line looks like a name (2-4 words, reasonable length)
      const words = line.split(/\s+/);
      if (words.length >= 2 && words.length <= 4 && line.length < 50) {
        // Check if all words start with capital letter
        if (words.every(word => /^[A-Z][a-z]+$/.test(word))) {
          return line;
        }
      }
    }
    
    return undefined;
  };

  const extractEducation = (text: string, lines: string[]) => {
    const educationData: Partial<ResumeData> = {};
    
    // Education keywords
    const eduKeywords = ['university', 'college', 'institute', 'school', 'bachelor', 'master', 'degree', 'b.tech', 'b.e.', 'mca', 'mba', 'b.sc', 'm.sc', 'bca'];
    
    const educationLines = lines.filter(line => 
      eduKeywords.some(keyword => line.toLowerCase().includes(keyword))
    );
    
    if (educationLines.length > 0) {
      // Try to identify university/college name
      const universityLine = educationLines.find(line => 
        /(?:university|college|institute)/i.test(line)
      );
      if (universityLine) {
        educationData.university = universityLine;
      }
      
      // Try to identify degree
      const degreeLine = educationLines.find(line => 
        /(?:bachelor|master|b\.tech|b\.e\.|mca|mba|b\.sc|m\.sc|bca)/i.test(line)
      );
      if (degreeLine) {
        educationData.degree = degreeLine;
      }
      
      educationData.educationDetails = educationLines.join('\n');
    }
    
    return educationData;
  };

  const extractSection = (text: string, keywords: string[]): string | undefined => {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    let sectionStart = -1;
    let sectionEnd = -1;

    console.log(`Looking for section with keywords: ${keywords.join(', ')}`);

    // Find section start - look for lines that contain any of the keywords
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      
      // Check if line starts with or contains the keyword (section header)
      if (keywords.some(keyword => {
        const keywordLower = keyword.toLowerCase();
        return line === keywordLower || 
               line.startsWith(keywordLower) || 
               (line.includes(keywordLower) && line.length < 50); // Likely a section header
      })) {
        sectionStart = i;
        console.log(`Found section start at line ${i}: "${lines[i]}"`);
        break;
      }
    }

    if (sectionStart === -1) {
      console.log(`No section found for keywords: ${keywords.join(', ')}`);
      return undefined;
    }

    // Find section end (next major section or end of document)
    const majorSectionKeywords = [
      'education', 'experience', 'skills', 'projects', 'achievements', 
      'contact', 'objective', 'summary', 'certifications', 'languages',
      'extracurricular', 'references', 'personal', 'work', 'internship'
    ];
    
    for (let i = sectionStart + 1; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      
      // Check if this line starts a new major section
      const isNewSection = majorSectionKeywords.some(section => {
        return line === section || 
               line.startsWith(section) || 
               (line.includes(section) && line.length < 50);
      });
      
      // Make sure it's not part of the current section
      const isCurrentSection = keywords.some(keyword => 
        line.includes(keyword.toLowerCase())
      );
      
      if (isNewSection && !isCurrentSection) {
        sectionEnd = i;
        console.log(`Found section end at line ${i}: "${lines[i]}"`);
        break;
      }
    }

    if (sectionEnd === -1) sectionEnd = lines.length;

    const sectionContent = lines.slice(sectionStart + 1, sectionEnd)
      .filter(line => line.length > 0 && !line.toLowerCase().includes('section'))
      .join('\n');

    console.log(`Extracted section content (${sectionContent.length} chars):`, sectionContent.substring(0, 100));
    
    return sectionContent.length > 0 ? sectionContent : undefined;
  };

  const processFile = async (file: File) => {
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF, Word document, or text file (.txt)");
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);
    setIsProcessed(false);

    try {
      const extractedData = await extractResumeData(file);
      setFormData(extractedData);
      setIsProcessed(true);
      
      // Count how many fields were filled
      const filledFields = Object.values(extractedData).filter(value => value && String(value).trim().length > 0).length;
      if (filledFields > 0) {
        console.log(`Successfully filled ${filledFields} fields:`, extractedData);
      }
    } catch (error) {
      console.error("Resume processing error:", error);
      const errorMessage = (error as Error).message;
      let userMessage = "Error processing resume: " + errorMessage;
      
      // Provide more specific error messages
      if (errorMessage.includes("Load failed")) {
        userMessage = "Error processing resume: File upload failed. Please check your internet connection and try again, or use the 'Paste Resume Text' option below.";
      } else if (errorMessage.includes("Unsupported file type")) {
        userMessage = "Error processing resume: Unsupported file type. Please upload PDF, DOC, DOCX, or TXT files only.";
      } else if (errorMessage.includes("File too large")) {
        userMessage = "Error processing resume: File is too large. Please upload a file smaller than 5MB.";
      }
      
      alert(userMessage + "\n\nPlease use the 'Paste Resume Text' option below or fill the form manually.");
      setIsProcessed(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file) {
      processFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleInputChange = (field: keyof ResumeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.email) {
      alert("Please log in to get recommendations");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Transform form data to ML API format
      const studentProfile = MLService.transformInternFormToProfile(
        formData,
        session.user.email
      );

      // Validate required fields
      if (!studentProfile.name || !studentProfile.email) {
        alert("Please fill in your name and email to get recommendations");
        setIsSubmitting(false);
        return;
      }

      // Store the student profile for recommendations page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('student_profile', JSON.stringify(studentProfile));
        sessionStorage.setItem('intern_form_data', JSON.stringify(formData));
      }

      // Navigate to recommendations page
      router.push('/internship/recommendations');
      
    } catch (error) {
      console.error('Failed to process application:', error);
      alert("Failed to process your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 md:px-6">
        {/* Profile Auto-fill Notification */}
        {profileLoaded && formData.name && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <div>
                <h3 className="text-sm font-medium text-green-800">Profile Data Auto-filled!</h3>
                <p className="text-sm text-green-700">
                  Your profile information has been automatically filled in the form below. 
                  You can still modify any fields as needed.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Google Data Auto-fill Notification */}
        {profileLoaded && formData.email && !formData.name && session && GoogleDataExtractor.isGoogleUser(session) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <svg className="w-3 h-3 text-blue-600" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-blue-800">Google Account Data Auto-filled!</h3>
                <p className="text-sm text-blue-700">
                  Your Google account information has been automatically filled. 
                  Complete your profile for more auto-fill options.
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gov-navy mb-4">PM Internship Portal</h1>
            <p className="text-lg text-gov-text max-w-3xl mx-auto">
              Upload your resume to automatically populate all sections below, or fill them manually. Complete your profile to apply for internships.
            </p>
          </div>

          {/* Resume Upload Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Smart Resume Upload
              </CardTitle>
              <CardDescription>
                Upload your resume to automatically fill all sections below. We&apos;ll extract and organize your information across Personal Details, Education, Experience, Skills, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={() => setIsDragActive(true)}
                onDragLeave={() => setIsDragActive(false)}
                role="button"
                tabIndex={0}
                aria-label="Upload resume file by dragging and dropping or clicking to select"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('file-input')?.click();
                  }
                }}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 ${
                  isDragActive
                    ? 'border-gov-saffron bg-gov-saffron/5'
                    : isProcessed
                    ? 'border-green-400 bg-green-50'
                    : 'border-gray-300 hover:border-gov-saffron hover:bg-gov-saffron/5'
                }`}
              >
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileInput}
                    className="hidden"
                    id="resume-upload"
                  />
                
          {isProcessing ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gov-saffron mb-4"></div>
              <p className="text-gov-navy font-medium text-lg">Analyzing your resume...</p>
              <p className="text-sm text-gray-600 mt-2">Extracting personal details, education, experience, skills, and more</p>
              <p className="text-xs text-gray-500 mt-2">This may take up to 15 seconds</p>
              <button 
                onClick={() => {
                  setIsProcessing(false);
                  setIsProcessed(false);
                  alert('Processing cancelled. You can fill the form manually.');
                }}
                className="mt-4 h-9 rounded-md px-3 border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium"
              >
                <span>Cancel & Fill Manually</span>
              </button>
            </div>
                ) : isProcessed ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                    <p className="text-green-700 font-medium text-lg">Resume processed successfully!</p>
                    <p className="text-sm text-gray-600 mt-2">All sections below have been auto-filled with your information</p>
                    <button 
                      onClick={() => {setIsProcessed(false); setUploadedFile(null); setFormData({});}}
                      className="mt-4 border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2"
                    >
                      <span>Upload Different Resume</span>
                    </button>
                  </div>
                ) : (
                  <label htmlFor="resume-upload" className="flex flex-col items-center cursor-pointer">
                    <FileText className="h-16 w-16 text-gray-400 mb-4" />
                    {isDragActive ? (
                      <p className="text-gov-navy font-medium text-lg">Drop your resume here</p>
                    ) : (
                      <>
                        <p className="text-gov-navy font-medium mb-2 text-lg">
                          Drag & drop your resume here, or click to browse
                        </p>
                        <p className="text-sm text-gray-600">
                          Supports PDF, DOC, DOCX, TXT (max 5MB) • Auto-fills all sections below
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Having trouble? Try copying your resume text into the form sections manually
                        </p>
                      </>
                    )}
                  </label>
                )}
              </div>

              {uploadedFile && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
                  <FileText className="h-6 w-6 text-gov-navy" />
                  <div className="flex-1">
                    <p className="font-medium">{uploadedFile.name}</p>
                    <p className="text-sm text-gray-600">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  {isProcessed && <CheckCircle className="h-6 w-6 text-green-500" />}
                </div>
              )}

              {/* Alternative: Paste Resume Text */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-medium text-gov-navy mb-3">Alternative: Paste Resume Text</h4>
                <Textarea
                  placeholder="Copy and paste your resume text here for quick auto-fill..."
                  rows={4}
                  className="mb-3"
                  id="resume-text-input"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const textArea = document.getElementById('resume-text-input') as HTMLTextAreaElement;
                      if (textArea && textArea.value.trim()) {
                        setIsProcessing(true);
                        try {
                          const parsedData = parseResumeText(textArea.value);
                          const filledFields = Object.values(parsedData).filter(value => value && String(value).trim().length > 0).length;
                          if (filledFields > 0) {
                            setFormData(parsedData);
                            setIsProcessed(true);
                            console.log(`Filled ${filledFields} fields from pasted text:`, parsedData);
                          } else {
                            alert('Could not extract any information from the text. Please check the format and try again.');
                          }
                        } catch (error) {
                          console.error('Text parsing error:', error);
                          alert('Error processing text. Please try again.');
                        } finally {
                          setIsProcessing(false);
                        }
                      } else {
                        alert('Please paste some resume text first.');
                      }
                    }}
                    className="flex-1 border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2"
                  >
                    <span>Process Text & Auto-Fill</span>
                  </button>
                  <button
                    onClick={async () => {
                      // Load test resume for demonstration
                      try {
                        const response = await fetch('/test-resume.txt');
                        const testText = await response.text();
                        const textArea = document.getElementById('resume-text-input') as HTMLTextAreaElement;
                        if (textArea) {
                          textArea.value = testText;
                        }
                      } catch {
                        // Fallback test data
                        const testData = `John Doe
Software Developer
john.doe@email.com
+91 9876543210
123 Main Street, Bangalore, Karnataka, India

OBJECTIVE
Seeking opportunities to apply my technical skills in software development.

EDUCATION
Indian Institute of Technology, Delhi
Bachelor of Technology in Computer Science Engineering
Graduation Year: 2024
CGPA: 8.5/10

TECHNICAL SKILLS
Programming Languages: Python, Java, JavaScript, C++
Web Technologies: React, Node.js, HTML, CSS, MongoDB

EXPERIENCE
Software Development Intern at Infosys Limited
Duration: May 2023 - August 2023
- Developed web applications using React and Node.js

PROJECTS
E-commerce Platform - Full stack web application using MERN stack

ACHIEVEMENTS
Winner of Inter-College Coding Competition 2023`;
                        
                        const textArea = document.getElementById('resume-text-input') as HTMLTextAreaElement;
                        if (textArea) {
                          textArea.value = testData;
                        }
                      }
                    }}
                    className="h-9 rounded-md px-3 border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200 inline-flex items-center justify-center whitespace-nowrap text-sm font-medium"
                  >
                    <span>Load Sample</span>
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comprehensive Profile Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Complete Profile
              </CardTitle>
              <CardDescription>
                {isProcessed 
                  ? "Review and edit the auto-filled information from your resume" 
                  : "Fill in your details manually or upload a resume to auto-populate"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  <TabsTrigger value="additional">Additional</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <User className="h-5 w-5 text-gov-navy" />
                    <h3 className="text-xl font-semibold text-gov-navy">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your full name"
                        required
                        aria-describedby="name-error"
                        aria-invalid={!formData.name ? 'true' : 'false'}
                      />
                      {!formData.name && (
                        <p id="name-error" className="text-sm text-red-600" role="alert">
                          Full name is required
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                        aria-describedby="email-error"
                        aria-invalid={!formData.email ? 'true' : 'false'}
                      />
                      {!formData.email && (
                        <p id="email-error" className="text-sm text-red-600" role="alert">
                          Email address is required
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date of Birth
                      </Label>
                      <Input
                        id="dateOfBirth"
                        value={formData.dateOfBirth || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        placeholder="Enter your date of birth"
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address" className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        placeholder="Enter your complete address"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Input
                        id="nationality"
                        value={formData.nationality || ''}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        placeholder="Enter your nationality"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="education" className="space-y-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="h-5 w-5 text-gov-navy" />
                    <h3 className="text-xl font-semibold text-gov-navy">Education Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="university">University/College *</Label>
                      <Input
                        id="university"
                        value={formData.university || ''}
                        onChange={(e) => handleInputChange('university', e.target.value)}
                        placeholder="Enter your university/college"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="degree">Degree/Program *</Label>
                      <Input
                        id="degree"
                        value={formData.degree || ''}
                        onChange={(e) => handleInputChange('degree', e.target.value)}
                        placeholder="e.g., B.Tech Computer Science"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="graduationYear">Graduation Year *</Label>
                      <Input
                        id="graduationYear"
                        value={formData.graduationYear || ''}
                        onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                        placeholder="e.g., 2024"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cgpa">CGPA/Percentage</Label>
                      <Input
                        id="cgpa"
                        value={formData.cgpa || ''}
                        onChange={(e) => handleInputChange('cgpa', e.target.value)}
                        placeholder="e.g., 8.5/10 or 85%"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="educationDetails">Education Details</Label>
                    <Textarea
                      id="educationDetails"
                      value={formData.educationDetails || ''}
                      onChange={(e) => handleInputChange('educationDetails', e.target.value)}
                      placeholder="Describe your educational background, relevant coursework, academic achievements"
                      rows={4}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="h-5 w-5 text-gov-navy" />
                    <h3 className="text-xl font-semibold text-gov-navy">Experience & Projects</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="experience">Work Experience</Label>
                      <Textarea
                        id="experience"
                        value={formData.experience || ''}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                        placeholder="Describe your work experience, roles, and responsibilities"
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="internships">Previous Internships</Label>
                      <Textarea
                        id="internships"
                        value={formData.internships || ''}
                        onChange={(e) => handleInputChange('internships', e.target.value)}
                        placeholder="List your previous internships with company names, duration, and key learnings"
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="projects">Projects</Label>
                      <Textarea
                        id="projects"
                        value={formData.projects || ''}
                        onChange={(e) => handleInputChange('projects', e.target.value)}
                        placeholder="Describe your key projects, technologies used, and outcomes"
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-gov-navy" />
                    <h3 className="text-xl font-semibold text-gov-navy">Skills & Certifications</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="technicalSkills">Technical Skills</Label>
                      <Textarea
                        id="technicalSkills"
                        value={formData.technicalSkills || ''}
                        onChange={(e) => handleInputChange('technicalSkills', e.target.value)}
                        placeholder="List your technical skills: programming languages, frameworks, tools, technologies"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="softSkills">Soft Skills</Label>
                      <Textarea
                        id="softSkills"
                        value={formData.softSkills || ''}
                        onChange={(e) => handleInputChange('softSkills', e.target.value)}
                        placeholder="List your soft skills: leadership, communication, teamwork, problem-solving"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages</Label>
                      <Textarea
                        id="languages"
                        value={formData.languages || ''}
                        onChange={(e) => handleInputChange('languages', e.target.value)}
                        placeholder="List languages you speak and proficiency levels"
                        rows={2}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications</Label>
                      <Textarea
                        id="certifications"
                        value={formData.certifications || ''}
                        onChange={(e) => handleInputChange('certifications', e.target.value)}
                        placeholder="List your professional certifications, courses completed, and credentials"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-gov-navy" />
                    <h3 className="text-xl font-semibold text-gov-navy">Preferences & Objectives</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="careerObjective">Career Objective</Label>
                      <Textarea
                        id="careerObjective"
                        value={formData.careerObjective || ''}
                        onChange={(e) => handleInputChange('careerObjective', e.target.value)}
                        placeholder="Describe your career goals and what you hope to achieve through this internship"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="preferredLocation">Preferred Location</Label>
                        <Input
                          id="preferredLocation"
                          value={formData.preferredLocation || ''}
                          onChange={(e) => handleInputChange('preferredLocation', e.target.value)}
                          placeholder="e.g., Delhi, Mumbai, Bangalore, Remote"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="preferredDomain">Preferred Domain</Label>
                        <Input
                          id="preferredDomain"
                          value={formData.preferredDomain || ''}
                          onChange={(e) => handleInputChange('preferredDomain', e.target.value)}
                          placeholder="e.g., Software Development, Data Science, Marketing"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="additional" className="space-y-6 mt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-gov-navy" />
                    <h3 className="text-xl font-semibold text-gov-navy">Additional Information</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="achievements">Achievements & Awards</Label>
                      <Textarea
                        id="achievements"
                        value={formData.achievements || ''}
                        onChange={(e) => handleInputChange('achievements', e.target.value)}
                        placeholder="List your achievements, awards, recognitions, and notable accomplishments"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="extracurriculars">Extracurricular Activities</Label>
                      <Textarea
                        id="extracurriculars"
                        value={formData.extracurriculars || ''}
                        onChange={(e) => handleInputChange('extracurriculars', e.target.value)}
                        placeholder="Describe your involvement in clubs, societies, volunteer work, sports, etc."
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="references">References</Label>
                      <Textarea
                        id="references"
                        value={formData.references || ''}
                        onChange={(e) => handleInputChange('references', e.target.value)}
                        placeholder="Provide professional or academic references with contact information"
                        rows={3}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 pt-6 border-t">
                <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gov-saffron hover:bg-gov-saffron/80 text-white h-11 rounded-md px-8 inline-flex items-center justify-center text-sm font-medium disabled:opacity-50"
                >
                  <span className="inline-flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Getting AI Recommendations...
                      </>
                    ) : (
                      "Get AI-Powered Internship Recommendations"
                    )}
                  </span>
                </button>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {isSubmitting 
                    ? "Processing your profile with AI to find the best internship matches..."
                    : "Your profile will be analyzed by AI to recommend the best internship opportunities"
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
