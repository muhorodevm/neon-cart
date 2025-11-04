import jwt from 'jsonwebtoken';

export const generateToken = (userId: string, email: string): string => {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, process.env.JWT_SECRET!);
};
