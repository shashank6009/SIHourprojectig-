"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, School, Globe2, ChevronRight, User, Building, GraduationCap, FileText } from "lucide-react";
import Image from "next/image";
export default function HomePage() {
  const router = useRouter();

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
      <section className="relative overflow-hidden h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster="/emblem.jpeg"
          >
            <source src="/home.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Companies Video Section */}
      <section className="relative bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gov-navy mb-4">Partner Organizations</h2>
            <p className="text-lg text-gray-600">Leading companies and government departments</p>
          </div>
          <div className="relative w-full max-w-6xl mx-auto">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto rounded-lg shadow-lg"
              poster="/emblem.jpeg"
            >
              <source src="/companies.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
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
            </div>
          </div>
        </section>

        {/* Hero Content Section - Static */}
        <section className="bg-white py-10 md:py-14 border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 gap-10 items-center">
              <div className="space-y-6 text-center">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gov-navy">
                  Future-ready internships for every student
                </h1>
                <p className="text-xl text-gov-text leading-relaxed max-w-4xl mx-auto">
                  Join thousands of students who have found their dream internships through our platform
                </p>
                <div className="pt-4 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      className="w-full sm:w-auto text-lg font-semibold h-11 px-8 bg-gov-saffron text-white hover:bg-secondary-600 shadow-sm hover:shadow-md transition-all duration-200 rounded-md inline-flex items-center justify-center"
                      aria-label="Apply Now for PM Internship Scheme"
                      onClick={() => router.push('/internship')}
                    >
                      <span>Apply Now</span>
                    </button>
                    <button 
                      className="w-full sm:w-auto text-lg font-semibold h-11 px-8 bg-gov-navy text-white hover:bg-gov-blue shadow-sm hover:shadow-md transition-all duration-200 rounded-md inline-flex items-center justify-center gap-2"
                      aria-label="Build Your Resume with AI"
                      onClick={() => router.push('/copilot')}
                    >
                      <FileText className="h-5 w-5" />
                      <span>Resume Builder</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="bg-gov-gray py-6 border-b border-gray-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Secure & Trusted
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Mobile First
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Multilingual
              </span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                Inclusive
              </span>
            </div>
          </div>
        </section>

        {/* About Section - Static */}
        <section id="about" className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gov-navy mb-4 relative group">
                About
                <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-saffron group-hover:w-1/2 transition-all duration-300"></span>
              </h2>
              <div className="max-w-4xl mx-auto">
                <p className="text-lg text-gov-text leading-relaxed mb-6">
                  Join thousands of students who have found their dream internships through our platform
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
            </div>
          </div>
        </section>

        {/* Key Statistics - Static */}
        <section className="py-16 bg-gov-navy text-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Statistics</h2>
              <p className="text-xl text-gray-200">Making a difference across India</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">50,000+</div>
                <p className="text-gray-200">PM Internship Scheme</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">2,50,000+</div>
                <p className="text-gray-200">Students Registered</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">5,000+</div>
                <p className="text-gray-200">Partner Organizations</p>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">36</div>
                <p className="text-gray-200">States & UTs</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action - Static */}
        <section className="py-16 bg-gov-saffron text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Get Started</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students in building their careers with India's leading organizations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                className="bg-white text-gov-saffron hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                onClick={() => router.push('/internship')}
              >
                Apply Now
              </button>
              <button 
                className="bg-gov-navy text-white hover:bg-gov-blue font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center gap-2"
                onClick={() => router.push('/copilot')}
              >
                <FileText className="h-5 w-5" />
                Resume Builder
              </button>
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

  // Animated version with motion components
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gov-navy to-gov-blue">
        <div className="w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Future-ready internships for every student
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Personalized matches based on your skills and interests
            </p>
            <div className="flex justify-center">
              <Image
                src="/emblem.jpeg"
                alt="Government of India Emblem"
                width={120}
                height={120}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Companies Showcase Section */}
      <section className="py-4 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gov-navy mb-2">Partner Organizations</h2>
            <p className="text-gray-600">Leading companies and government departments</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 items-center justify-items-center">
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <span className="text-sm font-semibold text-gov-navy">Government Departments</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <span className="text-sm font-semibold text-gov-navy">PSUs</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <span className="text-sm font-semibold text-gov-navy">Private Sector</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <span className="text-sm font-semibold text-gov-navy">Startups</span>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <span className="text-sm font-semibold text-gov-navy">NGOs</span>
            </div>
          </div>
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
                Future-ready internships for every student
              </motion.h1>
              <motion.p 
                className="text-xl text-gov-text leading-relaxed max-w-4xl mx-auto"
                variants={fadeInUp}
              >
                Join thousands of students who have found their dream internships through our platform
              </motion.p>
              <motion.div className="pt-4 space-y-4" variants={fadeInUp}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    className="w-full sm:w-auto text-lg font-semibold h-11 px-8 bg-gov-saffron text-white hover:bg-secondary-600 shadow-sm hover:shadow-md transition-all duration-200 rounded-md inline-flex items-center justify-center"
                    aria-label="Apply Now for PM Internship Scheme"
                    onClick={() => router.push('/internship')}
                  >
                    <span>Apply Now</span>
                  </button>
                  <button 
                    className="w-full sm:w-auto text-lg font-semibold h-11 px-8 bg-gov-navy text-white hover:bg-gov-blue shadow-sm hover:shadow-md transition-all duration-200 rounded-md inline-flex items-center justify-center gap-2"
                    aria-label="Build Your Resume with AI"
                    onClick={() => router.push('/copilot')}
                  >
                    <FileText className="h-5 w-5" />
                    <span>Resume Builder</span>
                  </button>
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
              Secure & Trusted
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Mobile First
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
              Multilingual
            </span>
            <span className="flex items-center">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
              Inclusive
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
              About
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-saffron group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gov-text leading-relaxed mb-6">
                Join thousands of students who have found their dream internships through our platform
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
            <h2 className="text-3xl font-bold mb-4">Key Statistics</h2>
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
              <p className="text-gray-200">PM Internship Scheme</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">2,50,000+</div>
              <p className="text-gray-200">Students Registered</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">5,000+</div>
              <p className="text-gray-200">Partner Organizations</p>
            </motion.div>
            <motion.div className="text-center" variants={fadeInUp}>
              <div className="text-4xl md:text-5xl font-bold text-gov-saffron mb-2">36</div>
              <p className="text-gray-200">States & UTs</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gov-saffron text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Get Started</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students in building their careers with India's leading organizations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                className="bg-white text-gov-saffron hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200"
                onClick={() => router.push('/internship')}
              >
                Apply Now
              </button>
              <button 
                className="bg-gov-navy text-white hover:bg-gov-blue font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200 inline-flex items-center gap-2"
                onClick={() => router.push('/copilot')}
              >
                <FileText className="h-5 w-5" />
                Resume Builder
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
