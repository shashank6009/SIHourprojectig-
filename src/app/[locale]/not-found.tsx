"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, School, Globe2, ChevronRight, User, Building, GraduationCap, FileText } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render motion components until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white">
        {/* Static version without animations for SSR */}
        <section className="relative overflow-hidden bg-gradient-to-br from-gov-navy to-gov-blue">
          <div className="w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                {t('hero.title')}
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                {t('hero.subtitle')}
              </p>
              <div className="flex justify-center">
                <Image
                  src="/emblem.jpeg"
                  alt={t('hero.emblemAlt')}
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
              <h2 className="text-2xl font-bold text-gov-navy mb-2">{t('sections.partners')}</h2>
              <p className="text-gray-600">{t('sections.partnersDescription')}</p>
            </div>
            <div className="flex justify-center items-center">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full max-w-4xl h-auto rounded-lg shadow-lg"
              >
                <source src="/companies.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gov-navy mb-4">{t('sections.features')}</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {t('sections.featuresDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('features.personalized.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {t('features.personalized.description')}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{t('features.industry.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {t('features.industry.description')}
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{t('features.skill.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {t('features.skill.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-16 bg-gov-navy">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/copilot')}
                className="bg-white text-gov-navy px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="h-5 w-5" />
                Resume Builder
              </button>
              <button
                onClick={() => router.push('/internship')}
                className="bg-gov-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Briefcase className="h-5 w-5" />
                {t('cta.apply')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Animated version for client-side
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section 
        className="relative overflow-hidden bg-gradient-to-br from-gov-navy to-gov-blue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
          <motion.div 
            className="text-center text-white px-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t('hero.subtitle')}
            </p>
            <motion.div 
              className="flex justify-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <Image
                src="/emblem.jpeg"
                alt={t('hero.emblemAlt')}
                width={120}
                height={120}
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Companies Showcase Section */}
      <motion.section 
        className="py-4 bg-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gov-navy mb-2">{t('sections.partners')}</h2>
            <p className="text-gray-600">{t('sections.partnersDescription')}</p>
          </div>
          <div className="flex justify-center items-center">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-4xl h-auto rounded-lg shadow-lg"
            >
              <source src="/companies.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gov-navy mb-4">{t('sections.features')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t('sections.featuresDescription')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{t('features.personalized.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {t('features.personalized.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.4, duration: 0.8 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{t('features.industry.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {t('features.industry.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <GraduationCap className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">{t('features.skill.title')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {t('features.skill.description')}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Call to Action Section */}
      <motion.section 
        className="py-16 bg-gov-navy"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              onClick={() => router.push('/copilot')}
              className="bg-white text-gov-navy px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FileText className="h-5 w-5" />
              Resume Builder
            </motion.button>
            <motion.button
              onClick={() => router.push('/internship')}
              className="bg-gov-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Briefcase className="h-5 w-5" />
              {t('cta.apply')}
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
