"use client";

import { useState, useEffect } from "react";
import { ChevronDown, FileText, Camera, ThumbsUp, BookOpen } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// Replace shared Button with native button to avoid hydration mismatches
import { type Language } from "@/lib/i18n";

interface MainNavProps {
  language: Language;
}

export function MainNav({}: MainNavProps) {
  const [mounted, setMounted] = useState(false);

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
        
        {/* Navigation content overlay */}
        <div className="absolute inset-0 flex items-center justify-between px-3 md:px-4">
          
          {/* Invisible Login Button - positioned over the Login button in the image */}
          <div className="absolute top-1/2 right-40 transform -translate-y-1/2 w-16 h-8 z-10">
            <Link 
              href="/login" 
              className="block w-full h-full"
              aria-label="Login to PM Internship Portal"
            >
            </Link>
          </div>
          
          {/* Navigation Links and Menu in the center empty space */}
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center space-x-4 md:space-x-8">
              <Link 
                href="/" 
                className="text-black hover:text-gov-saffron font-semibold text-sm md:text-lg transition-colors duration-200"
              >
                Home
              </Link>
              <Link 
                href="/internship" 
                className="text-black hover:text-gov-saffron font-semibold text-sm md:text-lg transition-colors duration-200"
              >
                Intern
              </Link>
              <Link 
                href="/internship/recommendations" 
                className="text-black hover:text-gov-saffron font-semibold text-sm md:text-lg transition-colors duration-200"
              >
                Recommendations
              </Link>
              <Link 
                href="/dashboard" 
                className="text-black hover:text-gov-saffron font-semibold text-sm md:text-lg transition-colors duration-200"
                key="dashboard-nav"
              >
                Dashboard
              </Link>
              
              {/* Menu button positioned after recommendations */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="bg-gov-saffron hover:bg-gov-saffron/80 text-white font-medium text-xs md:text-sm px-3 py-1.5 shadow-lg ml-2 rounded-md inline-flex items-center">
                    <span className="inline-flex items-center gap-1">Menu<ChevronDown className="ml-1 h-3 w-3" /></span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
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
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}


