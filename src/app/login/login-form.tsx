'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { AuthService } from '@/lib/auth';
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Mail, Lock, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [buttonPressed, setButtonPressed] = useState<Record<string, boolean>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const emailValue = watch('email');

  const handleButtonPress = (buttonId: string, isPressed: boolean) => {
    setButtonPressed(prev => ({ ...prev, [buttonId]: isPressed }));
  };

  const getNeumorphicStyle = (pressed = false, inset = false, size = 'normal') => {
    const shadowSize = size === 'large' ? '12px' : size === 'small' ? '4px' : '8px';
    const shadowBlur = size === 'large' ? '24px' : size === 'small' ? '8px' : '16px';
    
    return {
      background: pressed || inset ? 
        'linear-gradient(145deg, #d0d0d0, #f0f0f0)' : 
        'linear-gradient(145deg, #f0f0f0, #d0d0d0)',
      boxShadow: pressed || inset ?
        `inset ${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, inset -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff` :
        `${shadowSize} ${shadowSize} ${shadowBlur} #bebebe, -${shadowSize} -${shadowSize} ${shadowBlur} #ffffff`
    };
  };

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const result = await AuthService.signIn({
        email: data.email,
        password: data.password,
      });
      
      if (result.success) {
        setSuccess('Sign in successful! Redirecting...');
        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setError(result.error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (error: any) {
      setError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!emailValue || !emailValue.includes('@')) {
      setError('Please enter a valid email address first');
      return;
    }

    setIsResettingPassword(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await AuthService.resetPassword(emailValue);
      if (result.success) {
        setSuccess('Password reset email sent! Check your inbox.');
        setShowPasswordReset(false);
      } else {
        setError(result.error || 'Failed to send reset email');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to send reset email');
    } finally {
      setIsResettingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-red-100 border border-red-200"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-800 text-sm sm:text-base">Authentication Failed</p>
              <p className="text-xs sm:text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-green-100 border border-green-200"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-800 text-sm sm:text-base">Success!</p>
              <p className="text-xs sm:text-sm text-green-700 mt-1">{success}</p>
            </div>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
        {/* Email Field */}
        <div className="space-y-2 sm:space-y-3">
          <label className="block text-sm font-semibold text-gray-700 ml-1 sm:ml-2">
            Email Address
          </label>
          <div className="relative">
            <div
              className="rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden"
              style={{
                ...getNeumorphicStyle(false, true),
                boxShadow: focusedField === 'email' ?
                  'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff, 0 0 0 2px rgba(59, 130, 246, 0.1)' :
                  'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
              }}
            >
              <div className="flex items-center p-1">
                <div
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl mr-2 sm:mr-3 ml-1 sm:ml-2"
                  style={getNeumorphicStyle(false, false, 'small')}
                >
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 py-3 sm:py-4 pr-3 sm:pr-4 text-sm sm:text-base"
                  {...register('email')}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            </div>
            {errors.email && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-2 sm:mt-3 ml-1 sm:ml-2"
              >
                <div
                  className="p-1 sm:p-1.5 rounded-md sm:rounded-lg"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <AlertCircle className="h-3 w-3 text-red-500" />
                </div>
                <p className="text-xs sm:text-sm text-red-600 font-medium">{errors.email.message}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center justify-between ml-1 sm:ml-2">
            <label className="block text-sm font-semibold text-gray-700">
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPasswordReset(true)}
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors font-medium hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <div
              className="rounded-xl sm:rounded-2xl transition-all duration-300 overflow-hidden"
              style={{
                ...getNeumorphicStyle(false, true),
                boxShadow: focusedField === 'password' ?
                  'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff, 0 0 0 2px rgba(59, 130, 246, 0.1)' :
                  'inset 4px 4px 8px #bebebe, inset -4px -4px 8px #ffffff'
              }}
            >
              <div className="flex items-center p-1">
                <div
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl mr-2 sm:mr-3 ml-1 sm:ml-2"
                  style={getNeumorphicStyle(false, false, 'small')}
                >
                  <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 py-3 sm:py-4 text-sm sm:text-base"
                  {...register('password')}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-2 sm:p-3 rounded-lg sm:rounded-xl mr-1 sm:mr-2 text-gray-500 hover:text-gray-700 transition-colors"
                  style={getNeumorphicStyle(false, false, 'small')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 sm:h-5 sm:w-5" /> : <Eye className="h-4 w-4 sm:h-5 sm:w-5" />}
                </motion.button>
              </div>
            </div>
            {errors.password && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mt-2 sm:mt-3 ml-1 sm:ml-2"
              >
                <div
                  className="p-1 sm:p-1.5 rounded-md sm:rounded-lg"
                  style={getNeumorphicStyle(false, true, 'small')}
                >
                  <AlertCircle className="h-3 w-3 text-red-500" />
                </div>
                <p className="text-xs sm:text-sm text-red-600 font-medium">{errors.password.message}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 sm:pt-4">
          <motion.button
            type="submit" 
            disabled={isLoading || !isValid}
            className="w-full py-4 sm:py-5 px-4 sm:px-6 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg text-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3 relative overflow-hidden"
            style={getNeumorphicStyle(buttonPressed['submit'])}
            onMouseDown={() => handleButtonPress('submit', true)}
            onMouseUp={() => handleButtonPress('submit', false)}
            onMouseLeave={() => handleButtonPress('submit', false)}
            onTouchStart={() => handleButtonPress('submit', true)}
            onTouchEnd={() => handleButtonPress('submit', false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                <span className="text-sm sm:text-lg">Signing In...</span>
              </>
            ) : (
              <>
                <span className="text-sm sm:text-lg">Sign In to Dashboard</span>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </motion.button>
        </div>
      </form>

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-200/50"
          style={getNeumorphicStyle(false, true)}
        >
          <h3 className="text-base sm:text-lg font-bold text-gray-700 mb-2 sm:mb-3">Reset Your Password</h3>
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">
            Enter your email address and we'll send you a secure link to reset your password.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <motion.button
              type="button"
              onClick={handlePasswordReset}
              disabled={isResettingPassword || !emailValue}
              className="flex-1 py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm font-semibold text-gray-700 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
              style={getNeumorphicStyle(buttonPressed['reset'])}
              onMouseDown={() => handleButtonPress('reset', true)}
              onMouseUp={() => handleButtonPress('reset', false)}
              onMouseLeave={() => handleButtonPress('reset', false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isResettingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Send Reset Link</span>
                </>
              )}
            </motion.button>
            <motion.button
              type="button"
              onClick={() => setShowPasswordReset(false)}
              className="w-full sm:w-auto py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm font-semibold text-gray-600 transition-all duration-200"
              style={getNeumorphicStyle(buttonPressed['cancel'])}
              onMouseDown={() => handleButtonPress('cancel', true)}
              onMouseUp={() => handleButtonPress('cancel', false)}
              onMouseLeave={() => handleButtonPress('cancel', false)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  );
}