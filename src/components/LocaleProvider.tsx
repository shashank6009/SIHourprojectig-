"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    // Detect locale from pathname
    const locale = pathname.startsWith('/ta') ? 'ta' : pathname.startsWith('/hi') ? 'hi' : 'en';
    
    // Update html lang attribute
    document.documentElement.lang = locale;
    
    // Update html class for font variables
    const fontClass = locale === 'ta' 
      ? 'noto_sans_26a17979-module__eD3CAG__variable noto_sans_cad03a3-module__fjJJ1q__variable'
      : 'noto_sans_26a17979-module__eD3CAG__variable';
    
    document.documentElement.className = fontClass;
    
    // Update body class for font
    const bodyClass = locale === 'ta'
      ? 'noto_sans_26a17979-module__eD3CAG__className'
      : 'noto_sans_26a17979-module__eD3CAG__className';
    
    document.body.className = bodyClass;
  }, [pathname]);

  return <>{children}</>;
}
