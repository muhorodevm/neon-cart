import jwt, { Secret, SignOptions } from 'jsonwebtoken';

export const generateToken = (userId: string, email: string): string => {
  const secret: Secret = (process.env.JWT_SECRET || '') as Secret;
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRY as unknown as SignOptions["expiresIn"]) || '7d',
  };
  return jwt.sign({ userId, email }, secret, options);
};

export const verifyToken = (token: string) => {
  const secret: Secret = (process.env.JWT_SECRET || '') as Secret;
  return jwt.verify(token, secret);
};
