import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.util";
import { generateOTP } from "../utils/otp.util";
import {
  sendSignupEmail,
  sendPasswordResetEmail,
} from "../services/email.service";

const prisma = new PrismaClient();

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map<string, { otp: string; expiresAt: Date }>();

export async function signup(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    otpStore.set(email, { otp, expiresAt });

    // Send OTP email
    await sendSignupEmail(email, firstName, otp);

    return res.json({
      message: "OTP sent to your email",
      tempData: { email, hashedPassword, firstName, lastName },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ error: "Signup failed" });
  }
}

export async function verifySignupOTP(req: Request, res: Response) {
  try {
    const { email, otp, tempData } = req.body;

    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({ error: "OTP expired or not found" });
    }

    if (storedOTP.otp !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    if (new Date() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: tempData.email,
        passwordHash: tempData.hashedPassword,
        emailVerified: true,
        profile: {
          create: {
            firstName: tempData.firstName,
            lastName: tempData.lastName,
          },
        },
        userRoles: {
          create: {
            role: "CUSTOMER",
          },
        },
      },
    });

    otpStore.delete(email);

    const token = generateToken(user.id, user.email);

    return res.json({
      message: "Account created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({ error: "Verification failed" });
  }
}

export async function resendOTP(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const existingOTP = otpStore.get(email);
    if (!existingOTP) {
      return res.status(400).json({ error: "No pending OTP request found" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    otpStore.set(email, { otp, expiresAt });

    // Resend OTP email
    await sendSignupEmail(email, "User", otp);

    return res.json({ message: "OTP resent successfully" });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ error: "Failed to resend OTP" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { userRoles: true, profile: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Account is inactive" });
    }

    const token = generateToken(user.id, user.email);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        roles: user.userRoles.map((r) => r.role),
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
}

export async function adminLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { userRoles: true, profile: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const roles = user.userRoles.map((r) => r.role);
    const isAdmin = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
    if (!isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    if (!user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: "Account is inactive" });
    }

    const token = generateToken(user.id, user.email);

    return res.json({
      message: "Admin login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        roles,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ error: "Login failed" });
  }
}

export async function requestPasswordReset(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    otpStore.set(email, { otp, expiresAt });

    await sendPasswordResetEmail(email, user.profile?.firstName || "User", otp);

    return res.json({ message: "Password reset OTP sent to your email" });
  } catch (error) {
    console.error("Password reset request error:", error);
    return res.status(500).json({ error: "Request failed" });
  }
}

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, otp, newPassword } = req.body;

    const storedOTP = otpStore.get(email);
    if (!storedOTP || storedOTP.otp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (new Date() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ error: "OTP expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { email },
      data: { passwordHash: hashedPassword },
    });

    otpStore.delete(email);

    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset error:", error);
    return res.status(500).json({ error: "Reset failed" });
  }
}
