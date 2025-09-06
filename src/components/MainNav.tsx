"use client";

import { ChevronDown, User } from "lucide-react";
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
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-24">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-6">
            <Image
              src="/pmintern.jpeg"
              alt="PM Internship Scheme"
              width={80}
              height={80}
              className="rounded"
            />
            <Image
              src="/mca.jpeg"
              alt="Ministry of Corporate Affairs"
              width={72}
              height={72}
              className="rounded"
            />
            <h1 className="text-3xl font-bold text-gov-blue">PMIS</h1>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-10">
            <a
              href="#"
              className="text-gov-text hover:text-gov-blue font-medium transition-colors text-lg"
            >
              {strings.home}
            </a>
            <a
              href="#"
              className="text-gov-text hover:text-gov-blue font-medium transition-colors text-lg"
            >
              {strings.students}
            </a>
            <a
              href="#"
              className="text-gov-text hover:text-gov-blue font-medium transition-colors text-lg"
            >
              {strings.employers}
            </a>
            <a
              href="#"
              className="text-gov-text hover:text-gov-blue font-medium transition-colors text-lg"
            >
              {strings.government}
            </a>
            <a
              href="#"
              className="text-gov-text hover:text-gov-blue font-medium transition-colors text-lg"
            >
              {strings.help}
            </a>
          </div>

          {/* Login Button and Viksit Bharat */}
          <div className="flex items-center space-x-6">
            <Image
              src="/viksit.jpeg"
              alt="Viksit Bharat"
              width={100}
              height={50}
              className="rounded"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gov-blue hover:bg-gov-blueDark text-lg px-6 py-3">
                  <User className="h-5 w-5 mr-2" />
                  {strings.login}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Student</DropdownMenuItem>
                <DropdownMenuItem>Employer</DropdownMenuItem>
                <DropdownMenuItem>Government</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
