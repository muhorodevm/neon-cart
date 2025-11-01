
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-nike-dark">NDULA</h1>
          <h2 className="mt-6 text-3xl font-bold text-nike-dark">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-nike-gray">
            Don't have an account?{' '}
            <Link to="/signup" className="text-nike-orange hover:underline">
              Sign up here
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-nike-dark mb-2">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
              placeholder="Enter your email"
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
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                placeholder="Enter your password"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-nike-orange border-gray-300 rounded focus:ring-nike-orange"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-nike-gray">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-nike-orange hover:underline">
                Forgot your password?
              </a>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-nike-orange hover:bg-nike-orange/90 text-white py-3 text-lg font-semibold"
          >
            Sign In
          </Button>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-nike-gray">Or continue with</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                Google
              </Button>
              <Button variant="outline" className="w-full">
                Apple
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
