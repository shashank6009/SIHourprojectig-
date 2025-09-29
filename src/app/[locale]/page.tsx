"use client";

import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  // Get current locale from pathname
  const currentLocale = mounted 
    ? (pathname.startsWith('/ta') ? 'ta' : pathname.startsWith('/hi') ? 'hi' : 'en')
    : 'en';
  
  // Get language-specific image
  const getLanguageImage = () => {
    switch (currentLocale) {
      case 'ta':
        return '/lang/1.png';
      case 'hi':
        return '/lang/6.png';
      case 'en':
      default:
        return '/lang/7.png';
    }
  };
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Video Section */}
      <section className="relative overflow-hidden h-[60vh] md:h-[70vh]">
        <div className="absolute inset-0 z-0">
          {/* Fallback background image if video fails to load */}
          <div 
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/emblem.jpeg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {mounted && (
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
              poster="/emblem.jpeg"
              onError={(e) => {
                console.error('Home video failed to load:', e);
                console.error('Video error details:', {
                  currentSrc: e.currentTarget.currentSrc,
                  networkState: e.currentTarget.networkState,
                  readyState: e.currentTarget.readyState,
                  error: e.currentTarget.error
                });
                console.log('Video failed to load, using poster image');
                e.currentTarget.style.display = 'none';
              }}
              onLoadStart={() => {
                console.log('Home video started loading');
              }}
              onCanPlay={() => {
                console.log('Home video can play');
                // Try to play manually if autoplay failed
                const video = document.querySelector('video');
                if (video) {
                  video.play().catch(err => {
                    console.log('Autoplay blocked, user interaction required:', err);
                  });
                }
              }}
              onLoadedData={() => {
                console.log('Home video loaded data');
              }}
              onPlay={() => {
                console.log('Home video started playing');
              }}
              onLoadedMetadata={() => {
                console.log('Home video metadata loaded');
              }}
            >
              <source src="/home.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
          {/* Show static background during SSR or if video fails */}
          {!mounted && (
            <div 
              className="w-full h-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/emblem.jpeg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          )}
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
              onError={(e) => {
                console.log('Companies video failed to load');
                e.currentTarget.style.display = 'none';
                // Show fallback image
                const fallback = document.createElement('img');
                fallback.src = '/emblem.jpeg';
                fallback.className = 'w-full h-auto rounded-lg shadow-lg';
                fallback.alt = 'Partner Organizations';
                e.currentTarget.parentNode?.appendChild(fallback);
              }}
            >
              <source src="/companies.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>

      {/* Language-specific Image Section */}
      <section className="relative bg-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative w-full max-w-6xl mx-auto">
            {mounted && (
              <Image
                src={getLanguageImage()}
                alt={`PM Internship Scheme - ${currentLocale.toUpperCase()}`}
                width={1200}
                height={600}
                className="w-full h-auto rounded-lg shadow-lg"
                priority={false}
              />
            )}
            {/* Fallback for SSR */}
            {!mounted && (
              <div className="w-full h-96 bg-gray-100 rounded-lg shadow-lg flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hero Content Section */}
      <section className="bg-white py-10 md:py-14 border-b border-gray-200">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 gap-10 items-center">
            <div className="space-y-6 text-center">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gov-navy">
                Prime Minister's Internship Scheme (PMIS)
              </h1>
              <p className="text-xl text-gov-text leading-relaxed max-w-4xl mx-auto">
                Empowering Youth through Real-World Experience – PM Internship Scheme
              </p>
              <div className="pt-4 space-y-4">
                <button 
                  className="w-full sm:w-auto text-lg font-semibold h-11 px-8 bg-gov-saffron text-white hover:bg-secondary-600 shadow-sm hover:shadow-md transition-all duration-200 rounded-md inline-flex items-center justify-center"
                  aria-label="Apply Now for PM Internship Scheme"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      const currentLocale = window.location.pathname.split('/')[1] || 'en';
                      router.push(`/${currentLocale}/internship`);
                    }
                  }}
                >
                  <span>Apply Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gov-navy mb-4 relative group">
              About the PM Internship Scheme
              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gov-saffron group-hover:w-1/2 transition-all duration-300"></span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-lg text-gov-text leading-relaxed mb-6">
                The PM Internship Scheme provides students across India with practical exposure through internships in government departments, PSUs, and the private sector, fostering employability and nation-building.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}