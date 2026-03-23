// components/home/HowItWorks.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  CreditCard, 
  PlayCircle, 
  Wallet,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  Star,
  Zap,
  Rocket,
  Gem,
  BadgeCheck
} from 'lucide-react';

const HowItWorks = () => {
  const [hoveredStep, setHoveredStep] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      icon: UserPlus,
      title: 'Create Account',
      description: 'Sign up for free in less than 2 minutes',
      color: 'blue',
      gradient: 'from-blue-500 to-cyan-500',
      lightGradient: 'from-blue-400 to-cyan-400',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-700',
      lightText: 'text-blue-600',
      darkText: 'dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100',
      darkIconBg: 'dark:bg-blue-500/20',
      iconColor: 'text-blue-600',
      darkIconColor: 'dark:text-blue-300',
      glowColor: 'rgba(59, 130, 246, 0.4)',
      shadowColor: 'rgba(59, 130, 246, 0.3)',
      stats: { time: '2 min', users: 'Free' }
    },
    {
      icon: CreditCard,
      title: 'Choose a Tier',
      description: 'Select a plan that matches your earning goals',
      color: 'purple',
      gradient: 'from-purple-500 to-pink-500',
      lightGradient: 'from-purple-400 to-pink-400',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-700',
      lightText: 'text-purple-600',
      darkText: 'dark:text-purple-300',
      borderColor: 'border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100',
      darkIconBg: 'dark:bg-purple-500/20',
      iconColor: 'text-purple-600',
      darkIconColor: 'dark:text-purple-300',
      glowColor: 'rgba(168, 85, 247, 0.4)',
      shadowColor: 'rgba(168, 85, 247, 0.3)',
      stats: { plans: '4 tiers', popular: 'Diamond' }
    },
    {
      icon: PlayCircle,
      title: 'Watch Videos',
      description: 'Earn money by watching short videos',
      color: 'green',
      gradient: 'from-green-500 to-emerald-500',
      lightGradient: 'from-green-400 to-emerald-400',
      bgLight: 'bg-green-50',
      textColor: 'text-green-700',
      lightText: 'text-green-600',
      darkText: 'dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100',
      darkIconBg: 'dark:bg-green-500/20',
      iconColor: 'text-green-600',
      darkIconColor: 'dark:text-green-300',
      glowColor: 'rgba(34, 197, 94, 0.4)',
      shadowColor: 'rgba(34, 197, 94, 0.3)',
      stats: { reward: '₹0.50', videos: '1000+' }
    },
    {
      icon: Wallet,
      title: 'Earn & Withdraw',
      description: 'Withdraw your earnings instantly',
      color: 'orange',
      gradient: 'from-orange-500 to-red-500',
      lightGradient: 'from-orange-400 to-red-400',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-700',
      lightText: 'text-orange-600',
      darkText: 'dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800',
      iconBg: 'bg-orange-100',
      darkIconBg: 'dark:bg-orange-500/20',
      iconColor: 'text-orange-600',
      darkIconColor: 'dark:text-orange-300',
      glowColor: 'rgba(249, 115, 22, 0.4)',
      shadowColor: 'rgba(249, 115, 22, 0.3)',
      stats: { min: '₹100', speed: 'Instant' }
    },
  ];

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
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 45, 0],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, -45, 0],
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />
        
        {/* Animated Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.5, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
          />
        ))}

        {/* Premium Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Premium Style */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm rounded-full border border-blue-500/20 mb-6"
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Simple 4-Step Process</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </motion.div>

          {/* Main Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            <span className="text-white">How It</span>{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Works
              </span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"
              />
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-400 max-w-2xl mx-auto"
          >
            Start earning in just 4 simple steps. No complicated setup, no hidden fees.
          </motion.p>

          {/* Floating Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-6 mt-8"
          >
            {[
              { icon: Clock, text: 'Takes less than 5 min', color: 'from-blue-400 to-blue-600' },
              { icon: TrendingUp, text: 'Start earning today', color: 'from-green-400 to-green-600' },
              { icon: Shield, text: '100% secure', color: 'from-purple-400 to-purple-600' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full border border-white/10"
                >
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${item.color} p-1`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300">{item.text}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isHovered = hoveredStep === index;
            const isActive = activeStep === index;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredStep(index)}
                onHoverEnd={() => setHoveredStep(null)}
                onClick={() => setActiveStep(index)}
                className="relative group cursor-pointer"
              >
                {/* Premium Glow Effect */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 0.6 : 0,
                    scale: isHovered ? 1.1 : 0.9,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at center, ${step.shadowColor} 0%, transparent 70%)`,
                    filter: 'blur(20px)',
                    zIndex: 0,
                  }}
                />

                {/* Main Card */}
                <motion.div
                  animate={{
                    y: isHovered ? -10 : 0,
                    scale: isHovered ? 1.03 : 1,
                    boxShadow: isHovered 
                      ? `0 30px 40px -15px ${step.shadowColor}, 0 0 0 1px rgba(255,255,255,0.2)` 
                      : '0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`relative p-8 rounded-2xl overflow-hidden bg-gray-800/50 backdrop-blur-sm border ${step.borderColor}`}
                  style={{
                    borderWidth: isActive ? '2px' : '1px',
                    zIndex: 1,
                  }}
                >
                  {/* Animated Background Pattern */}
                  <motion.div
                    animate={{
                      rotate: isHovered ? [0, 360] : 0,
                      scale: isHovered ? 1.2 : 1,
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -right-10 -top-10 w-40 h-40 opacity-5"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, ${step.color === 'blue' ? '#3b82f6' : step.color === 'purple' ? '#a855f7' : step.color === 'green' ? '#22c55e' : '#f97316'} 1px, transparent 0)`,
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Step Number with Premium Animation */}
                  <motion.div
                    animate={{
                      scale: isHovered ? 1.2 : 1,
                      rotate: isHovered ? 360 : 0,
                    }}
                    transition={{ duration: 0.5 }}
                    className={`absolute -top-3 -right-3 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-xl z-10 bg-gradient-to-r ${step.gradient}`}
                  >
                    {index + 1}
                  </motion.div>

                  {/* Icon with Premium Effects */}
                  <div className="relative mb-6">
                    <motion.div
                      animate={{
                        rotate: isHovered ? [0, -10, 10, 0] : 0,
                        scale: isHovered ? [1, 1.15, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                      className={`relative w-24 h-24 mx-auto ${step.iconBg} ${step.darkIconBg} rounded-2xl flex items-center justify-center`}
                    >
                      <Icon className={`w-12 h-12 ${step.iconColor} ${step.darkIconColor}`} />
                      
                      {/* Pulsing Glow */}
                      <motion.div
                        animate={{
                          scale: isHovered ? [1, 1.3, 1] : 1,
                          opacity: isHovered ? 0.5 : 0,
                        }}
                        transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0 }}
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: `radial-gradient(circle at center, ${step.glowColor} 0%, transparent 70%)`,
                          filter: 'blur(12px)',
                        }}
                      />
                    </motion.div>

                    {/* Floating Stats Badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0 }}
                      className="absolute -bottom-2 -right-2 bg-gray-900 rounded-full px-3 py-1 border border-white/10 shadow-xl"
                    >
                      <span className={`text-xs font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                        {Object.values(step.stats)[0]}
                      </span>
                    </motion.div>
                  </div>

                  {/* Title with Gradient on Hover */}
                  <motion.h3 
                    animate={{
                      color: isHovered ? step.color : '#fff',
                    }}
                    className="text-2xl font-bold mb-3 text-center text-white"
                  >
                    {step.title}
                  </motion.h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm text-center mb-6">
                    {step.description}
                  </p>

                  {/* Premium Stats Row */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {Object.entries(step.stats).map(([key, value], i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="text-center p-2 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="text-[10px] text-gray-500 uppercase">{key}</div>
                        <div className={`text-sm font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                          {value}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Benefits List */}
                  <div className="space-y-2 mb-6">
                    {[
                      'Free registration',
                      'No credit card',
                      'Instant access',
                    ].map((benefit, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${step.gradient} p-0.5 flex items-center justify-center`}>
                          <CheckCircle className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-sm text-gray-300">{benefit}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* Interactive Progress Bar */}
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: isHovered ? '100%' : '0%' }}
                    transition={{ duration: 0.3 }}
                    className="h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"
                  />

                  {/* Hover Indicator */}
                  <motion.div
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                    className="mt-4 text-center"
                  >
                    <span className={`inline-flex items-center gap-1 text-sm font-medium bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </motion.div>
                </motion.div>

                {/* Animated Connector Line with Flowing Effect */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                    className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5"
                  >
                    <motion.div
                      animate={{
                        background: [
                          `linear-gradient(90deg, ${step.glowColor}, ${steps[index + 1].glowColor})`,
                          `linear-gradient(90deg, ${steps[index + 1].glowColor}, ${step.glowColor})`,
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0"
                    />
                    
                    {/* Animated Arrow */}
                    <motion.div
                      animate={{
                        x: [0, 8, 0],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -right-2 -top-2"
                    >
                      <div className={`w-4 h-4 border-t-2 border-r-2 rounded-sm`}
                        style={{ borderColor: steps[index + 1].color }}
                      />
                    </motion.div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          {/* CTA Button */}
          <motion.a
            href="#plans"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold shadow-xl overflow-hidden group"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Journey
              <Rocket className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </span>
            
            {/* Button Glow */}
            <motion.div
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-white rounded-full blur-xl"
            />
            
            {/* Shine Effect */}
            <motion.div
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.a>
          
          {/* Social Proof */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="mt-6"
          >
            <p className="text-sm text-gray-400 mb-3">
              Join <span className="font-semibold text-white">50,000+</span> users already earning
            </p>

            {/* Rating Stars */}
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="cursor-pointer"
                >
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </motion.div>
              ))}
              <span className="text-sm text-gray-400 ml-2">
                4.9 (2.5k+ reviews)
              </span>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              {[
                { icon: BadgeCheck, text: 'Verified Platform' },
                { icon: Gem, text: 'Premium Service' },
                { icon: Zap, text: 'Fast & Reliable' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-1.5"
                  >
                    <Icon className="w-4 h-4 text-gray-500" />
                    <span className="text-xs text-gray-500">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;