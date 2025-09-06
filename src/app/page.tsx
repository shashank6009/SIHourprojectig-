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
      <section className="bg-gradient-to-br from-gov-blue to-gov-blueDark text-white py-16 md:py-24">
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
              <motion.div className="pt-4" variants={fadeInUp}>
                <Button 
                  variant="link" 
                  className="text-white underline hover:text-gray-200 transition-colors"
                  aria-label="Government Dashboard Access"
                >
                  {strings.governmentDashboard}
                </Button>
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

      {/* Important Links */}
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
