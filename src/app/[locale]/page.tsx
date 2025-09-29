"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

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
                      router.push('/internship');
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