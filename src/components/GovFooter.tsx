import { i18n, type Language } from "@/lib/i18n";

interface GovFooterProps {
  language: Language;
}

export function GovFooter({ language }: GovFooterProps) {
  const strings = i18n[language];

  return (
    <footer className="bg-gov-gray border-t border-gray-200">
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Title and quick links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gov-text">
              {strings.footerTitle}
            </h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <a
                href="#"
                className="text-gov-blue hover:text-gov-blueDark underline"
              >
                {strings.about}
              </a>
              <a
                href="#"
                className="text-gov-blue hover:text-gov-blueDark underline"
              >
                {strings.guidelines}
              </a>
              <a
                href="#"
                className="text-gov-blue hover:text-gov-blueDark underline"
              >
                FAQs
              </a>
              <a
                href="#"
                className="text-gov-blue hover:text-gov-blueDark underline"
              >
                {strings.contact}
              </a>
            </div>
          </div>

          {/* Right side - Contact info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gov-text mb-2">Helpdesk</h4>
              <p className="text-sm text-gray-600">
                Email: {strings.helpdeskEmail}
              </p>
              <p className="text-sm text-gray-600">
                Helpline: {strings.helpline}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>{strings.copyright}</p>
            <p className="mt-2 md:mt-0">{strings.digitalIndia}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
