import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordPolicyProps {
  password: string;
  className?: string;
}

export function PasswordPolicy({ password, className }: PasswordPolicyProps) {
  const checks = [
    {
      label: 'At least 6 characters',
      valid: password.length >= 6,
    },
    {
      label: 'Contains an uppercase letter',
      valid: /[A-Z]/.test(password),
    },
    {
      label: 'Contains a lowercase letter',
      valid: /[a-z]/.test(password),
    },
    {
      label: 'Contains a number',
      valid: /[0-9]/.test(password),
    },
    {
      label: 'Contains a special character',
      valid: /[^A-Za-z0-9]/.test(password),
    },
  ];

  return (
    <div className={cn('text-sm space-y-1 mt-2', className)}>
      {checks.map((check, index) => (
        <div key={index} className="flex items-center">
          {check.valid ? (
            <Check className="h-3 w-3 text-green-500 mr-2" />
          ) : (
            <X className="h-3 w-3 text-gray-400 mr-2" />
          )}
          <span
            className={cn(
              'text-xs',
              check.valid ? 'text-green-600' : 'text-muted-foreground'
            )}
          >
            {check.label}
          </span>
        </div>
      ))}
    </div>
  );
}