'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import Preloader from '@/components/Preloader';
import { Calendar, Users, BarChart3, Smartphone, Laptop, Building, Sparkles, Zap, Target, ArrowRight, CheckCircle, Star, Award, TrendingUp } from 'lucide-react';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen">
      {/* Preloader */}
      <Preloader isLoading={isLoading} duration={2500} />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/bg-video.mp4" type="video/mp4" />
        </video>

        {/* Header positioned over video */}
        <motion.header 
          className="absolute top-0 left-0 right-0 backdrop-blur-sm z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-16 h-16 flex items-center justify-center"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <img src="/logo.png" alt="Planora Logo" className="w-16 h-16 object-contain" />
                </motion.div>
                <h1 className="text-2xl font-bold text-black">
                  Planora
                </h1>
              </motion.div>
              <div className="flex items-center space-x-4">
                <nav className="hidden md:flex space-x-6">
                  <motion.a 
                    href="/organizer" 
                    className="text-black/80 hover:text-black transition-colors font-medium"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    Organizers
                  </motion.a>
                  <motion.a 
                    href="/attendee" 
                    className="text-black/80 hover:text-black transition-colors font-medium"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    Attendees
                  </motion.a>
                  <motion.a 
                    href="/sponsor-dashboard" 
                    className="text-black/80 hover:text-black transition-colors font-medium"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sponsors
                  </motion.a>
                  <motion.a 
                    href="#features" 
                    className="text-black/80 hover:text-black transition-colors font-medium"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    Features
                  </motion.a>
                  <motion.a 
                    href="#demo" 
                    className="text-black/80 hover:text-black transition-colors font-medium"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    Demo
                  </motion.a>
                  <motion.a 
                    href="#contact" 
                    className="text-black/80 hover:text-black transition-colors font-medium"
                    whileHover={{ y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    Contact
                  </motion.a>
                </nav>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Two-Column Layout Container */}
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-6 lg:space-y-8 text-left"
            >
              {/* Headline - Bold, Black Text */}
              <motion.h1 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Unified Event Management Platform
              </motion.h1>
              
              {/* Subtext - Black Text */}
              <motion.p 
                className="text-lg sm:text-xl text-black leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Streamline your events with our comprehensive platform designed for organizers, 
                attendees, and sponsors. Experience the future of event management.
              </motion.p>
              
              {/* Buttons - Left-aligned CTAs */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 pt-4 justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                {/* Primary Button - Gradient Fill */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/attendee">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-xl px-8 py-4 shadow-lg transition-all duration-300"
                    >
                     Register for Events
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
                
                {/* Secondary Button - Outlined with Glow */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-white text-black hover:bg-white hover:text-black hover:shadow-lg hover:shadow-white/50 font-bold rounded-xl px-8 py-4 transition-all duration-300 backdrop-blur-sm"
                    >
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
            
            {/* Right Column - Empty space to showcase video background */}
            <div className="hidden lg:block">
              {/* This space intentionally left empty to showcase the video background */}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Built for Every Role</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Planora provides specialized interfaces for every stakeholder in your event ecosystem.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Organizer Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            whileHover={{ y: -10 }}
          >
            <Card className="h-full hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border-0 bg-gradient-to-br from-white via-blue-50/30 to-white group overflow-hidden">
              <CardHeader className="relative z-10">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/25 transition-shadow"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Calendar className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  For Organizers
                </CardTitle>
                <p className="text-muted-foreground mt-2">Complete event management suite</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/organizer" className="inline-block w-full">
                    <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg group">
                      Organizer Dashboard
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Attendee Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ y: -10 }}
          >
            <Card className="h-full hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white via-green-50/30 to-white group overflow-hidden">
              <CardHeader className="relative z-10">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-green-500/25 transition-shadow"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  For Attendees
                </CardTitle>
                <p className="text-muted-foreground mt-2">Seamless event experience</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/attendee" className="inline-block w-full">
                    <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-500/90 hover:to-emerald-600/90 shadow-lg group">
                       Attendee Dashboard
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sponsor Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ y: -10 }}
          >
            <Card className="h-full hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border-0 bg-gradient-to-br from-white via-purple-50/30 to-white group overflow-hidden">
              <CardHeader className="relative z-10">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/25 transition-shadow"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <BarChart3 className="h-8 w-8 text-white" />
                </motion.div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  For Sponsors
                </CardTitle>
                <p className="text-muted-foreground mt-2">Advanced analytics & insights</p>
              </CardHeader>
              <CardContent className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link href="/sponsor-dashboard" className="inline-block w-full">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-500/90 hover:to-violet-600/90 shadow-lg group">
                      Sponsor Dashboard
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              See Planora in Action
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Experience how our platform transforms event management across all stakeholder perspectives.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="bg-gradient-to-br from-gray-50 via-white to-gray-50 text-gray-900 py-16 relative overflow-hidden border-t"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-8"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Image 
                  src="/logo.png" 
                  alt="Planora Logo" 
                  width={48} 
                  height={48} 
                  className="rounded-xl"
                />
              </motion.div>
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Planora
              </h3>
            </motion.div>
            <p className="text-sm max-w-2xl mx-auto leading-relaxed mb-6" style={{ color: '#444444' }}>
          
              Experience the future of event management today.
            </p>
            <div className="mt-4 pt-4">
              <p className="text-gray-600 text-lg mb-2">
                &copy; 2025 Planora. Built for Tatva's HackWave 1.0 
               
              </p>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

