// components/home/Tiers.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Check, 
  Star, 
  TrendingUp, 
  Video, 
  DollarSign,
  Award,
  Zap,
  Shield,
  Sparkles,
  Crown,
  ArrowRight,
  Clock,
  Users,
  Gem,
  Flame,
  Rocket,
  BadgeCheck
} from 'lucide-react';

const Tiers = () => {
  const [hoveredTier, setHoveredTier] = useState(null);
  const [selectedTier, setSelectedTier] = useState('Diamond');

  const tiers = [
    {
      name: 'Bronze',
      price: '1,000',
      multiplier: '1x',
      dailyLimit: '20',
      maxVideos: '2',
      color: 'orange',
      gradient: 'from-orange-500 to-amber-500',
      lightGradient: 'from-orange-400 to-amber-400',
      icon: '🥉',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      darkIconBg: 'dark:bg-orange-500/20',
      darkIconColor: 'dark:text-orange-300',
      borderColor: 'border-orange-200 dark:border-orange-800',
      shadowColor: 'rgba(249, 115, 22, 0.3)',
      features: [
        'Basic earnings',
        'Standard support',
        'Daily payouts',
        'Access to basic videos'
      ],
      stats: {
        earnings: '₹500/day',
        users: '10K+',
        payout: 'Daily'
      }
    },
    {
      name: 'Silver',
      price: '3,000',
      multiplier: '1.5x',
      dailyLimit: '40',
      maxVideos: '5',
      color: 'gray',
      gradient: 'from-gray-500 to-slate-500',
      lightGradient: 'from-gray-400 to-slate-400',
      icon: '🥈',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      darkIconBg: 'dark:bg-gray-500/20',
      darkIconColor: 'dark:text-gray-300',
      borderColor: 'border-gray-200 dark:border-gray-700',
      shadowColor: 'rgba(107, 114, 128, 0.3)',
      features: [
        '1.5x earnings',
        'Priority support',
        'Bonus videos',
        'Weekly rewards'
      ],
      stats: {
        earnings: '₹750/day',
        users: '15K+',
        payout: 'Daily'
      }
    },
    {
      name: 'Gold',
      price: '7,000',
      multiplier: '2x',
      dailyLimit: '60',
      maxVideos: '7',
      color: 'yellow',
      gradient: 'from-yellow-500 to-amber-500',
      lightGradient: 'from-yellow-400 to-amber-400',
      icon: '🥇',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      darkIconBg: 'dark:bg-yellow-500/20',
      darkIconColor: 'dark:text-yellow-300',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      shadowColor: 'rgba(234, 179, 8, 0.3)',
      features: [
        '2x earnings',
        'VIP support',
        'Exclusive content',
        'Monthly bonus'
      ],
      stats: {
        earnings: '₹1,000/day',
        users: '20K+',
        payout: 'Instant'
      }
    },
    {
      name: 'Diamond',
      price: '15,000',
      multiplier: '3x',
      dailyLimit: '80',
      maxVideos: '11',
      color: 'blue',
      gradient: 'from-blue-500 to-indigo-500',
      lightGradient: 'from-blue-400 to-indigo-400',
      icon: '💎',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      darkIconBg: 'dark:bg-blue-500/20',
      darkIconColor: 'dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800',
      shadowColor: 'rgba(59, 130, 246, 0.3)',
      isPopular: true,
      features: [
        '3x earnings',
        '24/7 priority support',
        'Maximum earnings',
        'Early access'
      ],
      stats: {
        earnings: '₹1,500/day',
        users: '5K+',
        payout: 'Instant'
      }
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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="plans" className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Premium Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
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
            rotate: [0, -90, 0],
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
        {[...Array(20)].map((_, i) => (
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
              opacity: [0.1, 0.3, 0.1],
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
            <Crown className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-gray-300">Premium Plans for Maximum Earnings</span>
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
            <span className="text-white">Choose Your</span>{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Earning Plan
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
            Select the perfect plan for your goals. Upgrade anytime as you grow.
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
              { icon: Users, text: '50K+ Active', color: 'from-blue-400 to-blue-600' },
              { icon: Rocket, text: 'Instant Payouts', color: 'from-green-400 to-green-600' },
              { icon: Shield, text: 'Bank Secure', color: 'from-purple-400 to-purple-600' },
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

        {/* Tiers Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {tiers.map((tier, index) => {
            const isHovered = hoveredTier === index;
            const isSelected = selectedTier === tier.name;

            return (
              <motion.div
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredTier(index)}
                onHoverEnd={() => setHoveredTier(null)}
                onClick={() => setSelectedTier(tier.name)}
                className="relative group cursor-pointer"
              >
                {/* Popular Badge - Premium */}
                {tier.isPopular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                    whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8, type: 'spring' }}
                    className="absolute -top-3 -right-3 z-20"
                  >
                    <div className="relative">
                      {/* Glow effect */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-yellow-400 rounded-full blur-md"
                      />
                      <div className="relative flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-400 text-amber-900 rounded-full text-xs font-bold shadow-xl">
                        <Star className="w-3 h-3 fill-amber-900" />
                        MOST POPULAR
                        <Star className="w-3 h-3 fill-amber-900" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Premium Glow Effect */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 0.6 : 0,
                    scale: isHovered ? 1.1 : 0.9,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    background: `radial-gradient(circle at center, ${tier.shadowColor} 0%, transparent 70%)`,
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
                      ? `0 30px 40px -15px ${tier.shadowColor}, 0 0 0 1px rgba(255,255,255,0.2)` 
                      : '0 20px 25px -5px rgba(0,0,0,0.3), 0 8px 10px -6px rgba(0,0,0,0.2)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`relative p-6 rounded-2xl overflow-hidden ${
                    tier.isPopular
                      ? 'bg-gradient-to-b from-gray-800 to-gray-900'
                      : 'bg-gray-800/50 backdrop-blur-sm'
                  } border ${tier.borderColor}`}
                  style={{
                    borderWidth: isSelected ? '2px' : '1px',
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
                      backgroundImage: `radial-gradient(circle at 2px 2px, ${tier.color === 'blue' ? '#3b82f6' : tier.color === 'yellow' ? '#eab308' : tier.color === 'orange' ? '#f97316' : '#6b7280'} 1px, transparent 0)`,
                      backgroundSize: '20px 20px',
                    }}
                  />

                  {/* Card Header */}
                  <div className="relative z-10">
                    {/* Icon with Animation */}
                    <motion.div
                      animate={{
                        rotate: isHovered ? [0, 10, -10, 0] : 0,
                        scale: isHovered ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.4 }}
                      className={`relative w-16 h-16 mb-4 ${tier.iconBg} ${tier.darkIconBg} rounded-xl flex items-center justify-center mx-auto`}
                    >
                      <span className={`text-3xl ${tier.iconColor} ${tier.darkIconColor}`}>
                        {tier.icon}
                      </span>
                      
                      {/* Icon Glow */}
                      <motion.div
                        animate={{
                          scale: isHovered ? [1, 1.3, 1] : 1,
                          opacity: isHovered ? 0.5 : 0,
                        }}
                        transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                        className="absolute inset-0 rounded-xl"
                        style={{
                          background: `radial-gradient(circle at center, ${tier.shadowColor} 0%, transparent 70%)`,
                          filter: 'blur(8px)',
                        }}
                      />
                    </motion.div>

                    {/* Title and Price */}
                    <h3 className={`text-xl font-bold text-center mb-1 text-white`}>
                      {tier.name}
                    </h3>
                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <span className="text-3xl font-bold text-white">
                        PKR {tier.price}
                      </span>
                      <span className="text-xs text-gray-400">/month</span>
                    </div>

                    {/* Premium Stats Grid */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                        <TrendingUp className={`w-4 h-4 mx-auto mb-1 ${tier.iconColor} ${tier.darkIconColor}`} />
                        <div className="text-[10px] text-gray-400">Multi</div>
                        <div className="text-sm font-bold text-white">{tier.multiplier}</div>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                        <DollarSign className={`w-4 h-4 mx-auto mb-1 ${tier.iconColor} ${tier.darkIconColor}`} />
                        <div className="text-[10px] text-gray-400">Daily</div>
                        <div className="text-sm font-bold text-white">PKR {tier.dailyLimit}</div>
                      </div>
                      <div className="text-center p-2 bg-white/5 rounded-lg border border-white/10">
                        <Video className={`w-4 h-4 mx-auto mb-1 ${tier.iconColor} ${tier.darkIconColor}`} />
                        <div className="text-[10px] text-gray-400">Videos</div>
                        <div className="text-sm font-bold text-white">{tier.maxVideos}</div>
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-2 mb-4">
                      {tier.features.map((feature, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2"
                        >
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${tier.gradient} p-0.5 flex items-center justify-center`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-xs text-gray-300">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button with Animation */}
                    <Link
                      to="/register"
                      className={`relative block w-full py-3 px-4 text-center rounded-xl font-semibold overflow-hidden group ${
                        tier.isPopular
                          ? `bg-gradient-to-r ${tier.gradient} text-white`
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {tier.isPopular ? 'Get Started Now' : 'Join Now'}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                      
                      {/* Shine Effect */}
                      <motion.div
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.8 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    </Link>

                    {/* Additional Stats */}
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <div className="text-[10px] text-gray-500">Earnings</div>
                          <div className="text-xs font-bold text-green-400">{tier.stats.earnings}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500">Users</div>
                          <div className="text-xs font-bold text-blue-400">{tier.stats.users}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-500">Payout</div>
                          <div className="text-xs font-bold text-purple-400">{tier.stats.payout}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
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
          {/* Comparison Link */}
          <motion.a
            href="#compare"
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 text-gray-300 hover:text-white transition-colors mb-6"
          >
            <BadgeCheck className="w-4 h-4 text-blue-400" />
            <span className="text-sm">Compare all features</span>
            <ArrowRight className="w-4 h-4" />
          </motion.a>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Shield, text: '30-day money-back' },
              { icon: Clock, text: 'Cancel anytime' },
              { icon: Gem, text: 'No hidden fees' },
              { icon: Flame, text: 'Popular choice' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4 text-gray-500" />
                  <span className="text-xs text-gray-400">{item.text}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Review Stars */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1 }}
            className="flex items-center justify-center gap-1 mt-6"
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.div
                key={star}
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="cursor-pointer"
              >
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              </motion.div>
            ))}
            <span className="text-sm text-gray-400 ml-2">
              Trusted by 50,000+ earners
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Tiers;