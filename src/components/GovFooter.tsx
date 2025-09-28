"use client";

import Link from "next/link";
import { useTranslations } from "@/hooks/useTranslations";

export function GovFooter() {
  const { t } = useTranslations();

  // Render content immediately to avoid loading issues

  return (
    <footer id="footer" className="bg-gov-navy text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left side - Title and description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              {t('footer.pmis', 'PM Internship Scheme')}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {t('footer.empowering', 'Empowering India\'s youth through meaningful internship opportunities with government and private sector organizations.')}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#about" className="text-gov-saffron hover:text-white underline transition-colors">
                {t('section.about', 'About')}
              </a>
              <a href="#links" className="text-gov-saffron hover:text-white underline transition-colors">
                {t('section.englishGuidelines', 'Guidelines')}
              </a>
              <a href="#links" className="text-gov-saffron hover:text-white underline transition-colors">
                {t('section.faqs', 'FAQs')}
              </a>
              <a href="#footer" className="text-gov-saffron hover:text-white underline transition-colors">
                {t('footer.contactInfo', 'Contact')}
              </a>
            </div>
          </div>

          {/* Center - Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4">{t('footer.quickLinks', 'Quick Links')}</h4>
            <div className="space-y-2 text-sm">
              <Link href="/admin" className="block text-gov-saffron hover:text-white transition-colors text-base font-semibold border-b border-gov-saffron/30 pb-1">{t('footer.govDashboard', 'Government Dashboard')}</Link>
              <Link href="/internship" className="block text-gray-300 hover:text-gov-saffron transition-colors">{t('footer.applyInternship', 'Apply for Internship')}</Link>
              <Link href="/register" className="block text-gray-300 hover:text-gov-saffron transition-colors">{t('footer.employerReg', 'Employer Registration')}</Link>
              <a href="#links" className="block text-gray-300 hover:text-gov-saffron transition-colors">{t('footer.downloadGuidelines', 'Download Guidelines')}</a>
              <Link href="/dashboard" className="block text-gray-300 hover:text-gov-saffron transition-colors">{t('footer.trackApplication', 'Track Application')}</Link>
              <a href="#footer" className="block text-gray-300 hover:text-gov-saffron transition-colors">{t('footer.accessibility', 'Accessibility Statement')}</a>
            </div>
          </div>

          {/* Right side - Contact info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4">{t('footer.contactInfo', 'Contact Information')}</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <strong>{t('footer.email', 'Email')}:</strong> pmi.helpdesk@mca.gov.in
              </p>
              <p className="text-gray-300">
                <strong>{t('footer.helpline', 'Helpline')}:</strong> 1800-XXX-XXXX
              </p>
              <p className="text-gray-300">
                <strong>{t('footer.officeHours', 'Office Hours')}:</strong> {t('common.monFri', 'Mon-Fri')}, 9:00 {t('common.am', 'AM')} - 6:00 {t('common.pm', 'PM')}
              </p>
            </div>
          </div>
        </div>

        {/* Government Disclaimer */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="bg-gov-blue/20 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-200 leading-relaxed">
                  <strong>{t('footer.govDisclaimer', 'Government Disclaimer: This is an official website of the Government of India. All information provided is authentic and verified.')}</strong>
                </p>
          </div>
          
          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <div className="flex flex-col md:flex-row gap-4">
                <p>© 2024 {t('footer.govIndia', 'Government of India')}. {t('footer.rights', 'All rights reserved.')}</p>
                <span className="hidden md:inline">|</span>
                <p>{t('footer.lastUpdated', 'Last updated')}: December 2024</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <span className="text-gov-saffron font-medium">{t('footer.digitalIndia', 'Digital India')}</span>
                <div className="w-px h-4 bg-gray-600"></div>
                <span className="text-gov-saffron font-medium">{t('footer.myGov', 'MyGov')}</span>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
