'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Lock, Mail, Shield, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Form validation schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const { data: session, status } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Google OAuth is always available for demo
  const isGoogleOAuthAvailable = true;

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.push('/dashboard');
    }
  }, [status, session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        switch (result.error) {
          case 'CredentialsSignin':
            setError('Invalid email or password. Please try again.');
            break;
          case 'CallbackRouteError':
            setError('Authentication failed. Please try again.');
            break;
          default:
            setError('Authentication failed. Please try again.');
        }
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Google Sign-In button clicked');
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting Google OAuth sign-in...');
      // Use real Google OAuth (credentials are configured on server side)
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false
      });

      console.log('Google OAuth result:', result);

      if (result?.error) {
        setError(`Failed to sign in with Google: ${result.error}`);
        console.error('Google OAuth error:', result.error);
      } else if (result?.ok) {
        console.log('Google OAuth successful, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        setError('Authentication failed. Please try again.');
        console.log('Google OAuth failed with no specific error');
      }
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gov-navy via-gov-blue to-gov-saffron flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated (will redirect in useEffect)
  if (status === 'authenticated') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gov-navy via-gov-blue to-gov-saffron flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gov-navy via-gov-blue to-gov-saffron flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/top.png')] bg-repeat opacity-10"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gov-saffron rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Sign in to your PM Internship account
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-gray-300 focus:border-gov-saffron focus:ring-gov-saffron"
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-12 border-gray-300 focus:border-gov-saffron focus:ring-gov-saffron"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gov-saffron hover:bg-gov-saffron/90 text-white font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {isGoogleOAuthAvailable && (
              <>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-gray-300 hover:bg-gray-50"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                >
                  <div className="flex items-center space-x-2">
                    <Image
                      src="/google-icon.png"
                      alt="Google"
                      width={20}
                      height={20}
                    />
                    <span>Sign in with Google</span>
                  </div>
                </Button>
              </>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{&apos; &apos;}
                <Link href="/register" className="text-gov-saffron hover:text-gov-saffron/80 font-medium">
                  Sign up here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-white/80 text-sm">
          <p>
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            {' • '}
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
