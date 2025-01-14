// Validation utilities
export const validateEmail = (email: string): boolean => {
  return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
};

export const validatePhone = (phone: string): boolean => {
  return /^\+?[0-9\s-()]+$/.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};