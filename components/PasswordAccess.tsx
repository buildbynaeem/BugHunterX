'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Sparkles,
  Shield,
  Key,
  ArrowRight
} from 'lucide-react';

interface PasswordAccessProps {
  eventId: string;
  eventTitle: string;
  onPasswordVerified: (password: string) => void;
}

const PasswordAccess = ({ eventId, eventTitle, onPasswordVerified }: PasswordAccessProps) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');

    try {
      // Simulate API call to verify password
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 8-character password
      // In real implementation, this would verify against the event's sponsor_password
      if (password.length === 8) {
        onPasswordVerified(password);
      } else {
        setError('Invalid password. Please try again.');
        setAttempts(prev => prev + 1);
      }
    } catch (error) {
      setError('Verification failed. Please try again.');
      setAttempts(prev => prev + 1);
    } finally {
      setIsVerifying(false);
    }
  };

  const isLocked = attempts >= 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-red-50/30 to-white">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-orange-500/5 opacity-50" />
        
        <CardHeader className="pb-4 relative z-10">
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center">
              <div
                className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 shadow-lg mx-auto mb-4"
              >
                <Shield className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                Event Access Required
              </CardTitle>
              <p className="text-sm text-gray-600 mt-2">Enter sponsor password to view analytics</p>
            </div>
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="max-w-md mx-auto">
            {/* Event Info */}
            <div className="text-center mb-6">
              <Badge variant="outline" className="mb-3 bg-blue-50 text-blue-800 border-blue-200">
                <Sparkles className="h-3 w-3 mr-1" />
                {eventTitle}
              </Badge>
              <p className="text-sm text-gray-600">
                This event requires a sponsor password for access
              </p>
            </div>

            {isLocked ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center p-6 bg-red-50 border border-red-200 rounded-lg"
              >
                <XCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
                <h3 className="font-semibold text-red-800 mb-2">Access Temporarily Locked</h3>
                <p className="text-sm text-red-600 mb-4">
                  Too many incorrect attempts. Please contact the event organizer.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAttempts(0);
                    setPassword('');
                    setError('');
                  }}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="relative">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700 mb-2 block">
                    Sponsor Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter 8-character password"
                      className="pr-20 shadow-sm focus:shadow-md transition-shadow border-2 focus:border-red-500"
                      disabled={isVerifying}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {attempts > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      Attempts: {attempts}/3
                    </p>
                  </div>
                )}

                <div>
                  <Button
                    type="submit"
                    disabled={isVerifying || password.length !== 8}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-500/90 hover:to-orange-500/90 shadow-lg"
                  >
                    {isVerifying ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Lock className="h-4 w-4" />
                        </motion.div>
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Access Analytics
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.form>
            )}

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Need the password? Contact the event organizer
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PasswordAccess;
