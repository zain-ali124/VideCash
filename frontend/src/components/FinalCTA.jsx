// components/home/FinalCTA.jsx
import React, { useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  DollarSign, 
  Users, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  Gift,
  Zap,
  Star,
  Award,
  TrendingUp
} from 'lucide-react';

const FinalCTA = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 23, minutes: 59, seconds: 59 }; // Reset
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const trustBadges = [
    { icon: Shield, text: 'Bank-Grade Security', color: 'blue' },
    { icon: Clock, text: 'Instant Payouts', color: 'green' },
    { icon: DollarSign, text: 'No Hidden Fees', color: 'yellow' },
    { icon: Users, text: '50K+ Happy Earners', color: 'purple' },
  ];

  const features = [
    { text: 'No Credit Card Required', icon: CheckCircle },
    { text: 'Instant Withdrawals', icon: Zap },
    { text: '24/7 Priority Support', icon: Star },
    { text: 'Daily Bonus Rewards', icon: Gift },
    { text: 'Referral Commission', icon: Users },
    { text: 'Advanced Analytics', icon: TrendingUp },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Animated gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
        />
        
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating Elements */}
      <motion.div
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
        className="absolute top-20 right-20 hidden lg:block"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-900" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Limited Time Offer</p>
              <p className="text-white/80 text-xs">Join now & get 2x bonus</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={floatingAnimation}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.5 }}
        className="absolute bottom-20 left-20 hidden lg:block"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-900" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Today's Earnings</p>
              <p className="text-white/80 text-xs">$12,450 paid out</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center"
        >
          {/* Limited Time Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-white/90 text-sm font-medium">Limited Time Offer</span>
            <Sparkles className="w-4 h-4 text-yellow-300" />
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Ready to Start{' '}
            <span className="relative">
              <span className="relative z-10 text-yellow-300">Earning?</span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute bottom-2 left-0 h-3 bg-yellow-400/30 -z-10 rounded-full"
              />
            </span>
          </motion.h2>

          {/* Sub-headline with gradient */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join <span className="font-bold text-yellow-300">50,000+</span> users who are already earning daily with VidCash. 
            No experience needed – just start watching and earning!
          </motion.p>

          {/* Countdown Timer */}
          <motion.div
            variants={itemVariants}
            className="flex justify-center gap-4 mb-8"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-white">{timeLeft.hours}</div>
              <div className="text-xs text-white/60">Hours</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-white">{timeLeft.minutes}</div>
              <div className="text-xs text-white/60">Minutes</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 min-w-[80px]">
              <div className="text-3xl font-bold text-white">{timeLeft.seconds}</div>
              <div className="text-xs text-white/60">Seconds</div>
            </div>
          </motion.div>

          {/* CTA Buttons with advanced hover effects */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link
              to="/register"
              className="group relative px-8 py-4 bg-white text-blue-600 rounded-full font-semibold overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Create Free Account
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                initial={false}
                whileHover={{ scale: 1.5 }}
                className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </Link>

            <a
              href="#plans"
              className="group relative px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Plans
                <Zap className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </span>
              <motion.div
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-white/20"
              />
            </a>
          </motion.div>

          {/* Trust badges with glass morphism */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {trustBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="group relative"
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full border border-white/20 flex items-center gap-2">
                    <Icon className={`w-4 h-4 text-${badge.color}-300`} />
                    <span className="text-white/90 text-sm font-medium">{badge.text}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Features grid with hover effects */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="p-3 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-4 h-4 text-yellow-300" />
                    <span className="text-white/90 text-sm">{feature.text}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={itemVariants}
            className="mt-12 pt-8 border-t border-white/10"
          >
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm">
              <span>🔒 256-bit SSL Encryption</span>
              <span>⚡ Instant Withdrawals</span>
              <span>🌍 Global Community</span>
              <span>📱 Mobile Optimized</span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path 
            fill="#ffffff" 
            fillOpacity="0.1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default FinalCTA;