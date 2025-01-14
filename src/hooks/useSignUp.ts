import { useState, ChangeEvent, FormEvent } from 'react';
import { auth } from '../lib/auth';
import { validateEmail, validatePassword, validatePhone } from '../utils/validation';
import { AUTH_ERRORS } from '../constants/auth';
import type { SignUpData } from '../types/auth';

interface FormErrors {
  email?: string;
  password?: string;
  name?: string;
  phone?: string;
  address?: string;
}

export const useSignUp = () => {
  const [formData, setFormData] = useState<SignUpData>({
    email: '',
    password: '',
    name: '',
    phone: '',
    company_name: '',
    address: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateEmail(formData.email)) {
      newErrors.email = AUTH_ERRORS.INVALID_EMAIL;
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = AUTH_ERRORS.INVALID_PASSWORD;
    }

    if (formData.name.trim().length < 2) {
      newErrors.name = AUTH_ERRORS.INVALID_NAME;
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = AUTH_ERRORS.INVALID_PHONE;
    }

    if (formData.address.trim().length < 5) {
      newErrors.address = AUTH_ERRORS.INVALID_ADDRESS;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (errors[id as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await auth.signUp(formData);
    } catch (err) {
      setErrors(prev => ({
        ...prev,
        email: err instanceof Error ? err.message : AUTH_ERRORS.SIGN_UP_FAILED
      }));
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    errors,
    loading,
    handleChange,
    handleSubmit
  };
};