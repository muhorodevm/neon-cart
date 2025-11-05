import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ React Query mutation for login
  const loginMutation = useMutation({
    mutationFn: async () => {
      const logindata = { email, password };
      const response = await authApi.login(logindata);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Login successful:", data);

      // Save token (if your API returns it)
      if (data?.token) {
        localStorage.setItem("authToken", data.token);
      }

      // Redirect to dashboard or home page
      navigate("/");
    },
    onError: (error) => {
      console.error("❌ Login failed:", error);
    },
  });

  // ✅ Prevent form reload
  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <h1 className="text-4xl font-bold text-nike-dark">NDULA</h1>
          <h2 className="mt-6 text-3xl font-bold text-nike-dark">
            Sign in to your account
          </h2>

          <p className="mt-2 text-sm text-nike-gray">
            Don't have an account?{" "}
            <Link to="/signup" className="text-nike-orange hover:underline">
              Sign up
            </Link>
          </p>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-nike-dark mb-2"
            >
              Email address
            </label>
            <input
              id="email"
              type="email"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-nike-dark mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-nike-orange focus:border-transparent"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          {/* Error message */}
          {loginMutation.isError && (
            <p className="text-red-500 text-sm font-medium mt-2">
              {loginMutation.error?.response?.data?.message ||
                loginMutation.error?.message ||
                "Login failed"}
            </p>
          )}

          {/* Remember me + forgot password */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-nike-orange focus:ring-nike-orange border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-nike-dark"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="text-nike-orange hover:underline"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full bg-nike-orange hover:bg-nike-orange/90 text-white py-3 text-lg font-semibold mt-6"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-nike-gray">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
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
