import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";

interface OTPVerificationProps {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

export const OTPVerification = ({ email, onVerify, onResend }: OTPVerificationProps) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpValue = otp.join("");
    
    if (otpValue.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter all 6 digits",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onVerify(otpValue);
      setIsLoading(false);
    }, 1000);
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    onResend();
    toast({
      title: "OTP Resent",
      description: "A new code has been sent to your email",
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-primary/10 rounded-full">
            <Mail className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a 6-digit code to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-2 justify-center">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold"
              />
            ))}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify OTP"}
          </Button>
          <div className="text-center">
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-primary hover:underline"
            >
              Didn't receive the code? Resend
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
