
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { OTPVerification } from '@/components/auth/OTPVerification';

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [tempData, setTempData] = useState<any>(null);
  const navigate = useNavigate();

  const signupMutation = useMutation({
    mutationFn: async () => {
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      const response = await authApi.signup({ email, password, firstName, lastName, phone });
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success('OTP sent to your email!');
      setTempData(data.tempData);
      setShowOTP(true);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || error.message || 'Signup failed');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate();
  };

  const verifyOTPMutation = useMutation({
    mutationFn: async (otp: string) => {
      const response = await authApi.verifyOtp({ email, otp, tempData });
      return response.data;
    },
    onSuccess: (data: any) => {
      toast.success('Account created successfully!');
      if (data?.token) {
        localStorage.setItem('authToken', data.token);
      }
      navigate('/login');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'OTP verification failed');
    },
  });

  const resendOTPMutation = useMutation({
    mutationFn: async () => {
      const response = await authApi.resendOtp({ email });
      return response.data;
    },
    onSuccess: () => {
      toast.success('OTP resent successfully!');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error || 'Failed to resend OTP');
    },
  });

  const handleOTPVerify = (otp: string) => {
    verifyOTPMutation.mutate(otp);
  };

  const handleOTPResend = () => {
    resendOTPMutation.mutate();
  };

  if (showOTP) {
    return <OTPVerification email={email} onVerify={handleOTPVerify} onResend={handleOTPResend} />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-nike-dark">NDULA</h1>
          <h2 className="mt-6 text-3xl font-bold text-nike-dark">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-nike-gray">
            Already have an account?{' '}
            <Link to="/login" className="text-nike-orange hover:underline">
              Sign in here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-nike-dark mb-2">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                placeholder="First name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-nike-dark mb-2">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-nike-dark mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-nike-dark mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
              placeholder="0712345678"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-nike-dark mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                placeholder="Create a password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-nike-gray" />
                ) : (
                  <Eye className="h-5 w-5 text-nike-gray" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-nike-dark mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-nike-gray" />
                ) : (
                  <Eye className="h-5 w-5 text-nike-gray" />
                )}
              </button>
            </div>
          </div>

          {signupMutation.isError && (
            <p className="text-red-500 text-sm font-medium">
              {(signupMutation.error as any)?.response?.data?.error || 
               (signupMutation.error as any)?.message || 
               'Signup failed'}
            </p>
          )}

          <div className="flex items-center">
            <input
              id="agree-terms"
              name="agree-terms"
              type="checkbox"
              required
              className="h-4 w-4 text-nike-orange border-gray-300 rounded focus:ring-nike-orange"
            />
            <label htmlFor="agree-terms" className="ml-2 block text-sm text-nike-gray">
              I agree to the{' '}
              <a href="#" className="text-nike-orange hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-nike-orange hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>

          <Button
            type="submit"
            disabled={signupMutation.isPending}
            className="w-full bg-nike-orange hover:bg-nike-orange/90 text-white py-3 text-lg font-semibold"
          >
            {signupMutation.isPending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
