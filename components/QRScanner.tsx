'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  QrCode, 
  Camera, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  User,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Target,
  Award,
  Keyboard,
  Loader2
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { useEvents } from '@/lib/event-context';

interface VerificationResult {
  success: boolean;
  attendee?: any;
  event?: any;
  message: string;
  timestamp: string;
}

const QRScanner = () => {
  const { events, attendees, updateAttendee } = useEvents();
  const [isScanning, setIsScanning] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<VerificationResult[]>([]);
  const [manualInput, setManualInput] = useState('');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    // Initialize ZXing reader on component mount
    try {
      if (!readerRef.current) {
        readerRef.current = new BrowserMultiFormatReader();
        console.log('ZXing reader initialized on mount');
      }
    } catch (error) {
      console.error('Error initializing ZXing reader:', error);
    }
    
    return () => {
      console.log('QRScanner component unmounting, cleaning up...');
      
      // Clean up ZXing reader
      if (readerRef.current) {
        try {
          readerRef.current.reset();
          console.log('ZXing reader cleaned up on unmount');
        } catch (error) {
          console.error('Error cleaning up ZXing reader on unmount:', error);
        }
      }
      
      // Clean up video streams
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('Stopped media track on unmount:', track.kind);
        });
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      // Ensure ZXing reader is initialized
      if (!readerRef.current) {
        console.log('Initializing ZXing reader...');
        readerRef.current = new BrowserMultiFormatReader();
      }

      setCameraError(null);
      setResult(null);
      setShowResult(false);
      setIsInitializing(true);
      setIsScanning(false);

      if (!videoRef.current) {
        console.error('Video element not available after initialization');
        const errorMessage = 'Video element not found. Please refresh the page and try again.';
        setCameraError(errorMessage);
        setResult({
          success: false,
          message: errorMessage,
          timestamp: new Date().toISOString()
        });
        setShowResult(true);
        setIsInitializing(false);
        return;
      }

      const videoElement = videoRef.current;
      
      console.log('Starting camera...');
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      // Request camera access with specific constraints
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment', // Prefer back camera
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
      } catch (permissionError) {
         console.error('Camera permission denied:', permissionError);
         setIsInitializing(false);
         setIsScanning(false);
         const errorMessage = 'Camera access denied. Please allow camera permissions in your browser settings and try again.';
         setCameraError(errorMessage);
         setResult({
           success: false,
           message: errorMessage,
           timestamp: new Date().toISOString()
         });
         setShowResult(true);
         return;
       }

      // Set up video element
      videoElement.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Video element failed to load within 10 seconds'));
        }, 10000);

        videoElement.onloadedmetadata = () => {
          clearTimeout(timeout);
          videoElement.play()
            .then(() => {
              console.log('Video element ready and playing');
              resolve();
            })
            .catch(reject);
        };

        videoElement.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Video element failed to load'));
        };
      });

      // Start the ZXing scanner
      try {
        await readerRef.current.decodeFromVideoDevice(
          null, // Use default camera device
          videoElement,
          (result, error) => {
            if (result) {
              console.log('QR Code detected:', result.getText());
              handleQRCode(result.getText());
              stopScanning(); // Stop scanning after successful read
            }
            if (error && !(error.name === 'NotFoundException')) {
              console.error('Scanner error:', error);
              // Don't show errors for NotFoundException as it's normal when no QR code is found
            }
          }
        );
         
         setIsInitializing(false);
         setIsScanning(true);
         setCameraError(null);
         console.log('Camera and scanner started successfully');
       } catch (scannerError) {
         console.error('ZXing scanner error:', scannerError);
         // Clean up the stream if scanner fails
         stream.getTracks().forEach(track => track.stop());
         videoElement.srcObject = null;
         setIsInitializing(false);
         setIsScanning(false);
         throw scannerError;
       }
      
    } catch (error) {
      console.error('Error starting camera:', error);
      setIsInitializing(false);
      setIsScanning(false);
      const errorMessage = `Failed to access camera: ${error instanceof Error ? error.message : 'Unknown error'}. Please check camera permissions and try again.`;
      setCameraError(errorMessage);
      setResult({
        success: false,
        message: errorMessage,
        timestamp: new Date().toISOString()
      });
      setShowResult(true);
    }
  };

  const stopScanning = () => {
    try {
      console.log('Stopping camera and scanner...');
      
      // Reset the ZXing reader
      if (readerRef.current) {
        try {
          readerRef.current.reset();
          console.log('ZXing reader reset successfully');
        } catch (readerError) {
          console.error('Error resetting ZXing reader:', readerError);
        }
      }
      
      // Stop video streams and clear video element
      if (videoRef.current) {
        // Stop all media tracks
        if (videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => {
            track.stop();
            console.log('Stopped media track:', track.kind);
          });
        }
        
        // Clear video element
        videoRef.current.srcObject = null;
        videoRef.current.pause();
        
        // Remove event listeners
        videoRef.current.onloadedmetadata = null;
        videoRef.current.onerror = null;
        
        console.log('Video element cleaned up');
      }
      
      setIsScanning(false);
      setIsInitializing(false);
      setCameraError(null);
      console.log('Camera and scanner stopped successfully');
    } catch (error) {
      console.error('Error stopping camera:', error);
      setIsScanning(false);
      setIsInitializing(false);
    }
  };

  const handleQRCode = async (qrData: string) => {
    console.log('QR Code scanned:', qrData);
    
    try {
      // Parse QR data - expected format: "EventTitle_AttendeeName_Timestamp"
      const parts = qrData.split('_');
      console.log('QR parts:', parts);
      
      if (parts.length < 3) {
        setResult({
          success: false,
          message: `Invalid QR code format. Expected format: EventTitle_AttendeeName_Timestamp. Got: ${qrData}`,
          timestamp: new Date().toLocaleString()
        });
        setShowResult(true);
        return;
      }

      const eventTitle = parts[0];
      const attendeeName = parts[1];
      const timestamp = parts[2];

      console.log('Looking for event:', eventTitle);
      console.log('Looking for attendee:', attendeeName);
      console.log('Available events:', events.map(e => e.title));
      console.log('Available attendees:', attendees.map(a => a.name));

      // Find matching event
      const event = events.find(e => e.title === eventTitle);
      if (!event) {
        setResult({
          success: false,
          message: `Event "${eventTitle}" not found. Available events: ${events.map(e => e.title).join(', ')}`,
          timestamp: new Date().toLocaleString()
        });
        setShowResult(true);
        return;
      }

      // Find matching attendee
      const attendee = attendees.find(a => 
        a.name === attendeeName && a.event_id === event.id
      );
      
      if (!attendee) {
        setResult({
          success: false,
          message: `Attendee "${attendeeName}" not found for event "${eventTitle}". Available attendees for this event: ${attendees.filter(a => a.event_id === event.id).map(a => a.name).join(', ')}`,
          timestamp: new Date().toLocaleString()
        });
        setShowResult(true);
        return;
      }

      // Check if attendee has paid
      if (!attendee.paid) {
        setResult({
          success: false,
          attendee,
          event,
          message: `Payment not confirmed for ${attendeeName}. Payment status: ${attendee.paid ? 'paid' : 'unpaid'}`,
          timestamp: new Date().toLocaleString()
        });
        setShowResult(true);
        return;
      }

      // Check if already verified
      if (attendee.verified) {
        setResult({
          success: false,
          attendee,
          event,
          message: `${attendeeName} has already been verified for ${eventTitle}`,
          timestamp: new Date().toLocaleString()
        });
        setShowResult(true);
        return;
      }

      // Update attendee verification status
      await updateAttendee(attendee.id, { 
        verified: true,
        verified_at: new Date().toISOString()
      });

      const updatedAttendee = {
        ...attendee,
        verified: true,
        verified_at: new Date().toISOString()
      };

      const successResult = {
        success: true,
        attendee: updatedAttendee,
        event,
        message: `✅ ${attendeeName} successfully verified for ${eventTitle}!`,
        timestamp: new Date().toLocaleString()
      };

      setResult(successResult);
      setVerificationHistory(prev => [successResult, ...prev.slice(0, 9)]);
      setShowResult(true);

      console.log('Verification successful:', successResult);

    } catch (error) {
      console.error('Error processing QR code:', error);
      setResult({
        success: false,
        message: `Error processing QR code: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toLocaleString()
      });
      setShowResult(true);
    }
  };

  const addToHistory = (verification: VerificationResult) => {
    setVerificationHistory(prev => [verification, ...prev.slice(0, 9)]); // Keep last 10
  };

  const handleResultClose = () => {
    if (result) {
      addToHistory(result);
    }
    setShowResult(false);
    setResult(null);
  };

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle className="h-6 w-6 text-green-500" />;
    } else {
      return <XCircle className="h-6 w-6 text-red-500" />;
    }
  };

  const getStatusColor = (success: boolean) => {
    return success 
      ? 'bg-green-50 border-green-200 text-green-800' 
      : 'bg-red-50 border-red-200 text-red-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="w-full overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white via-blue-50/50 to-white">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50" />
        
        <CardHeader className="pb-4 relative z-10">
          <motion.div 
            className="flex items-center justify-between"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
                className="p-3 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg"
              >
                <QrCode className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  QR Verification
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">Scan attendee tickets at venue</p>
              </div>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={isScanning ? stopScanning : startScanning}
                disabled={isInitializing}
                className={`${
                  isScanning 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-500/90 hover:to-red-600/90' 
                    : isInitializing
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                    : 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90'
                } shadow-lg`}
              >
                {isInitializing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4 mr-2" />
                )}
                {isInitializing ? 'Initializing Camera...' : isScanning ? 'Stop Scanning' : 'Start Scanning'}
              </Button>
            </motion.div>
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10">
          {/* Manual Input Section */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Keyboard className="h-4 w-4" />
              Manual QR Code Input
            </h3>
            <div className="flex gap-2">
              <Input
                placeholder="Enter QR code data for testing..."
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={() => {
                  if (manualInput.trim()) {
                    handleQRCode(manualInput.trim());
                    setManualInput('');
                  }
                }}
                variant="outline"
                disabled={!manualInput.trim()}
              >
                Test
              </Button>
            </div>
          </div>

          {/* Error Display Section */}
          {cameraError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800">Camera Error</h4>
                  <p className="text-sm text-red-700 mt-1">{cameraError}</p>
                  <div className="mt-2 text-xs text-red-600">
                    <p>• Make sure your browser has camera permissions</p>
                    <p>• Check if another application is using the camera</p>
                    <p>• Try refreshing the page and allowing camera access</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Scanner Interface */}
          <div className="mb-6 relative">
            {/* Single video element that's always present */}
            <video
              ref={videoRef}
              className="w-full h-64 object-cover rounded-lg"
              autoPlay
              playsInline
              style={{ display: isScanning ? 'block' : 'none' }}
            />
            
            {isInitializing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
              >
                <div className="text-center">
                  <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-blue-700 font-medium">Initializing Camera...</p>
                  <p className="text-blue-600 text-sm mt-2">Please allow camera access when prompted</p>
                </div>
              </motion.div>
            ) : isScanning ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <motion.div
                  className="w-48 h-48 border-2 border-primary rounded-lg"
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <p className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                    Point camera at QR code
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center"
              >
                <div className="text-center">
                  <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Click "Start Scanning" to begin</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Verification History */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Verifications
            </h3>
            
            {verificationHistory.length === 0 ? (
              <p className="text-gray-500 text-sm">No verifications yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <AnimatePresence>
                  {verificationHistory.map((verification, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-3 rounded-lg border ${getStatusColor(verification.success)}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(verification.success)}
                          <div>
                            <p className="font-medium text-sm">
                              {verification.attendee?.name || 'Unknown'}
                            </p>
                            <p className="text-xs opacity-75">
                              {verification.event?.title || 'Unknown Event'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium">
                            {new Date(verification.timestamp).toLocaleTimeString()}
                          </p>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              verification.success 
                                ? 'border-green-300 text-green-700' 
                                : 'border-red-300 text-red-700'
                            }`}
                          >
                            {verification.success ? 'Verified' : 'Failed'}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </CardContent>

        {/* Result Dialog */}
        <Dialog open={showResult} onOpenChange={handleResultClose}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {result && getStatusIcon(result.success)}
                {result?.success ? 'Verification Successful' : 'Verification Failed'}
              </DialogTitle>
            </DialogHeader>
            
            {result && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border ${getStatusColor(result.success)}`}>
                  <p className="font-medium">{result.message}</p>
                  {result.success && result.attendee && result.event && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4" />
                        <span>{result.attendee.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4" />
                        <span>{result.event.title}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        <span>{result.event.venue}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(result.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleResultClose}
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                  >
                    {result.success ? 'Continue Scanning' : 'Try Again'}
                  </Button>
                  <Button 
                    onClick={() => {
                      handleResultClose();
                      startScanning();
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Scan Another
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </Card>
    </motion.div>
  );
};

export default QRScanner;
