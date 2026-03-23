// components/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Wallet,
  Video,
  DollarSign,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Upload,
  PlayCircle,
  Trophy,
  User,
  Bell,
  Settings,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Download,
  Clock,
  Award,
  TrendingUp,
  Shield,
  Copy,
  Star,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  CircleDollarSign,
  Coins,
  BadgeCheck,
  Info
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [videos, setVideos] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [tiers, setTiers] = useState([]);
  
  // UI states
  const [loading, setLoading] = useState({
    users: false,
    pending: false,
    withdrawals: false,
    videos: false,
    stats: false,
    tiers: false,
    action: false
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [videoForm, setVideoForm] = useState({
    title: '',
    duration: '',
    reward: '',
    video: null
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (!token || user.role !== 'admin') {
      navigate('/login');
      return;
    }
    
    fetchBasicData();
    
    const tokenRefreshInterval = setInterval(refreshToken, 10 * 60 * 1000);
    return () => clearInterval(tokenRefreshInterval);
  }, []);

  const refreshToken = async () => {
    try {
      const response = await API.post('/auth/refresh-token');
      if (response.data.success) {
        localStorage.setItem('token', response.data.accessToken);
      }
    } catch (error) {
      console.log('Token refresh failed');
    }
  };

  const apiCall = async (apiFunction) => {
    try {
      return await apiFunction();
    } catch (error) {
      if (error.response?.status === 401) {
        try {
          await refreshToken();
          return await apiFunction();
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }
      }
      throw error;
    }
  };

  const fetchBasicData = async () => {
    try {
      await Promise.all([
        fetchAllUsers(),
        fetchPendingUsers(),
        fetchWithdrawals(),
        fetchVideos(),
        fetchTiers(),
        fetchDashboardStats()
      ]);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  const fetchAllUsers = async () => {
    setLoading(prev => ({ ...prev, users: true }));
    try {
      const response = await apiCall(() => API.get('/admin/getAllUsers'));
      if (response.data.success) setUsers(response.data.users);
    } catch (error) {
      console.log('Error fetching users:', error);
    } finally {
      setLoading(prev => ({ ...prev, users: false }));
    }
  };

  const fetchPendingUsers = async () => {
    setLoading(prev => ({ ...prev, pending: true }));
    try {
      const response = await apiCall(() => API.get('/admin/pending-users'));
      if (response.data.success) setPendingUsers(response.data.users);
    } catch (error) {
      console.log('Error fetching pending users:', error);
    } finally {
      setLoading(prev => ({ ...prev, pending: false }));
    }
  };

  const fetchWithdrawals = async () => {
    setLoading(prev => ({ ...prev, withdrawals: true }));
    try {
      const response = await apiCall(() => API.get('/admin/getAllWithdrawals'));
      if (response.data.success) setWithdrawals(response.data.withdrawals);
    } catch (error) {
      console.log('Error fetching withdrawals:', error);
    } finally {
      setLoading(prev => ({ ...prev, withdrawals: false }));
    }
  };

  const fetchVideos = async () => {
    setLoading(prev => ({ ...prev, videos: true }));
    try {
      const response = await apiCall(() => API.get('/admin/getAllVideos'));
      if (response.data.success) setVideos(response.data.videos);
    } catch (error) {
      console.log('Error fetching videos:', error);
    } finally {
      setLoading(prev => ({ ...prev, videos: false }));
    }
  };

  const fetchTiers = async () => {
    setLoading(prev => ({ ...prev, tiers: true }));
    try {
      const response = await apiCall(() => API.get('/auth/tiers'));
      if (response.data.success) setTiers(response.data.tiers);
    } catch (error) {
      console.log('Error fetching tiers:', error);
    } finally {
      setLoading(prev => ({ ...prev, tiers: false }));
    }
  };

  const fetchDashboardStats = async () => {
    setLoading(prev => ({ ...prev, stats: true }));
    try {
      const response = await apiCall(() => API.get('/admin/dashboard'));
      if (response.data.success) setDashboardStats(response.data);
    } catch (error) {
      console.log('Error fetching dashboard stats:', error);
    } finally {
      setLoading(prev => ({ ...prev, stats: false }));
    }
  };

  // Actions
  const handleApproveUser = async (userId) => {
    setLoading(prev => ({ ...prev, action: true }));
    setMessage({ type: '', text: '' });
    try {
      const response = await apiCall(() => API.put(`/admin/approve/${userId}`));
      if (response.data.success) {
        setMessage({ type: 'success', text: 'User approved successfully!' });
        await Promise.all([fetchAllUsers(), fetchPendingUsers(), fetchDashboardStats()]);
        setShowUserModal(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to approve user' });
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleRejectUser = async (userId) => {
    setLoading(prev => ({ ...prev, action: true }));
    setMessage({ type: '', text: '' });
    try {
      const response = await apiCall(() => API.put(`/admin/reject/${userId}`));
      if (response.data.success) {
        setMessage({ type: 'success', text: 'User rejected and banned' });
        await Promise.all([fetchAllUsers(), fetchPendingUsers()]);
        setShowUserModal(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reject user' });
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleApproveWithdrawal = async (withdrawalId) => {
    setLoading(prev => ({ ...prev, action: true }));
    setMessage({ type: '', text: '' });
    try {
      const response = await apiCall(() => API.put(`/admin/approveWithdraw/${withdrawalId}`));
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Withdrawal approved successfully!' });
        await Promise.all([fetchWithdrawals(), fetchDashboardStats()]);
        setShowWithdrawalModal(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to approve withdrawal' });
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleRejectWithdrawal = async (withdrawalId) => {
    setLoading(prev => ({ ...prev, action: true }));
    setMessage({ type: '', text: '' });
    try {
      const response = await apiCall(() => API.put(`/admin/rejectWithdraw/${withdrawalId}`));
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Withdrawal rejected' });
        await fetchWithdrawals();
        setShowWithdrawalModal(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to reject withdrawal' });
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.duration || !videoForm.reward || !videoForm.video) {
      setMessage({ type: 'error', text: 'All fields are required' });
      return;
    }

    setLoading(prev => ({ ...prev, action: true }));
    const formData = new FormData();
    formData.append('title', videoForm.title);
    formData.append('duration', videoForm.duration);
    formData.append('reward', videoForm.reward);
    formData.append('video', videoForm.video);

    try {
      const response = await apiCall(() => API.post('/admin/upload-video', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }));
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Video uploaded successfully!' });
        setVideoForm({ title: '', duration: '', reward: '', video: null });
        document.getElementById('video-file').value = '';
        await fetchVideos();
        setShowUploadModal(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload video' });
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleToggleVideoStatus = async (videoId, currentStatus) => {
    setLoading(prev => ({ ...prev, action: true }));
    setMessage({ type: '', text: '' });
    try {
      const response = await apiCall(() => API.put(`/admin/toggle-video/${videoId}`, {
        isActive: !currentStatus
      }));
      if (response.data.success) {
        setMessage({ type: 'success', text: `Video ${!currentStatus ? 'activated' : 'deactivated'} successfully!` });
        await fetchVideos();
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update video status' });
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return;
    
    setLoading(prev => ({ ...prev, action: true }));
    setMessage({ type: '', text: '' });
    try {
      const response = await apiCall(() => API.delete(`/admin/delete-video/${videoId}`));
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Video deleted successfully!' });
        await fetchVideos();
        setShowVideoModal(false);
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete video' });
    } finally {
      setLoading(prev => ({ ...prev, action: false }));
    }
  };

  // Helper functions
  const getTierName = (tierId) => {
    if (!tierId) return 'No tier';
    const tier = tiers.find(t => t._id === tierId);
    return tier ? tier.name : 'Unknown';
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      banned: 'bg-red-500/10 text-red-400 border-red-500/20',
      approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      rejected: 'bg-red-500/10 text-red-400 border-red-500/20'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount) => {
    return `PKR ${amount?.toLocaleString() || 0}`;
  };

  // Parse account details for display
  const formatAccountDetails = (details) => {
    if (!details) return null;
    
    // If it's already an object, return it
    if (typeof details === 'object') {
      return details;
    }
    
    // If it's a string, try to parse it (in case it's JSON stringified)
    try {
      return JSON.parse(details);
    } catch {
      // If it's a plain string, return as is
      return { raw: details };
    }
  };

  // Filter data
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWithdrawals = withdrawals.filter(w => 
    w.user?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter(v => 
    v.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingCount = withdrawals.filter(w => w.status === 'pending').length;

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'All Users', icon: Users, count: users.length },
    { id: 'pending', label: 'Pending', icon: UserCheck, count: pendingUsers.length },
    { id: 'withdrawals', label: 'Withdrawals', icon: Wallet, count: pendingCount },
    { id: 'videos', label: 'Videos', icon: Video, count: videos.length },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
        <div className="absolute top-0 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className={`fixed left-0 top-0 h-full bg-[#13131A]/80 backdrop-blur-xl border-r border-white/[0.05] z-30 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        <div className="relative h-full flex flex-col">
          {/* Logo */}
          <div className={`p-6 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                VidCash
              </h1>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg transition-colors"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-10`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
                      {item.count > 0 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400">
                          {item.count}
                        </span>
                      )}
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="p-4 border-t border-white/[0.05]">
            <div className={`flex items-center gap-3 ${sidebarCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">Admin</p>
                  <p className="text-xs text-gray-500 truncate">admin@vidcash.com</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-72'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-[#13131A]/80 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                className="p-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button 
                className="p-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg transition-colors"
                aria-label="Settings"
              >
                <Settings className="w-4 h-4 text-gray-400" />
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  navigate('/login');
                }}
                className="flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors group"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                <span className="text-sm text-red-400 group-hover:text-red-300">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          {/* Messages */}
          <AnimatePresence>
            {message.text && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
                  message.type === 'success' 
                    ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {message.type === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="text-sm">{message.text}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && dashboardStats && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { 
                    title: 'Total Users', 
                    value: dashboardStats.stats?.totalUsers || 0,
                    icon: Users,
                    color: 'from-blue-500 to-blue-400',
                    bg: 'bg-blue-500/10',
                    change: '+12%'
                  },
                  { 
                    title: 'Active Users', 
                    value: dashboardStats.stats?.activeUsers || 0,
                    icon: UserCheck,
                    color: 'from-emerald-500 to-emerald-400',
                    bg: 'bg-emerald-500/10',
                    change: '+8%'
                  },
                  { 
                    title: 'Total Earnings', 
                    value: formatCurrency(dashboardStats.stats?.totalPlatformEarnings || 0),
                    icon: DollarSign,
                    color: 'from-purple-500 to-purple-400',
                    bg: 'bg-purple-500/10',
                    change: '+23%'
                  },
                  { 
                    title: 'Total Videos', 
                    value: dashboardStats.videoStats?.totalVideos || 0,
                    icon: Video,
                    color: 'from-pink-500 to-pink-400',
                    bg: 'bg-pink-500/10',
                    change: '+5%'
                  },
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-[#13131A] rounded-xl border border-white/[0.05] p-6 hover:border-white/[0.1] transition-colors group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.bg} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">
                          {stat.change}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Top Earners */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#13131A] rounded-xl border border-white/[0.05] p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Top Earners</h3>
                    <Trophy className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="space-y-4">
                    {dashboardStats.topEarners?.map((user, index) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                            index === 1 ? 'bg-gray-400/20 text-gray-400' :
                            index === 2 ? 'bg-orange-500/20 text-orange-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-emerald-400">
                            {formatCurrency(user.totalEarnings || 0)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Videos */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[#13131A] rounded-xl border border-white/[0.05] p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-white">Recent Videos</h3>
                    <PlayCircle className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-4">
                    {dashboardStats.videoStats?.recentVideos?.map((video, index) => (
                      <div
                        key={video._id}
                        className="flex items-center justify-between p-3 bg-white/[0.02] rounded-lg hover:bg-white/[0.03] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center">
                            <Video className="w-4 h-4 text-blue-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{video.title}</p>
                            <p className="text-xs text-gray-500">{formatDuration(video.duration)}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-emerald-400">
                            {formatCurrency(video.reward)}
                          </p>
                          <p className="text-xs text-gray-500">{video.views || 0} views</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">All Users ({users.length})</h2>
                <button 
                  className="px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-sm text-blue-400 transition-colors flex items-center gap-2"
                  aria-label="Export users"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              <div className="bg-[#13131A] rounded-xl border border-white/[0.05] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tier</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Earnings</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referrals</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredUsers.map((user, index) => (
                        <motion.tr
                          key={user._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <User className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(user.status)}`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-white">{getTierName(user.tier || user.selectedTier)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-emerald-400">{formatCurrency(user.totalEarnings || 0)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-white">{formatCurrency(user.wallet || 0)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-white">{user.directReferrals?.length || 0}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Pending Users Tab */}
          {activeTab === 'pending' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-white">Pending Approval ({pendingUsers.length})</h2>

              <div className="grid gap-4">
                {pendingUsers.map((user, index) => (
                  <motion.div
                    key={user._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#13131A] rounded-xl border border-white/[0.05] p-4 hover:border-white/[0.1] transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0">
                          <User className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-sm font-medium text-white truncate">{user.name}</h3>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          <p className="text-xs text-gray-600 mt-1">Tier: {getTierName(user.selectedTier)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {user.paymentProof && (
                          <button
                            onClick={() => window.open(user.paymentProof, '_blank')}
                            className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-xs text-blue-400 transition-colors flex items-center gap-1"
                            aria-label="View payment proof"
                          >
                            <Eye className="w-3 h-3" />
                            View Proof
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserModal(true);
                          }}
                          className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-medium rounded-lg hover:opacity-90 transition-opacity"
                          aria-label="Review user"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Withdrawals Tab */}
          {activeTab === 'withdrawals' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-white">Withdrawal Requests</h2>

              <div className="bg-[#13131A] rounded-xl border border-white/[0.05] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.05] bg-white/[0.02]">
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.05]">
                      {filteredWithdrawals.map((withdrawal, index) => (
                        <motion.tr
                          key={withdrawal._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-green-400" />
                              </div>
                              <span className="text-sm text-white">{withdrawal.user?.name || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-emerald-400">{formatCurrency(withdrawal.amount)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(withdrawal.status)}`}>
                              {withdrawal.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-400">{new Date(withdrawal.createdAt).toLocaleDateString()}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {withdrawal.status === 'pending' && (
                              <button
                                onClick={() => {
                                  setSelectedWithdrawal(withdrawal);
                                  setShowWithdrawalModal(true);
                                }}
                                className="px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg text-xs text-blue-400 transition-colors"
                                aria-label="Review withdrawal"
                              >
                                Review
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Video Management</h2>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                  aria-label="Upload video"
                >
                  <Upload className="w-4 h-4" />
                  Upload Video
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-[#13131A] rounded-xl border border-white/[0.05] overflow-hidden hover:border-white/[0.1] transition-colors group"
                  >
                    <div className="relative aspect-video bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white/50 group-hover:text-white/70 transition-colors" />
                      </div>
                      {!video.isActive && (
                        <div className="absolute top-2 right-2 px-2 py-1 bg-red-500/90 rounded-lg text-[10px] text-white">
                          Inactive
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-white mb-2 line-clamp-1">{video.title}</h3>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">{formatDuration(video.duration)}</span>
                        <span className="text-xs font-medium text-emerald-400">{formatCurrency(video.reward)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">{video.views || 0} views</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleVideoStatus(video._id, video.isActive)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              video.isActive 
                                ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400' 
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                            aria-label={video.isActive ? 'Deactivate video' : 'Activate video'}
                          >
                            {video.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVideo(video);
                              setShowVideoModal(true);
                            }}
                            className="p-1.5 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                            aria-label="Delete video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {/* User Review Modal */}
        {showUserModal && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowUserModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#13131A] rounded-2xl border border-white/[0.05] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-white/[0.05]">
                <h2 className="text-xl font-semibold text-white">Review User</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-lg">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-medium text-white truncate">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{selectedUser.email}</p>
                    <p className="text-xs text-gray-600 mt-1">Tier: {getTierName(selectedUser.selectedTier)}</p>
                  </div>
                </div>

                {selectedUser.paymentProof && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-400">Payment Proof</p>
                    <div className="rounded-lg overflow-hidden border border-white/[0.05]">
                      <img
                        src={selectedUser.paymentProof}
                        alt="Payment Proof"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-white/[0.05] flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowUserModal(false)}
                  className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg text-sm text-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectUser(selectedUser._id)}
                  disabled={loading.action}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ThumbsDown className="w-4 h-4" />
                  Reject
                </button>
                <button
                  onClick={() => handleApproveUser(selectedUser._id)}
                  disabled={loading.action}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Withdrawal Review Modal - UPDATED with Account Details */}
        {showWithdrawalModal && selectedWithdrawal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowWithdrawalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#13131A] rounded-2xl border border-white/[0.05] shadow-2xl max-w-md w-full"
            >
              <div className="p-6 border-b border-white/[0.05]">
                <h2 className="text-xl font-semibold text-white">Review Withdrawal</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* User and Amount */}
                <div className="flex items-center gap-4 p-4 bg-white/[0.02] rounded-lg">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{selectedWithdrawal.user?.name}</p>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">{formatCurrency(selectedWithdrawal.amount)}</p>
                  </div>
                </div>

                {/* Account Details Section - NEW */}
                {selectedWithdrawal.accountDetails && (
                  <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Info className="w-4 h-4 text-blue-400" />
                      <h3 className="text-sm font-medium text-blue-400">Account Details</h3>
                    </div>
                    
                    {/* Parse and display account details */}
                    {typeof selectedWithdrawal.accountDetails === 'object' ? (
                      <div className="space-y-2 text-sm">
                        {selectedWithdrawal.accountDetails.accountType && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Account Type:</span>
                            <span className="text-white capitalize">{selectedWithdrawal.accountDetails.accountType}</span>
                          </div>
                        )}
                        {selectedWithdrawal.accountDetails.accountName && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Account Name:</span>
                            <span className="text-white">{selectedWithdrawal.accountDetails.accountName}</span>
                          </div>
                        )}
                        {selectedWithdrawal.accountDetails.accountNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Account Number:</span>
                            <span className="text-white font-mono">{selectedWithdrawal.accountDetails.accountNumber}</span>
                          </div>
                        )}
                        {selectedWithdrawal.accountDetails.bankName && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Bank Name:</span>
                            <span className="text-white">{selectedWithdrawal.accountDetails.bankName}</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      // If it's a string, display it as is
                      <p className="text-sm text-gray-300 break-words">
                        {selectedWithdrawal.accountDetails}
                      </p>
                    )}
                  </div>
                )}

                {/* Date and Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm text-white">{new Date(selectedWithdrawal.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="p-3 bg-white/[0.02] rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(selectedWithdrawal.status)}`}>
                      {selectedWithdrawal.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-white/[0.05] flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowWithdrawalModal(false)}
                  className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg text-sm text-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRejectWithdrawal(selectedWithdrawal._id)}
                  disabled={loading.action}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-sm text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleApproveWithdrawal(selectedWithdrawal._id)}
                  disabled={loading.action}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Approve
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Video Upload Modal */}
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#13131A] rounded-2xl border border-white/[0.05] shadow-2xl max-w-lg w-full"
            >
              <div className="p-6 border-b border-white/[0.05]">
                <h2 className="text-xl font-semibold text-white">Upload New Video</h2>
              </div>
              
              <form onSubmit={handleUploadVideo} className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Video Title</label>
                  <input
                    type="text"
                    name="title"
                    value={videoForm.title}
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    required
                    className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition"
                    placeholder="Enter video title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Duration (seconds)</label>
                    <input
                      type="number"
                      name="duration"
                      value={videoForm.duration}
                      onChange={(e) => setVideoForm({ ...videoForm, duration: e.target.value })}
                      required
                      min="1"
                      className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition"
                      placeholder="120"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Reward (PKR)</label>
                    <input
                      type="number"
                      name="reward"
                      value={videoForm.reward}
                      onChange={(e) => setVideoForm({ ...videoForm, reward: e.target.value })}
                      required
                      min="0.01"
                      step="0.01"
                      className="w-full h-10 px-3 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm focus:outline-none focus:border-blue-500/50 transition"
                      placeholder="0.50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Video File</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoForm({ ...videoForm, video: e.target.files[0] })}
                      required
                      className="hidden"
                      id="video-upload"
                    />
                    <label
                      htmlFor="video-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white/[0.05] rounded-lg cursor-pointer hover:border-blue-500/50 transition-colors group"
                    >
                      {videoForm.video ? (
                        <div className="text-center">
                          <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                          <p className="text-xs text-gray-400">{videoForm.video.name}</p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-600 group-hover:text-gray-400 transition-colors" />
                          <p className="text-xs text-gray-500">Click to upload video</p>
                          <p className="text-[10px] text-gray-600 mt-1">MP4, WebM, MOV (max 100MB)</p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg text-sm text-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading.action}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {loading.action ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        Upload Video
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Video Delete Modal */}
        {showVideoModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#13131A] rounded-2xl border border-white/[0.05] shadow-2xl max-w-md w-full"
            >
              <div className="p-6 border-b border-white/[0.05]">
                <h2 className="text-xl font-semibold text-red-400">Delete Video</h2>
              </div>
              
              <div className="p-6">
                <p className="text-gray-300 mb-2">
                  Are you sure you want to delete "<span className="font-medium text-white">{selectedVideo.title}</span>"?
                </p>
                <p className="text-sm text-gray-500">This action cannot be undone.</p>
              </div>

              <div className="p-6 border-t border-white/[0.05] flex items-center justify-end gap-3">
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg text-sm text-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteVideo(selectedVideo._id)}
                  disabled={loading.action}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading.action ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;