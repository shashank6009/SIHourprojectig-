"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { i18n, type Language } from "@/lib/i18n";

interface MainNavProps {
  language: Language;
}

export function MainNav({ language }: MainNavProps) {
  const strings = i18n[language];

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
              
              {/* Menu button positioned after recommendations */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="bg-gov-saffron hover:bg-gov-saffron/80 text-white font-medium text-xs md:text-sm px-3 py-1.5 shadow-lg ml-2">
                    Menu
                    <ChevronDown className="ml-1 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <a href="https://pminternship.mca.gov.in/about" target="_blank" rel="noopener noreferrer" aria-label="About the Scheme (official)">{strings.aboutScheme}</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://pminternship.mca.gov.in/students" target="_blank" rel="noopener noreferrer" aria-label="For Students (official)">{strings.forStudents}</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://pminternship.mca.gov.in/employers" target="_blank" rel="noopener noreferrer" aria-label="For Employers (official)">{strings.forEmployers}</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://pminternship.mca.gov.in/guidelines" target="_blank" rel="noopener noreferrer" aria-label="Guidelines (official)">{strings.guidelines}</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://pminternship.mca.gov.in/faqs" target="_blank" rel="noopener noreferrer" aria-label="FAQs (official)">{strings.faqs}</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://pminternship.mca.gov.in/contact" target="_blank" rel="noopener noreferrer" aria-label="Contact Us (official)">{strings.contactUs}</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="https://pminternship.mca.gov.in/login" target="_blank" rel="noopener noreferrer" aria-label="Apply / Register (official)">{strings.applyRegister}</a>
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
