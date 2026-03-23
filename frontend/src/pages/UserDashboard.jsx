// pages/UserDashboard.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Wallet,
  Video,
  Award,
  TrendingUp,
  Users,
  Clock,
  Calendar,
  DollarSign,
  PlayCircle,
  Share2,
  Copy,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  LogOut,
  Bell,
  Moon,
  Sun,
  Gift,
  Crown,
  Sparkles,
  Rocket,
  ArrowUpRight,
  Coins,
  BadgeCheck,
  RefreshCw,
  Film,
  Loader,
  CalendarDays,
  Target,
  Zap,
  Star
} from 'lucide-react';
import API from '../api/axios';
import { Toaster, toast } from 'react-hot-toast';
import NavBar from '../components/NavBar';

const UserDashboard = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  // Data states
  const [user, setUser] = useState(null);
  const [earnings, setEarnings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // UI states
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [recentActivity, setRecentActivity] = useState([]);

  // Check for existing user and fetch data
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
    
    fetchDashboardData();
    
    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user profile
      const profileResponse = await API.get("/auth/profile");
      if (profileResponse.data.success) {
        const userData = profileResponse.data.data || profileResponse.data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Fetch earnings data from new endpoint
      const earningsResponse = await API.get("/auth/earning");
      if (earningsResponse.data.success) {
        setEarnings(earningsResponse.data.earnings);
      }

      // Fetch recent activity
      await fetchRecentActivity();
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    toast.success('Dashboard updated!');
  };

  // Fetch recent activity
  const fetchRecentActivity = async () => {
    try {
      const response = await API.get('/user/activity/recent');
      if (response.data.success) {
        setRecentActivity(response.data.activities || []);
      }
    } catch (error) {
      console.log('Error fetching recent activity:', error);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatCurrency = (amount) => {
    const numAmount = Number(amount) || 0;
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(numAmount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getTierColor = (tierName) => {
    const colors = {
      'Bronze': 'from-orange-500 to-amber-500',
      'Silver': 'from-gray-400 to-gray-500',
      'Gold': 'from-yellow-500 to-amber-500',
      'Diamond': 'from-blue-500 to-purple-500'
    };
    return colors[tierName] || 'from-blue-500 to-purple-500';
  };

  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);
  const headerScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-white text-lg">Loading your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Session Expired</h2>
          <p className="text-gray-400 mb-4">Please login again to continue</p>
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Use earnings data if available, fallback to user data
  const walletBalance = earnings?.wallet ?? user?.wallet ?? 0;
  const totalEarnings = earnings?.totalEarnings ?? user?.totalEarnings ?? 0;
  const dailyEarning = earnings?.dailyEarning ?? user?.dailyEarning ?? 0;
  const referralCount = earnings?.referralCount ?? user?.directReferrals?.length ?? 0;
  const tier = earnings?.tier ?? user?.tier;
  const lastEarningDate = earnings?.lastEarningDate ?? user?.lastEarningDate;
  const lastWithdrawalDate = earnings?.lastWithdrawalDate ?? user?.lastWithdrawalDate;

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900"
    >
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1F2937',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
      </div>

      <NavBar />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header with Refresh */}
        <div className="flex justify-between items-center mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {user?.name}!</p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 transition flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>

        {/* Tier Badge */}
        {tier && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getTierColor(tier.name)} rounded-full`}>
              <Crown className="w-4 h-4 text-white" />
              <span className="text-white font-medium">{tier.name} Tier</span>
            </div>
          </motion.div>
        )}

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Wallet Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-gray-500 hover:text-gray-300 transition"
              >
                {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Wallet Balance</h3>
            <p className="text-3xl font-bold text-white mb-2">
              {!showBalance ? '••••••' : formatCurrency(walletBalance)}
            </p>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <ArrowUpRight className="w-3 h-3" />
              Available for withdrawal
            </div>
          </motion.div>

          {/* Total Earnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 w-fit">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Total Earnings</h3>
            <p className="text-3xl font-bold text-white mb-2">{formatCurrency(totalEarnings)}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Calendar className="w-3 h-3" />
              Lifetime earnings
            </div>
          </motion.div>

          {/* Today's Earnings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl mb-4 w-fit">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Today's Earnings</h3>
            <p className="text-3xl font-bold text-emerald-400 mb-2">{formatCurrency(dailyEarning)}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              Last earned: {formatTimeAgo(lastEarningDate)}
            </div>
          </motion.div>

          {/* Referrals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mb-4 w-fit">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-medium text-gray-400 mb-1">Direct Referrals</h3>
            <p className="text-3xl font-bold text-white mb-2">{referralCount}</p>
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Gift className="w-3 h-3" />
              {referralCount === 0 ? 'No referrals yet' : `${referralCount} people joined`}
            </div>
          </motion.div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Last Activities */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        activity.type === 'earning' ? 'bg-green-500/20' :
                        activity.type === 'referral' ? 'bg-blue-500/20' :
                        'bg-purple-500/20'
                      }`}>
                        {activity.type === 'earning' && <DollarSign className="w-4 h-4 text-green-400" />}
                        {activity.type === 'referral' && <Users className="w-4 h-4 text-blue-400" />}
                        {activity.type === 'withdrawal' && <Wallet className="w-4 h-4 text-purple-400" />}
                      </div>
                      <div>
                        <p className="text-sm text-white">{activity.title}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    {activity.amount && (
                      <span className="text-sm font-medium text-emerald-400">
                        +{formatCurrency(activity.amount)}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No recent activity</p>
              )}
            </div>
          </motion.div>

          {/* Dates & Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <CalendarDays className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-400">Member Since</span>
                </div>
                <span className="text-sm text-white">{formatDate(user?.createdAt)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-400">Last Earning</span>
                </div>
                <span className="text-sm text-white">{formatDate(lastEarningDate)}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-400">Last Withdrawal</span>
                </div>
                <span className="text-sm text-white">{formatDate(lastWithdrawalDate) || 'Never'}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-400">Account Status</span>
                </div>
                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                  {user?.status || 'Active'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Referral Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          whileHover={{ scale: 1.01 }}
          className="relative group mb-8"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20 group-hover:opacity-30 blur-xl transition-opacity" />
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 overflow-hidden">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full"
            />
            
            <div className="relative flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <motion.h3
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-3xl font-bold mb-2"
                >
                  Refer & Earn
                </motion.h3>
                <p className="text-blue-100 mb-4">
                  Share your referral code and earn PKR 100 for each friend who joins!
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                    <code className="text-white font-mono text-lg">{user?.referralCode || 'N/A'}</code>
                    <button
                      onClick={copyReferralCode}
                      className="p-1 hover:bg-white/20 rounded transition"
                    >
                      {copied ? (
                        <CheckCircle className="w-5 h-5 text-green-300" />
                      ) : (
                        <Copy className="w-5 h-5 text-white" />
                      )}
                    </button>
                  </div>
                  <button
                    onClick={() => window.open(`https://wa.me/?text=Join%20VidCash%20using%20my%20referral%20code%3A%20${user?.referralCode}`, '_blank')}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:shadow-lg transition flex items-center gap-2 whitespace-nowrap"
                  >
                    <Share2 className="w-4 h-4" />
                    Share Now
                  </button>
                </div>
              </div>
              <div className="text-white text-center">
                <div className="text-5xl font-bold mb-1">{referralCount}</div>
                <div className="text-blue-100">Total Referrals</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.9
              }
            }
          }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            {
              icon: PlayCircle,
              title: 'Watch Videos',
              description: 'Earn more today',
              gradient: 'from-blue-500 to-cyan-500',
              path: '/videos'
            },
            {
              icon: Wallet,
              title: 'Withdraw',
              description: `${formatCurrency(walletBalance)} available`,
              gradient: 'from-green-500 to-emerald-500',
              path: '/user/withdraw'
            },
            {
              icon: Users,
              title: 'Refer Friends',
              description: 'Earn PKR 100 each',
              gradient: 'from-purple-500 to-pink-500',
              path: '/user/referrals'
            },
            {
              icon: Settings,
              title: 'Settings',
              description: 'Manage account',
              gradient: 'from-gray-500 to-gray-600',
              path: '/settings'
            }
          ].map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(action.path)}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} rounded-xl opacity-0 group-hover:opacity-20 blur-lg transition-opacity`} />
                <div className="relative bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className={`mb-3 p-2 bg-gradient-to-r ${action.gradient} rounded-lg w-fit`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                  <h4 className="text-sm font-medium text-white mb-1">{action.title}</h4>
                  <p className="text-xs text-gray-400">{action.description}</p>
                </div>
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default UserDashboard;