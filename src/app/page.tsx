"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, School, Globe2, ChevronRight, User, Building, GraduationCap, FileText } from "lucide-react";
import Image from "next/image";
import { i18n, type Language } from "@/lib/i18n";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [language] = useState<Language>("en");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const strings = i18n[language];

  useEffect(() => {
    setMounted(true);
  }, []);

  const images = [
    { src: "/Modi1.png", alt: "Prime Minister Narendra Modi" },
    { src: "/Modi2.png", alt: "Prime Minister Narendra Modi" },
    { src: "/Modi3.png", alt: "Prime Minister Narendra Modi" },
  ];

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    if (!mounted) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, mounted]);

  // Always render the same structure to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        <section className="relative overflow-hidden">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gov-saffron mx-auto mb-4"></div>
              <p className="text-gov-navy text-lg">Loading...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Hero Video Section */}
      <section className="relative overflow-hidden">
        <video
          className="w-full h-[60vh] md:h-[70vh] object-cover"
          src="/home.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="PMIS hero video"
        />
      </section>

      {/* Companies Video Section - No Gap */}
      <section className="py-2 bg-white companies-video-section">
        <div className="container mx-auto px-4 md:px-6">
          <video
            className="w-full h-16 md:h-20 lg:h-24 rounded-lg shadow-sm object-cover"
            src="/companies.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            aria-label="Companies showcase video"
          />
        </div>
      </section>

      {/* Page Below Image Section */}
      <section className="relative bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative w-full max-w-6xl mx-auto">
            <Image
              src="/pagebelow.png"
              alt="PMIS Information Section"
              width={1920}
              height={800}
              className="w-full h-auto object-contain rounded-lg shadow-md"
              priority
            />
            
            {/* Interactive overlay areas - adjusted for contained image */}
            <div className="absolute inset-0">
              {/* Left Section - "Are you Eligible?" */}
              <div className="absolute top-[8%] left-[8%] w-[35%] h-[85%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-gov-saffron/15 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-gov-saffron/60"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-3 rounded-lg shadow-lg text-center">
                    <h3 className="font-bold text-gov-navy text-sm mb-1">Check Eligibility</h3>
                    <p className="text-xs text-gov-text">See if you qualify for PM Internship</p>
                    <div className="mt-1 text-xs text-gov-darkGray">
                      • Age: 21-24 Years<br/>
                      • Job Status: Not Employed Full Time<br/>
                      • Education: Not Enrolled Full Time
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Section - "Core Benefits for PM Internship Scheme" */}
              <div className="absolute top-[8%] left-[57%] w-[35%] h-[85%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-gov-saffron/15 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-gov-saffron/60"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-3 rounded-lg shadow-lg text-center">
                    <h3 className="font-bold text-gov-navy text-sm mb-1">Program Benefits</h3>
                    <p className="text-xs text-gov-text">Core benefits of PM Internship Scheme</p>
                    <div className="mt-1 text-xs text-gov-darkGray">
                      • 12 months real-life experience<br/>
                      • Monthly assistance of ₹4500 + ₹500<br/>
                      • One-time Grant of ₹6000<br/>
                      • Top Companies across sectors
                    </div>
                  </div>
                </div>
              </div>

              {/* Age criteria hover area */}
              <div className="absolute top-[28%] left-[18%] w-[15%] h-[20%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-blue-200/30 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-blue-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-2 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-blue-700 text-xs">Age Requirement</h4>
                    <p className="text-xs text-gray-600">Must be 21-24 years old</p>
                  </div>
                </div>
              </div>

              {/* Job Status hover area */}
              <div className="absolute top-[28%] left-[28%] w-[15%] h-[20%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-orange-200/30 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-orange-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-2 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-orange-700 text-xs">Employment Status</h4>
                    <p className="text-xs text-gray-600">Not employed full time</p>
                  </div>
                </div>
              </div>

              {/* Education Status hover area */}
              <div className="absolute top-[52%] left-[18%] w-[15%] h-[20%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-purple-200/30 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-purple-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-2 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-purple-700 text-xs">Education Status</h4>
                    <p className="text-xs text-gray-600">Not enrolled full time</p>
                  </div>
                </div>
              </div>

              {/* Family Income hover area */}
              <div className="absolute top-[52%] left-[28%] w-[15%] h-[20%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-teal-200/30 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-teal-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-2 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-teal-700 text-xs">Family Income</h4>
                    <p className="text-xs text-gray-600">Income criteria apply</p>
                  </div>
                </div>
              </div>

              {/* Real-life experience hover area */}
              <div className="absolute top-[28%] left-[67%] w-[20%] h-[20%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-green-200/30 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-green-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-2 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-green-700 text-xs">Experience</h4>
                    <p className="text-xs text-gray-600">12 months in top companies</p>
                  </div>
                </div>
              </div>

              {/* Monthly assistance hover area */}
              <div className="absolute top-[28%] left-[72%] w-[20%] h-[20%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-yellow-200/30 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-yellow-500"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-2 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-yellow-700 text-xs">Monthly Support</h4>
                    <p className="text-xs text-gray-600">₹4500 by Govt + ₹500 by Industry</p>
                  </div>
                </div>
              </div>

              {/* One-time grant hover area */}
              <div className="absolute top-[52%] left-[67%] w-[20%] h-[20%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-red-200/30 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-red-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-2 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-red-700 text-xs">One-time Grant</h4>
                    <p className="text-xs text-gray-600">₹6000 for incidentals</p>
                  </div>
                </div>
              </div>

              {/* Company selection hover area */}
              <div className="absolute top-[52%] left-[72%] w-[20%] h-[20%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-indigo-200/30 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-indigo-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-2 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-indigo-700 text-xs">Company Selection</h4>
                    <p className="text-xs text-gray-600">Various sectors & top companies</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Below Page Below Image Section */}
      <section className="relative bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative w-full max-w-6xl mx-auto">
            <Image
              src="/belowpagebelow.png"
              alt="PM Internship States Information"
              width={1920}
              height={800}
              className="w-full h-auto object-contain rounded-lg shadow-md"
              priority
            />
            
            {/* Interactive overlay areas for states - positioned to match India map */}
            <div className="absolute inset-0">
              {/* Dashboard section hover - right side */}
              <div className="absolute top-[25%] left-[65%] w-[30%] h-[60%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-gov-saffron/15 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-gov-saffron/60"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-3 rounded-lg shadow-lg text-center">
                    <h3 className="font-bold text-gov-navy text-sm">Dashboard Statistics</h3>
                    <p className="text-xs text-gov-text">118K+ Internship Opportunities<br/>25 Sectors • 36 States/UTs<br/>734 Districts • 5 Qualifications</p>
                  </div>
                </div>
              </div>

              {/* India Map - Left side with actual state positions */}
              
              {/* Kashmir/J&K - Top of map */}
              <div className="absolute top-[15%] left-[18%] w-[8%] h-[8%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-blue-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-blue-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-blue-700 text-xs">J&K</h4>
                  </div>
                </div>
              </div>

              {/* Punjab - Northwest */}
              <div className="absolute top-[22%] left-[14%] w-[6%] h-[6%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-green-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-green-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-green-700 text-xs">Punjab</h4>
                  </div>
                </div>
              </div>

              {/* Haryana & Delhi - North central */}
              <div className="absolute top-[25%] left-[17%] w-[6%] h-[6%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-orange-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-orange-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-orange-700 text-xs">Haryana</h4>
                  </div>
                </div>
              </div>

              {/* Uttar Pradesh - Large north central state */}
              <div className="absolute top-[28%] left-[20%] w-[12%] h-[10%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-purple-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-purple-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-purple-700 text-xs">Uttar Pradesh</h4>
                  </div>
                </div>
              </div>

              {/* Rajasthan - Large western state */}
              <div className="absolute top-[32%] left-[8%] w-[12%] h-[12%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-pink-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-pink-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-pink-700 text-xs">Rajasthan</h4>
                  </div>
                </div>
              </div>

              {/* Gujarat - Western coast */}
              <div className="absolute top-[45%] left-[5%] w-[8%] h-[10%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-teal-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-teal-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-teal-700 text-xs">Gujarat</h4>
                  </div>
                </div>
              </div>

              {/* Maharashtra - Large western state */}
              <div className="absolute top-[48%] left-[12%] w-[10%] h-[10%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-red-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-red-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-red-700 text-xs">Maharashtra</h4>
                  </div>
                </div>
              </div>

              {/* Madhya Pradesh - Central India */}
              <div className="absolute top-[40%] left-[20%] w-[12%] h-[10%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-indigo-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-indigo-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-indigo-700 text-xs">Madhya Pradesh</h4>
                  </div>
                </div>
              </div>

              {/* West Bengal - Eastern state with label shown */}
              <div className="absolute top-[50%] left-[35%] w-[8%] h-[8%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-rose-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-rose-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-rose-700 text-xs">West Bengal</h4>
                    <p className="text-xs text-gray-600">Cultural Capital</p>
                  </div>
                </div>
              </div>

              {/* Odisha - Eastern coast */}
              <div className="absolute top-[55%] left-[32%] w-[8%] h-[8%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-violet-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-violet-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-violet-700 text-xs">Odisha</h4>
                  </div>
                </div>
              </div>

              {/* Karnataka - Southern state */}
              <div className="absolute top-[62%] left-[18%] w-[8%] h-[8%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-emerald-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-emerald-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-emerald-700 text-xs">Karnataka</h4>
                  </div>
                </div>
              </div>

              {/* Tamil Nadu - Southern tip */}
              <div className="absolute top-[70%] left-[20%] w-[8%] h-[8%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-amber-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-amber-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-amber-700 text-xs">Tamil Nadu</h4>
                  </div>
                </div>
              </div>

              {/* Kerala - Southwest coast */}
              <div className="absolute top-[68%] left-[15%] w-[6%] h-[10%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-cyan-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-cyan-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-cyan-700 text-xs">Kerala</h4>
                  </div>
                </div>
              </div>

              {/* Andhra Pradesh - Southeast */}
              <div className="absolute top-[60%] left-[25%] w-[8%] h-[8%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-lime-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-lime-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-lime-700 text-xs">Andhra Pradesh</h4>
                  </div>
                </div>
              </div>

              {/* Assam - Northeast */}
              <div className="absolute top-[35%] left-[42%] w-[8%] h-[6%] group cursor-pointer">
                <div className="absolute inset-0 bg-transparent hover:bg-sky-200/40 transition-all duration-300 rounded-lg border-2 border-transparent hover:border-sky-400"></div>
                <div className="relative z-10 h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-white/95 p-1 rounded shadow-lg text-center">
                    <h4 className="font-semibold text-sky-700 text-xs">Assam</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Content Section */}
      <section className="bg-white py-10 md:py-14 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="grid grid-cols-1 gap-10 items-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div className="space-y-6 text-center" variants={fadeInUp}>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold leading-tight text-gov-navy"
                variants={fadeInUp}
              >
                {strings.heroTitle}
              </motion.h1>
              <motion.p 
                className="text-xl text-gov-text leading-relaxed max-w-4xl mx-auto"
                variants={fadeInUp}
              >
                {strings.heroSubtext}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                variants={fadeInUp}
              >
                <Button 
                  size="lg" 
                  className="bg-gov-navy text-white hover:bg-gov-blue hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  aria-label="Student Login and Registration"
                >
                  <User className="mr-2 h-5 w-5" />
                  {strings.studentLogin}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  aria-label="Employer Login and Registration"
                >
                  <Building className="mr-2 h-5 w-5" />
                  {strings.employerLogin}
                </Button>
              </motion.div>
              <motion.div className="pt-4 space-y-4" variants={fadeInUp}>
                <Button 
                  variant="saffron"
                  size="lg"
                  className="w-full sm:w-auto text-lg font-semibold"
                  aria-label="Apply Now for PM Internship Scheme"
                  onClick={() => window.location.href = '/internship'}
                >
                  {strings.applyNow}
                </Button>
                <div>
                  <Button 
                    variant="link" 
                    className="text-gov-navy underline hover:text-gov-blue transition-colors"
                    aria-label="Government Dashboard Access"
                  >
                    {strings.governmentDashboard}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="bg-gov-gray py-6 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {strings.secure}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              {strings.mobileFirst}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              {strings.multilingual}
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              {strings.inclusive}
            </span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gov-navy mb-4 relative group">
              {strings.aboutTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-saffron group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gov-text leading-relaxed mb-6">
                {strings.aboutBody}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-gov-gray rounded-lg">
                  <div className="w-16 h-16 bg-gov-navy rounded-full flex items-center justify-center mx-auto mb-4">
                    <School className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gov-navy mb-2">For Students</h3>
                  <p className="text-sm text-gov-darkGray">Gain practical experience and enhance employability</p>
                </div>
                <div className="text-center p-6 bg-gov-gray rounded-lg">
                  <div className="w-16 h-16 bg-gov-navy rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gov-navy mb-2">For Employers</h3>
                  <p className="text-sm text-gov-darkGray">Access fresh talent and contribute to nation-building</p>
                </div>
                <div className="text-center p-6 bg-gov-gray rounded-lg">
                  <div className="w-16 h-16 bg-gov-navy rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gov-navy mb-2">For India</h3>
                  <p className="text-sm text-gov-darkGray">Building a skilled workforce for economic growth</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-16 bg-gov-navy text-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">{strings.statsTitle}</h2>
            <p className="text-xl text-gray-200">Making a difference across India</p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">50,000+</div>
              <p className="text-gray-200">{strings.statsInternships}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">2,50,000+</div>
              <p className="text-gray-200">{strings.statsStudents}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">5,000+</div>
              <p className="text-gray-200">{strings.statsEmployers}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">36</div>
              <p className="text-gray-200">{strings.statsStates}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gov-navy mb-4 relative group">
              {strings.highlightsTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-saffron group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
            <p className="text-lg text-gray-600">
              {strings.highlightsSubtitle}
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gov-blue rounded-lg">
                      <School className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-gov-navy">{strings.internshipDuration}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{strings.internshipDurationDesc}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gov-blue rounded-lg">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-gov-blue">{strings.topCompanies}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{strings.topCompaniesDesc}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="h-full hover:shadow-md transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gov-blue rounded-lg">
                      <Globe2 className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-gov-blue">{strings.guidedJourney}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{strings.guidedJourneyDesc}</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gov-gray">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gov-navy mb-4 relative group">
              {strings.howItWorksTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-saffron group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
            <p className="text-lg text-gray-600">
              {strings.howItWorksSubtitle}
            </p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-gov-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gov-text mb-2">{strings.step1}</h3>
              <p className="text-gray-600">{strings.step1Desc}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-gov-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gov-text mb-2">{strings.step2}</h3>
              <p className="text-gray-600">{strings.step2Desc}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-gov-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gov-text mb-2">{strings.step3}</h3>
              <p className="text-gray-600">{strings.step3Desc}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-gov-navy text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold text-gov-text mb-2">{strings.step4}</h3>
              <p className="text-gray-600">{strings.step4Desc}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Who Can Apply */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gov-text mb-4 relative group">
              {strings.eligibilityTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-gold group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
            <p className="text-lg text-gray-600">
              {strings.eligibilitySubtitle}
            </p>
          </motion.div>
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-gov-gray border-0">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gov-text flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-gov-blue" />
                      Students
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gov-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Open to students of recognized universities and colleges</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gov-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Applicable across all disciplines and streams</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gov-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Available for both undergraduate and postgraduate students</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gov-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Nationwide access with regional representation</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gov-text flex items-center">
                      <Building className="h-5 w-5 mr-2 text-gov-blue" />
                      Employers
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gov-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Government departments and ministries</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gov-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Public Sector Undertakings (PSUs)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gov-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Private sector organizations and corporates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-gov-blue rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Registered companies across various sectors</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Announcements / Latest Updates */}
      <section className="py-16 bg-gov-lightBlue">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gov-navy mb-4 relative group">
              {strings.announcementsTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-saffron group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-l-4 border-l-gov-saffron">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gov-darkGray">15 Dec 2024</span>
                    <span className="bg-gov-green text-white text-xs px-2 py-1 rounded">New</span>
                  </div>
                  <CardTitle className="text-gov-navy">Registration Opens for Winter Batch</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Applications now open for the Winter 2024 internship batch across 500+ organizations.</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-l-4 border-l-gov-green">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gov-darkGray">10 Dec 2024</span>
                    <span className="bg-gov-navy text-white text-xs px-2 py-1 rounded">Update</span>
                  </div>
                  <CardTitle className="text-gov-navy">New Partner Organizations Added</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>50+ new government departments and PSUs have joined the PM Internship Scheme.</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="h-full border-l-4 border-l-gov-navy">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gov-darkGray">5 Dec 2024</span>
                    <span className="bg-gov-saffron text-white text-xs px-2 py-1 rounded">Important</span>
                  </div>
                  <CardTitle className="text-gov-navy">Guidelines Updated</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>Updated eligibility criteria and application process guidelines now available.</CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gov-navy mb-4 relative group">
              {strings.testimonialsTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-saffron group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
            <p className="text-lg text-gov-darkGray">Hear from our successful interns and partner organizations</p>
          </motion.div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-gov-gray border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gov-navy rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gov-navy">Priya Sharma</h4>
                      <p className="text-sm text-gov-darkGray">Student, IIT Delhi</p>
                    </div>
                  </div>
                  <p className="text-gov-text italic">{"\"The PM Internship Scheme provided me with invaluable experience at ISRO. It bridged the gap between my academic knowledge and real-world applications.\""}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-gov-gray border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gov-navy rounded-full flex items-center justify-center">
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gov-navy">Dr. Rajesh Kumar</h4>
                      <p className="text-sm text-gov-darkGray">HR Director, BHEL</p>
                    </div>
                  </div>
                  <p className="text-gov-text italic">{"\"The interns from PMIS bring fresh perspectives and energy to our organization. It's a win-win for both students and employers.\""}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Card className="h-full bg-gov-gray border-0">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gov-navy rounded-full flex items-center justify-center">
                      <GraduationCap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gov-navy">Arjun Patel</h4>
                      <p className="text-sm text-gov-darkGray">Student, NIT Surat</p>
                    </div>
                  </div>
                  <p className="text-gov-text italic">{"\"My internship at the Ministry of Electronics & IT gave me insights into digital governance. Highly recommend PMIS to all students.\""}</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Important Links */}
      <section id="links" className="py-16 bg-gov-gray">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gov-text mb-4 relative group">
              {strings.importantLinksTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-gold group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
          </motion.div>
          <motion.div 
            className="flex flex-wrap justify-center gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Button variant="outline" asChild className="group hover:shadow-md transition-all duration-200">
                <a href="https://pminternship.mca.gov.in/guidelines" target="_blank" rel="noopener noreferrer" aria-label="Download English Guidelines">
                  <FileText className="mr-2 h-4 w-4" />
                  {strings.guidelinesEn}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button variant="outline" asChild className="group hover:shadow-md transition-all duration-200">
                <a href="https://pminternship.mca.gov.in/guidelines-hi" target="_blank" rel="noopener noreferrer" aria-label="Download Hindi Guidelines">
                  <FileText className="mr-2 h-4 w-4" />
                  {strings.guidelinesHi}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button variant="outline" asChild className="group hover:shadow-md transition-all duration-200">
                <a href="https://pminternship.mca.gov.in/faqs" target="_blank" rel="noopener noreferrer" aria-label="View Frequently Asked Questions">
                  <FileText className="mr-2 h-4 w-4" />
                  {strings.faqs}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button variant="outline" asChild className="group hover:shadow-md transition-all duration-200">
                <a href="mailto:pmi.helpdesk@mca.gov.in" aria-label="Contact Helpdesk via Email">
                  <FileText className="mr-2 h-4 w-4" />
                  {strings.helpdesk}
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
