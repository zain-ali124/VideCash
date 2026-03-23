// components/home/Hero.jsx
import React, { useState, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import {
  PlayCircle,
  TrendingUp,
  Users,
  Shield,
  Sparkles,
  ArrowRight,
  Award,
  Star,
  Zap,
  Clock,
  DollarSign,
  Globe,
  Rocket,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [timeLeft, setTimeLeft] = useState("23:59:59");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [hoveredBadge, setHoveredBadge] = useState(null);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const [hours, minutes, seconds] = prev.split(":").map(Number);
        if (seconds > 0) {
          return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${(seconds - 1).toString().padStart(2, "0")}`;
        } else if (minutes > 0) {
          return `${hours.toString().padStart(2, "0")}:${(minutes - 1).toString().padStart(2, "0")}:59`;
        } else if (hours > 0) {
          return `${(hours - 1).toString().padStart(2, "0")}:59:59`;
        }
        return "23:59:59";
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mouse move effect for parallax
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ✅ FIXED: Animated counter - now shows only integers
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayCount = useSpring(rounded, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.5
  });

  useEffect(() => {
    count.set(50000);
  }, []);

  // Floating cards with hover effects
  const floatingCards = [
    {
      icon: <PlayCircle className="w-5 h-5" />,
      text: "Daily Earnings",
      value: "₹500+",
      bg: "bg-blue-500/20",
      hoverBg: "hover:bg-blue-500/30",
      border: "border-blue-500/30",
      hoverBorder: "hover:border-blue-500/60",
      textColor: "text-blue-100",
      valueColor: "text-blue-300",
      glowColor: "blue",
      iconColor: "text-blue-300",
      delay: 0,
    },
    {
      icon: <Users className="w-5 h-5" />,
      text: "Active Earners",
      value: "50K+",
      bg: "bg-purple-500/20",
      hoverBg: "hover:bg-purple-500/30",
      border: "border-purple-500/30",
      hoverBorder: "hover:border-purple-500/60",
      textColor: "text-purple-100",
      valueColor: "text-purple-300",
      glowColor: "purple",
      iconColor: "text-purple-300",
      delay: 0.2,
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "Instant Payouts",
      value: "< 1 min",
      bg: "bg-yellow-500/20",
      hoverBg: "hover:bg-yellow-500/30",
      border: "border-yellow-500/30",
      hoverBorder: "hover:border-yellow-500/60",
      textColor: "text-yellow-100",
      valueColor: "text-yellow-300",
      glowColor: "yellow",
      iconColor: "text-yellow-300",
      delay: 0.4,
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "Referral Bonus",
      value: "₹5/ref",
      bg: "bg-green-500/20",
      hoverBg: "hover:bg-green-500/30",
      border: "border-green-500/30",
      hoverBorder: "hover:border-green-500/60",
      textColor: "text-green-100",
      valueColor: "text-green-300",
      glowColor: "green",
      iconColor: "text-green-300",
      delay: 0.6,
    },
  ];

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
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-950 via-blue-950 to-purple-950">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: mousePosition.x * 2,
            y: mousePosition.y * 2,
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 0.5 }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            x: mousePosition.x * -2,
            y: mousePosition.y * -2,
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 0.5 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        />

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Floating Cards with Contained Hover Effects */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            {floatingCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: card.delay }}
                onHoverStart={() => setHoveredCard(index)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  transition: { type: "spring", stiffness: 400, damping: 15 },
                }}
                className="relative group cursor-pointer"
                style={{ overflow: "visible" }}
              >
                {/* Inner glow effect */}
                <motion.div
                  animate={{
                    opacity: hoveredCard === index ? 0.6 : 0,
                    scale: hoveredCard === index ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute inset-0 bg-${card.glowColor}-500/30 rounded-full blur-md`}
                  style={{ zIndex: 0 }}
                />

                {/* Card background */}
                <motion.div
                  animate={{
                    borderColor:
                      hoveredCard === index
                        ? `rgba(255, 255, 255, 0.4)`
                        : `rgba(255, 255, 255, 0.15)`,
                    boxShadow:
                      hoveredCard === index
                        ? `0 10px 25px -5px rgba(0,0,0,0.5), 0 0 0 1px ${
                            card.glowColor === "blue"
                              ? "rgba(59,130,246,0.3)"
                              : card.glowColor === "purple"
                                ? "rgba(168,85,247,0.3)"
                                : card.glowColor === "yellow"
                                  ? "rgba(234,179,8,0.3)"
                                  : "rgba(34,197,94,0.3)"
                          }`
                        : "none",
                  }}
                  className={`relative flex items-center gap-3 px-5 py-2.5 ${card.bg} backdrop-blur-sm rounded-full border transition-all duration-300`}
                  style={{
                    borderColor: `rgba(255, 255, 255, 0.15)`,
                    zIndex: 1,
                    overflow: "hidden",
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    animate={{
                      rotate: hoveredCard === index ? [0, 5, -5, 0] : 0,
                      scale: hoveredCard === index ? [1, 1.15, 1] : 1,
                    }}
                    transition={{ duration: 0.4 }}
                    className={`${card.iconColor} relative z-10`}
                  >
                    {card.icon}
                  </motion.div>

                  <span
                    className={`text-sm font-medium ${card.textColor} relative z-10`}
                  >
                    {card.text}
                  </span>

                  {/* Value */}
                  <motion.span
                    animate={{
                      scale: hoveredCard === index ? [1, 1.08, 1] : 1,
                    }}
                    className={`text-sm font-bold ${card.valueColor} relative z-10`}
                  >
                    {card.value}
                  </motion.span>

                  {/* Shine effect */}
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: hoveredCard === index ? "100%" : "-100%" }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{ zIndex: 5 }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Limited Time Offer Badge */}
          <motion.div
            variants={itemVariants}
            onHoverStart={() => setHoveredBadge("offer")}
            onHoverEnd={() => setHoveredBadge(null)}
            whileHover={{ scale: 1.02 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30 mb-8 cursor-pointer relative overflow-hidden group"
          >
            <motion.div
              animate={{
                x: hoveredBadge === "offer" ? ["-100%", "100%"] : "-100%",
              }}
              transition={{
                duration: 0.8,
                repeat: hoveredBadge === "offer" ? Infinity : 0,
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent"
            />

            <Sparkles className="w-4 h-4 text-yellow-300 relative z-10" />
            <span className="text-yellow-100 text-sm font-medium relative z-10">
              Limited Time Offer
            </span>

            <motion.div
              animate={{
                scale: hoveredBadge === "offer" ? [1, 1.1, 1] : 1,
                backgroundColor:
                  hoveredBadge === "offer"
                    ? "rgba(234, 179, 8, 0.3)"
                    : "rgba(234, 179, 8, 0.2)",
              }}
              className="flex items-center gap-1 px-2 py-0.5 bg-yellow-600/30 rounded-full relative z-10"
            >
              <Clock className="w-3 h-3 text-yellow-300" />
              <motion.span
                key={timeLeft}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="text-xs text-yellow-200 font-mono"
              >
                {timeLeft}
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Main Headline */}
          <motion.div variants={itemVariants} className="relative mb-6">
            <h1 className="text-6xl md:text-8xl font-bold">
              <span className="relative inline-block group">
                <span className="bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Earn Money
                </span>
                <motion.span
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                />
              </span>
              <br />
              <span className="relative group">
                <span className="text-white">By Watching Videos</span>
                <motion.span
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -right-12 top-0 text-4xl cursor-pointer"
                  whileHover={{ scale: 1.3, rotate: 20 }}
                >
                  🎥
                </motion.span>
              </span>
            </h1>
          </motion.div>

          {/* ✅ FIXED: Sub-headline with integer counter */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Join{" "}
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ scale: 1.2, color: "#fbbf24" }}
              className="inline-block font-bold text-yellow-300 cursor-pointer"
            >
              <DisplayCount value={50000} />
            </motion.span>
            + users earning daily. Watch videos, complete offers, and earn real
            money instantly!
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            {/* Primary CTA */}
            <motion.div
              onHoverStart={() => setHoveredButton("primary")}
              onHoverEnd={() => setHoveredButton(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link
                to="/register"
                className="relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold overflow-hidden group block"
              >
                <motion.span
                  animate={{
                    scale: hoveredButton === "primary" ? [1, 2, 1] : 1,
                    opacity: hoveredButton === "primary" ? [0.5, 0, 0] : 0,
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: hoveredButton === "primary" ? Infinity : 0,
                  }}
                  className="absolute inset-0 bg-white rounded-full"
                />

                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{
                    x: hoveredButton === "primary" ? "100%" : "-100%",
                  }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                />

                <span className="relative z-10 flex items-center gap-2 text-lg">
                  Start Earning Now
                  <motion.div
                    animate={{ x: hoveredButton === "primary" ? [0, 5, 0] : 0 }}
                    transition={{
                      duration: 0.5,
                      repeat: hoveredButton === "primary" ? Infinity : 0,
                    }}
                  >
                    <Rocket className="w-5 h-5" />
                  </motion.div>
                </span>
              </Link>
            </motion.div>

            {/* Secondary CTA */}
            <motion.a
              href="#plans"
              onHoverStart={() => setHoveredButton("secondary")}
              onHoverEnd={() => setHoveredButton(null)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-gray-800/80 text-white rounded-full font-semibold border border-gray-600 overflow-hidden cursor-pointer block"
            >
              <motion.div
                animate={{
                  borderColor:
                    hoveredButton === "secondary" ? "#60a5fa" : "#4b5563",
                }}
                className="absolute inset-0 rounded-full"
              />

              <motion.div
                animate={{
                  scale: hoveredButton === "secondary" ? [1, 1.1, 1] : 1,
                  backgroundColor:
                    hoveredButton === "secondary"
                      ? "rgba(59, 130, 246, 0.1)"
                      : "transparent",
                }}
                transition={{
                  duration: 1,
                  repeat: hoveredButton === "secondary" ? Infinity : 0,
                }}
                className="absolute inset-0 rounded-full"
              />

              <span className="relative z-10 flex items-center gap-2 text-lg">
                View Plans
                <motion.div
                  animate={{ x: hoveredButton === "secondary" ? [0, 5, 0] : 0 }}
                  transition={{
                    duration: 0.5,
                    repeat: hoveredButton === "secondary" ? Infinity : 0,
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </span>
            </motion.a>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12"
          >
            {[
              {
                icon: Shield,
                text: "Bank-Grade Security",
                color: "text-blue-300",
                hoverColor: "text-blue-200",
              },
              {
                icon: Zap,
                text: "Instant Withdrawals",
                color: "text-yellow-300",
                hoverColor: "text-yellow-200",
              },
              {
                icon: Globe,
                text: "Global Community",
                color: "text-green-300",
                hoverColor: "text-green-200",
              },
              {
                icon: Star,
                text: "4.8/5 Rating",
                color: "text-purple-300",
                hoverColor: "text-purple-200",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 text-gray-300 cursor-pointer group"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative"
                  >
                    <Icon
                      className={`w-5 h-5 ${item.color} group-hover:${item.hoverColor} transition-colors`}
                    />
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 0.5, scale: 1.5 }}
                      className={`absolute inset-0 bg-${item.color.split("-")[1]}-400 rounded-full blur-md`}
                    />
                  </motion.div>
                  <motion.span
                    className="text-sm group-hover:text-white transition-colors"
                    whileHover={{ x: 2 }}
                  >
                    {item.text}
                  </motion.span>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div variants={itemVariants} className="max-w-md mx-auto">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-800 cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-2 h-2 bg-green-400 rounded-full"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Live Activity
                </span>

                <motion.div
                  animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                />
              </div>

              <div className="space-y-3">
                <ActivityItem
                  name="Ahmed K."
                  amount="₹250"
                  time="just now"
                  delay={0}
                />
                <ActivityItem
                  name="Fatima S."
                  amount="₹150"
                  time="2 min ago"
                  delay={0.2}
                />
                <ActivityItem
                  name="Usman A."
                  amount="₹500"
                  time="5 min ago"
                  delay={0.4}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        whileHover={{ scale: 1.1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer group"
        onClick={() =>
          window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
        }
      >
        <div className="relative">
          <div className="w-6 h-10 border-2 border-gray-600 group-hover:border-blue-400 rounded-full flex justify-center transition-colors">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mt-2 group-hover:from-blue-300 group-hover:to-purple-300"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-blue-400 whitespace-nowrap"
          >
            Scroll to explore
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -15, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity }}
        whileHover={{ scale: 1.1, y: -20 }}
        className="absolute top-40 right-20 hidden lg:block cursor-pointer group"
      >
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-3 border border-gray-800 group-hover:border-yellow-500/50 transition-all">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <Award className="w-4 h-4 text-yellow-400" />
            </motion.div>
            <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
              Top Earner: ₹50,000
            </span>
          </div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -5, 0],
        }}
        transition={{ duration: 6, repeat: Infinity }}
        whileHover={{ scale: 1.1, y: 20 }}
        className="absolute bottom-40 left-20 hidden lg:block cursor-pointer group"
      >
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl p-3 border border-gray-800 group-hover:border-green-500/50 transition-all">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Users className="w-4 h-4 text-green-400" />
            </motion.div>
            <span className="text-gray-300 text-sm group-hover:text-white transition-colors">
              1,234 online now
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// ✅ FIXED: Animated Counter Component - Now shows clean integers
const DisplayCount = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Simple integer animation
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), value);
      setCount(current);
      
      if (step >= steps) {
        setCount(value);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return <motion.span>{count.toLocaleString()}</motion.span>;
};

// Activity Item Component
const ActivityItem = ({ name, amount, time, delay }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ x: 5, backgroundColor: "rgba(255,255,255,0.05)" }}
      className="flex items-center justify-between text-sm p-2 rounded-lg cursor-pointer transition-colors"
    >
      <div className="flex items-center gap-2">
        <motion.div
          animate={{
            scale: isHovered ? [1, 1.2, 1] : 1,
            rotate: isHovered ? [0, 360] : 0,
          }}
          transition={{ duration: 0.5 }}
          className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-xs text-white font-medium"
        >
          {name[0]}
        </motion.div>
        <motion.span
          className="text-gray-300"
          animate={{ color: isHovered ? "#fff" : "#d1d5db" }}
        >
          {name}
        </motion.span>
      </div>
      <div className="flex items-center gap-2">
        <motion.span
          className="text-green-400 font-semibold"
          animate={{
            scale: isHovered ? [1, 1.1, 1] : 1,
          }}
        >
          {amount}
        </motion.span>
        <span className="text-gray-500 text-xs">{time}</span>
      </div>
    </motion.div>
  );
};

export default Hero;