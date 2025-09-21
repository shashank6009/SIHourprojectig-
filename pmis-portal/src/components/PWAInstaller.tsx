'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    checkInstalled();

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show install prompt after 30 seconds if not dismissed
      setTimeout(() => {
        if (!isInstalled) {
          setShowInstallPrompt(true);
        }
      }, 30000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for iOS Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari && !isInstalled) {
      // Show iOS install instructions after 45 seconds
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 45000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Don't show again for 24 hours
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Don't show if already installed or recently dismissed
  if (isInstalled) return null;
  
  const dismissedTime = localStorage.getItem('pwa-install-dismissed');
  if (dismissedTime && Date.now() - parseInt(dismissedTime) < 24 * 60 * 60 * 1000) {
    return null;
  }

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  return (
    <AnimatePresence>
      {showInstallPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50"
        >
          <Card className="bg-white shadow-lg border-gov-saffron border-t-4">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gov-saffron/10 rounded-full flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-gov-saffron" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Install PM Internship Portal
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="text-gray-400 hover:text-gray-600 p-1 h-auto"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <p className="text-xs text-gray-600 mb-4">
                Install the app for faster access, offline functionality, and a native app experience.
              </p>

              <div className="flex items-center gap-2 mb-3">
                <Monitor className="w-4 h-4 text-gov-navy" />
                <span className="text-xs text-gray-700">Works on desktop & mobile</span>
              </div>

              {isIOS && isSafari ? (
                // iOS Safari instructions
                <div className="space-y-2">
                  <p className="text-xs text-gray-600 font-medium">To install:</p>
                  <ol className="text-xs text-gray-600 space-y-1 ml-4">
                    <li>1. Tap the Share button</li>
                    <li>2. Scroll down and tap "Add to Home Screen"</li>
                    <li>3. Tap "Add" to confirm</li>
                  </ol>
                  <Button
                    onClick={handleDismiss}
                    className="w-full mt-3 bg-gov-saffron hover:bg-gov-saffron/90 text-white text-xs py-2"
                  >
                    Got it!
                  </Button>
                </div>
              ) : (
                // Standard install button
                <div className="flex gap-2">
                  <Button
                    onClick={handleInstallClick}
                    className="flex-1 bg-gov-saffron hover:bg-gov-saffron/90 text-white text-xs py-2"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install App
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDismiss}
                    className="text-xs py-2 px-3"
                  >
                    Later
                  </Button>
                </div>
              )}

              <div className="flex items-center justify-center gap-1 mt-2">
                <div className="w-1 h-1 bg-gov-saffron rounded-full"></div>
                <div className="w-1 h-1 bg-gov-saffron rounded-full"></div>
                <div className="w-1 h-1 bg-gov-saffron rounded-full"></div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
