import { i18n, type Language } from "@/lib/i18n";

interface GovFooterProps {
  language: Language;
}

export function GovFooter({ language }: GovFooterProps) {
  const strings = i18n[language];

  return (
    <footer id="footer" className="bg-gov-navy text-white">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left side - Title and description */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">
              PM Internship Scheme
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {strings.footerTitle}
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <a href="#about" className="text-gov-saffron hover:text-white underline transition-colors">
                {strings.about}
              </a>
              <a href="#links" className="text-gov-saffron hover:text-white underline transition-colors">
                {strings.guidelines}
              </a>
              <a href="#links" className="text-gov-saffron hover:text-white underline transition-colors">
                FAQs
              </a>
              <a href="#footer" className="text-gov-saffron hover:text-white underline transition-colors">
                {strings.contact}
              </a>
            </div>
          </div>

          {/* Center - Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <a href="/internship" className="block text-gray-300 hover:text-gov-saffron transition-colors">Apply for Internship</a>
              <a href="#" className="block text-gray-300 hover:text-gov-saffron transition-colors">Employer Registration</a>
              <a href="#" className="block text-gray-300 hover:text-gov-saffron transition-colors">Download Guidelines</a>
              <a href="#" className="block text-gray-300 hover:text-gov-saffron transition-colors">Track Application</a>
              <a href="#" className="block text-gray-300 hover:text-gov-saffron transition-colors">Accessibility Statement</a>
            </div>
          </div>

          {/* Right side - Contact info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white mb-4">Contact Information</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-300">
                <strong>Email:</strong> {strings.helpdeskEmail}
              </p>
              <p className="text-gray-300">
                <strong>Helpline:</strong> {strings.helpline}
              </p>
              <p className="text-gray-300">
                <strong>Office Hours:</strong> Mon-Fri, 9:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Government Disclaimer */}
        <div className="border-t border-gray-600 mt-8 pt-6">
          <div className="bg-gov-blue/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-200 leading-relaxed">
              <strong>Government Disclaimer:</strong> {strings.disclaimer}
            </p>
          </div>
          
          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-300">
            <div className="flex flex-col md:flex-row gap-4">
              <p>{strings.copyright}</p>
              <span className="hidden md:inline">|</span>
              <p>Last updated: December 2024</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <span className="text-gov-saffron font-medium">{strings.digitalIndia}</span>
              <div className="w-px h-4 bg-gray-600"></div>
              <span className="text-gov-saffron font-medium">MyGov</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
