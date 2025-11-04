export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generatePaymentCode = (): string => {
  const prefix = 'MPY';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${timestamp}${random}`;
};
