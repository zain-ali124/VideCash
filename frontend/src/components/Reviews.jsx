// components/home/Reviews.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  ChevronLeft, 
  ChevronRight, 
  Quote,
  Sparkles,
  Award,
  TrendingUp,
  Users,
  BadgeCheck,
  MessageCircle,
  Heart,
  Share2
} from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Ahmed Khan',
    avatar: 'https://i.pravatar.cc/150?img=1',
    location: 'Karachi, PK',
    earning: '15,000',
    totalEarnings: '1,50,000',
    rating: 5,
    tier: 'Diamond',
    joinDate: '2023',
    text: 'VidCash changed my life! I earn PKR 15,000 monthly just by watching videos in my free time. The referral bonus is amazing too!',
    verified: true,
    social: { likes: 234, shares: 56 }
  },
  {
    id: 2,
    name: 'Fatima Ali',
    avatar: 'https://i.pravatar.cc/150?img=2',
    location: 'Lahore, PK',
    earning: '25,000',
    totalEarnings: '3,00,000',
    rating: 5,
    tier: 'Gold',
    joinDate: '2023',
    text: 'Started with Bronze tier, now on Diamond. The daily earnings are consistent and withdrawals are instant. Best platform ever!',
    verified: true,
    social: { likes: 456, shares: 89 }
  },
  {
    id: 3,
    name: 'Usman Chaudhry',
    avatar: 'https://i.pravatar.cc/150?img=3',
    location: 'Islamabad, PK',
    earning: '40,000',
    totalEarnings: '5,00,000',
    rating: 5,
    tier: 'Platinum',
    joinDate: '2022',
    text: 'My whole family is earning with VidCash. The referral program helped me build a passive income stream. Highly recommended!',
    verified: true,
    social: { likes: 678, shares: 123 }
  },
  {
    id: 4,
    name: 'Sana Mirza',
    avatar: 'https://i.pravatar.cc/150?img=4',
    location: 'Rawalpindi, PK',
    earning: '12,000',
    totalEarnings: '1,20,000',
    rating: 5,
    tier: 'Silver',
    joinDate: '2024',
    text: "As a student, VidCash helps me earn my pocket money. It's legit and pays on time every single day.",
    verified: true,
    social: { likes: 189, shares: 34 }
  },
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    if (!autoplay) return;
    
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [currentIndex, autoplay]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleLike = (id) => {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="reviews" className="relative py-24 overflow-hidden bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
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
          className="absolute top-20 left-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
          className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        />

        {/* Floating Particles */}
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
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-full border border-purple-500/20 mb-6"
          >
            <MessageCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-gray-300">Success Stories</span>
            <Sparkles className="w-4 h-4 text-pink-400" />
          </motion.div>

          {/* Main Title */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            <span className="text-white">What Our</span>{' '}
            <span className="relative">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Earners Say
              </span>
              <motion.span
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full"
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
            Real stories from real earners who transformed their lives with VidCash
          </motion.p>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-8 mt-8"
          >
            {[
              { icon: Users, text: '50K+ Happy Earners', color: 'from-purple-400 to-purple-600' },
              { icon: Award, text: '4.9 Average Rating', color: 'from-yellow-400 to-orange-600' },
              { icon: TrendingUp, text: '₹2Cr+ Total Payouts', color: 'from-green-400 to-green-600' },
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

        {/* Main Testimonial Carousel */}
        <div className="relative max-w-5xl mx-auto">
          {/* Decorative Elements */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-10 -left-10 w-20 h-20 opacity-20"
          >
            <Quote className="w-full h-full text-purple-400" />
          </motion.div>
          
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -bottom-10 -right-10 w-20 h-20 opacity-20"
          >
            <Quote className="w-full h-full text-pink-400" />
          </motion.div>

          {/* Carousel Container */}
          <div className="overflow-hidden rounded-3xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction > 0 ? 200 : -200 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction < 0 ? 200 : -200 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="relative"
              >
                {/* Premium Card */}
                <div className="relative bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-gray-700/50 p-8 md:p-12 shadow-2xl">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full blur-3xl" />
                  </div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Quote Icon */}
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="mb-6"
                    >
                      <Quote className="w-16 h-16 text-purple-400/30" />
                    </motion.div>

                    {/* Testimonial Text */}
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed"
                    >
                      "{reviews[currentIndex].text}"
                    </motion.p>

                    {/* User Info */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        {/* Avatar with Glow */}
                        <div className="relative">
                          <motion.div
                            animate={{
                              scale: [1, 1.1, 1],
                              opacity: [0.3, 0.5, 0.3],
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-purple-500 rounded-full blur-md"
                          />
                          <img
                            src={reviews[currentIndex].avatar}
                            alt={reviews[currentIndex].name}
                            className="relative w-20 h-20 rounded-full border-2 border-purple-500/50 object-cover"
                          />
                          
                          {/* Verified Badge */}
                          {reviews[currentIndex].verified && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3, type: 'spring' }}
                              className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full p-1"
                            >
                              <BadgeCheck className="w-4 h-4 text-white" />
                            </motion.div>
                          )}
                        </div>

                        {/* User Details */}
                        <div>
                          <h4 className="text-xl font-bold text-white mb-1">
                            {reviews[currentIndex].name}
                          </h4>
                          <p className="text-sm text-gray-400 mb-2">
                            {reviews[currentIndex].location} • Member since {reviews[currentIndex].joinDate}
                          </p>
                          
                          {/* Tier Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${
                              reviews[currentIndex].tier === 'Diamond' ? 'from-blue-500 to-purple-500' :
                              reviews[currentIndex].tier === 'Gold' ? 'from-yellow-500 to-orange-500' :
                              reviews[currentIndex].tier === 'Platinum' ? 'from-gray-400 to-gray-600' :
                              'from-gray-500 to-gray-700'
                            } text-white`}>
                              {reviews[currentIndex].tier} Tier
                            </span>
                            
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < reviews[currentIndex].rating
                                      ? 'text-yellow-400 fill-yellow-400'
                                      : 'text-gray-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Earnings Stats */}
                      <div className="flex gap-4">
                        <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-xs text-gray-400">Monthly</div>
                          <div className="text-lg font-bold text-green-400">
                            PKR {reviews[currentIndex].earning}
                          </div>
                        </div>
                        <div className="text-center px-4 py-2 bg-white/5 rounded-xl border border-white/10">
                          <div className="text-xs text-gray-400">Total</div>
                          <div className="text-lg font-bold text-blue-400">
                            PKR {reviews[currentIndex].totalEarnings}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Engagement */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-6 pt-6 border-t border-gray-700/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleLike(reviews[currentIndex].id)}
                          className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <Heart className={`w-5 h-5 ${liked[reviews[currentIndex].id] ? 'fill-red-400 text-red-400' : ''}`} />
                          <span className="text-sm">
                            {reviews[currentIndex].social.likes + (liked[reviews[currentIndex].id] ? 1 : 0)}
                          </span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm">{reviews[currentIndex].social.shares}</span>
                        </motion.button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Verified Review</span>
                        <BadgeCheck className="w-4 h-4 text-blue-400" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevSlide}
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
              className="p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-300" />
            </motion.button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {reviews.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  onMouseEnter={() => setAutoplay(false)}
                  onMouseLeave={() => setAutoplay(true)}
                  className="relative group"
                  whileHover={{ scale: 1.2 }}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-gradient-to-r from-purple-400 to-pink-400'
                        : 'w-2 bg-gray-600 group-hover:bg-gray-400'
                    }`}
                  />
                </motion.button>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextSlide}
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
              className="p-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-300" />
            </motion.button>
          </div>

          {/* Autoplay Indicator */}
          {autoplay && (
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 6, ease: 'linear', repeat: Infinity }}
              className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
            />
          )}
        </div>

        {/* Bottom Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mt-12"
        >
          {[
            { text: 'Verified Reviews', icon: BadgeCheck },
            { text: 'Real Earners', icon: Users },
            { text: '100% Authentic', icon: Award },
            { text: 'Updated Daily', icon: TrendingUp },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10"
              >
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">{item.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;