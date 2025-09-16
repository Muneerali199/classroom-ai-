'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { AuthService } from '@/lib/auth';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface EmailValidationInputProps {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean, exists: boolean) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function EmailValidationInput({
  value,
  onChange,
  onValidationChange,
  placeholder = "Enter email address",
  className = "",
  disabled = false
}: EmailValidationInputProps) {
  const [isChecking, setIsChecking] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [checkTimer, setCheckTimer] = useState<NodeJS.Timeout | null>(null);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  };

  const checkEmailExists = async (email: string) => {
    if (!isValidEmail(email)) {
      setEmailExists(false);
      onValidationChange?.(false, false);
      return;
    }

    setIsChecking(true);
    try {
      const exists = await AuthService.checkEmailExists();
      setEmailExists(exists);
      onValidationChange?.(true, exists);
    } catch {
      setEmailExists(false);
      onValidationChange?.(isValidEmail(email), false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Clear previous timer
    if (checkTimer) {
      clearTimeout(checkTimer);
    }

    if (value.trim()) {
      // Set new timer to check email after user stops typing
      const timer = setTimeout(() => {
        checkEmailExists(value.trim());
      }, 500);
      setCheckTimer(timer);
    } else {
      setEmailExists(false);
      setIsChecking(false);
      onValidationChange?.(false, false);
    }

    // Cleanup timer on unmount
    return () => {
      if (checkTimer) {
        clearTimeout(checkTimer);
      }
    };
  }, [value, checkEmailExists, checkTimer, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const getValidationIcon = () => {
    if (!value.trim()) return null;
    
    if (isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
    }
    
    if (!isValidEmail(value)) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    if (emailExists) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getValidationMessage = () => {
    if (!value.trim()) return null;
    
    if (isChecking) {
      return <p className="text-xs text-muted-foreground mt-1">Checking email availability...</p>;
    }
    
    if (!isValidEmail(value)) {
      return <p className="text-xs text-red-600 mt-1">Please enter a valid email address</p>;
    }
    
    if (emailExists) {
      return <p className="text-xs text-red-600 mt-1">This email address is already registered</p>;
    }
    
    return <p className="text-xs text-green-600 mt-1">Email is available</p>;
  };

  const borderColor = () => {
    if (!value.trim()) return '';
    if (isChecking) return '';
    if (!isValidEmail(value) || emailExists) return 'border-red-500';
    return 'border-green-500';
  };

  return (
    <div>
      <div className="relative">
        <Input
          type="email"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pr-8 ${borderColor()} ${className}`}
          disabled={disabled}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
          {getValidationIcon()}
        </div>
      </div>
      {getValidationMessage()}
    </div>
  );
}