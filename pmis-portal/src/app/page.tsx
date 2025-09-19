"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, School, Globe2, ChevronRight, User, Building, GraduationCap, FileText } from "lucide-react";
import Image from "next/image";
import { i18n, type Language } from "@/lib/i18n";

export default function HomePage() {
  const [language, setLanguage] = useState<Language>("en");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const strings = i18n[language];

  const images = [
    { src: "/modi1.png", alt: "Prime Minister Narendra Modi" },
    { src: "/modi2.png", alt: "Prime Minister Narendra Modi" },
    { src: "/modi3.png", alt: "Prime Minister Narendra Modi" },
  ];

  // Auto-rotate images every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gov-navy to-gov-blue text-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div className="space-y-6" variants={fadeInUp}>
              <motion.h1 
                className="text-4xl md:text-5xl font-bold leading-tight"
                variants={fadeInUp}
              >
                {strings.heroTitle}
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-100 leading-relaxed"
                variants={fadeInUp}
              >
                {strings.heroSubtext}
              </motion.p>
              <motion.div 
                className="flex flex-col sm:flex-row gap-4"
                variants={fadeInUp}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-gov-blue hover:bg-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                  aria-label="Student Login and Registration"
                >
                  <User className="mr-2 h-5 w-5" />
                  {strings.studentLogin}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-gov-blue hover:shadow-md transition-all duration-200 hover:-translate-y-1"
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
                  asChild
                >
                  <a href="/internship">{strings.applyNow}</a>
                </Button>
                <div>
                  <Button 
                    variant="link" 
                    className="text-white underline hover:text-gray-200 transition-colors"
                    aria-label="Government Dashboard Access"
                  >
                    {strings.governmentDashboard}
                  </Button>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="hidden lg:block"
              variants={fadeInUp}
            >
              <div className="w-full h-80 bg-gradient-to-br from-gov-blue to-gov-blueDark rounded-lg overflow-hidden relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
        <Image
                      src={images[currentImageIndex].src}
                      alt={images[currentImageIndex].alt}
                      fill
                      className="object-cover object-center"
          priority
        />
                  </motion.div>
                </AnimatePresence>
                
                {/* Image indicators */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white scale-110' 
                          : 'bg-white/50 hover:bg-white/75'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Full-width video under the Government Dashboard link */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <video
              className="w-full h-40 md:h-56 lg:h-64 rounded-lg shadow-sm"
              src="/companies.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label="Companies showcase video"
            />
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
            <h2 className="text-3xl font-bold text-gov-text mb-4 relative group">
              {strings.highlightsTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-gold group-hover:w-1/2 transition-all duration-300"></span>
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
                    <CardTitle className="text-gov-blue">{strings.internshipDuration}</CardTitle>
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
            <h2 className="text-3xl font-bold text-gov-text mb-4 relative group">
              {strings.howItWorksTitle}
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-gold group-hover:w-1/2 transition-all duration-300"></span>
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
              <div className="w-16 h-16 bg-gov-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold text-gov-text mb-2">{strings.step1}</h3>
              <p className="text-gray-600">{strings.step1Desc}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-gov-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold text-gov-text mb-2">{strings.step2}</h3>
              <p className="text-gray-600">{strings.step2Desc}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-gov-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold text-gov-text mb-2">{strings.step3}</h3>
              <p className="text-gray-600">{strings.step3Desc}</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="w-16 h-16 bg-gov-blue text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
                  <p className="text-gov-text italic">"The PM Internship Scheme provided me with invaluable experience at ISRO. It bridged the gap between my academic knowledge and real-world applications."</p>
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
                  <p className="text-gov-text italic">"The interns from PMIS bring fresh perspectives and energy to our organization. It's a win-win for both students and employers."</p>
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
                  <p className="text-gov-text italic">"My internship at the Ministry of Electronics & IT gave me insights into digital governance. Highly recommend PMIS to all students."</p>
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
