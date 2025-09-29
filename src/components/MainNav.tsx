"use client";

import { useState, useEffect } from "react";
import { ChevronDown, FileText, Camera, ThumbsUp, BookOpen, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "@/hooks/useTranslations";

export function MainNav() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslations();
  
  // Get current locale from pathname
  const currentLocale = mounted 
    ? (pathname.startsWith('/ta') ? 'ta' : pathname.startsWith('/hi') ? 'hi' : 'en')
    : 'en';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 shadow-sm">
        <div className="relative w-full h-16 md:h-18 bg-gray-100">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse h-6 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 shadow-sm">
      {/* Navigation bar using top.png as background */}
      <div className="relative w-full h-16 md:h-18">
        <Image
          src="/top.png"
          alt="Government Header"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Navigation content overlay - Left and center content */}
        <div className="absolute inset-0 flex items-center px-2 sm:px-4 md:px-6 lg:px-8 xl:px-12">
          
          {/* Left side - Logo/Branding area */}
          <div className="flex-1 flex items-center justify-start min-w-0">
            {/* Space for logos - they're part of the background image */}
          </div>
          
          {/* Center - Navigation Links with adaptive font scaling */}
          <div className="flex items-center nav-adaptive-spacing justify-center flex-shrink-0">
            <Link 
              href={`/${currentLocale}`}
              className="nav-adaptive text-black hover:text-gov-saffron font-semibold transition-all duration-300 py-2 rounded-md hover:bg-white/20 whitespace-nowrap"
            >
              {t('nav.home', 'Home')}
            </Link>
            <Link 
              href={`/${currentLocale}/internship`}
              className="nav-adaptive text-black hover:text-gov-saffron font-semibold transition-all duration-300 py-2 rounded-md hover:bg-white/20 whitespace-nowrap"
            >
              {t('nav.internship', 'Intern')}
            </Link>
            <Link 
              href={`/${currentLocale}/internship/recommendations`}
              className="nav-adaptive text-black hover:text-gov-saffron font-semibold transition-all duration-300 py-2 rounded-md hover:bg-white/20 whitespace-nowrap"
            >
              {t('nav.recommendations', 'Recommendations')}
            </Link>
            <Link 
              href="/dashboard" 
              className="nav-adaptive text-black hover:text-gov-saffron font-semibold transition-all duration-300 py-2 rounded-md hover:bg-white/20 whitespace-nowrap"
              key="dashboard-nav"
            >
              {t('nav.dashboard', 'Dashboard')}
            </Link>
            <Link 
              href="/copilot" 
              className="nav-adaptive text-black hover:text-gov-saffron font-semibold transition-all duration-300 py-2 rounded-md hover:bg-white/20 whitespace-nowrap"
            >
              {t('nav.resumeBuilder', 'Resume Builder')}
            </Link>
          </div>
          
          {/* Spacer for right side balance */}
          <div className="flex-1 min-w-0">
            {/* This creates balance but menu button is positioned absolutely */}
          </div>
        </div>
        
        {/* Absolutely positioned menu button - always stays on top of Login */}
        <div className="menu-button-fixed">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-gov-saffron hover:bg-gov-saffron/90 text-white font-medium text-xs md:text-sm px-4 py-2.5 shadow-lg rounded-lg inline-flex items-center transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
                  <span className="inline-flex items-center gap-2">Menu<ChevronDown className="h-3 w-3" /></span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 shadow-xl">
                <DropdownMenuItem asChild>
                  <a href="https://pminternship.mca.gov.in/guidelines" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    GUIDELINES / DOCUMENTATIONS
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://pminternship.mca.gov.in/login/#gallery-block" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    GALLERY
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <button 
                    onClick={() => {
                      const element = document.querySelector('.companies-video-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    <ThumbsUp className="h-4 w-4" />
                    ELIGIBILITY
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://pminternship.mca.gov.in/compendium/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    COMPENDIUM
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Login Button - positioned over the Login button in the image */}
            <div className="w-20 h-10 ml-2">
              <Link 
                href="/login" 
                className="block w-full h-full"
                aria-label="Login to PM Internship Portal"
              >
              </Link>
            </div>
        </div>
      </div>
    </nav>
  );
}


