// pages/Profile.jsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader,
  Save,
  Edit3,
  X,
  Eye,
  EyeOff,
  Award,
  Calendar,
  Clock,
  Shield,
  BadgeCheck,
  Wallet,
  TrendingUp,
  LogOut,
  RefreshCw,
  Image as ImageIcon,
  Trash2,
  Copy,
  Share2,
  Star,
  Crown,
  Medal,
  Sparkles,
  Rocket,
  WifiOff
} from 'lucide-react';
import API from '../api/axios';
import NavBar from '../components/NavBar';
import { Toaster, toast } from 'react-hot-toast';

const Profile = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  // User data state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connectionError, setConnectionError] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarError, setAvatarError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch user data on mount
  useEffect(() => {
    // Check if server is reachable first
    checkServerConnection();
    fetchUserProfile();
    
    // Check for dark mode preference
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Calculate password strength
  useEffect(() => {
    let strength = 0;
    if (formData.password.length > 7) strength += 1;
    if (formData.password.match(/[A-Z]/)) strength += 1;
    if (formData.password.match(/[0-9]/)) strength += 1;
    if (formData.password.match(/[^A-Za-z0-9]/)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  // Check server connection
  const checkServerConnection = async () => {
    try {
      await API.get('/health-check', { timeout: 5000 });
      setConnectionError(false);
    } catch (error) {
      console.error('Server connection failed:', error);
      setConnectionError(true);
    }
  };

  // Fetch user profile with better error handling
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setConnectionError(false);
      
      // Try to get from localStorage first for immediate display
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setFormData({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            password: '',
            confirmPassword: ''
          });
        } catch (e) {
          console.error('Error parsing stored user:', e);
        }
      }

      const response = await API.get('/auth/profile', { timeout: 10000 });
      
      if (response.data.success) {
        const userData = response.data.data || response.data.user;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          confirmPassword: ''
        });
        localStorage.setItem('user', JSON.stringify(userData));
        setAvatarError(false);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      
      if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
        setConnectionError(true);
        toast.error('Cannot connect to server. Please check your connection.');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        handleLogout();
      } else {
        toast.error('Failed to load profile. Using cached data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Handle avatar selection
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setAvatarError(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle avatar error
  const handleAvatarError = () => {
    setAvatarError(true);
  };

  // Remove avatar selection
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords if changing
    if (formData.password) {
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    // Check server connection before submitting
    if (connectionError) {
      toast.error('Cannot connect to server. Please try again later.');
      return;
    }

    setUpdating(true);
    setError('');
    
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    if (formData.password) {
      formDataToSend.append('password', formData.password);
    }
    if (avatarFile) {
      formDataToSend.append('avatar', avatarFile);
    }

    try {
      const response = await API.put('/auth/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 30000, // 30 seconds for file upload
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        setUser(response.data.user);
        setFormData(prev => ({
          ...prev,
          password: '',
          confirmPassword: ''
        }));
        setAvatarFile(null);
        setAvatarPreview(null);
        setEditMode(false);
        setUploadProgress(0);
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.code === 'ECONNABORTED') {
        setError('Upload timeout. Please try again with a smaller image.');
        toast.error('Upload timeout. Please try again with a smaller image.');
      } else if (error.message === 'Network Error') {
        setError('Network error. Please check your connection.');
        toast.error('Network error. Please check your connection.');
      } else {
        setError(error.response?.data?.message || 'Failed to update profile');
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setUpdating(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Retry connection
  const handleRetry = () => {
    setConnectionError(false);
    fetchUserProfile();
  };

  // Copy referral code
  const copyReferralCode = () => {
    if (user?.referralCode) {
      navigator.clipboard.writeText(user.referralCode);
      setCopied(true);
      toast.success('Referral code copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get password strength color
  const getPasswordStrengthColor = () => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-emerald-500'
    ];
    return colors[passwordStrength] || 'bg-gray-600';
  };

  const getPasswordStrengthText = () => {
    const texts = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return texts[passwordStrength] || 'Enter password';
  };

  // Get tier color
  const getTierColor = (tierName) => {
    const colors = {
      'Bronze': 'from-orange-500 to-amber-500',
      'Silver': 'from-gray-400 to-gray-500',
      'Gold': 'from-yellow-500 to-amber-500',
      'Diamond': 'from-blue-500 to-purple-500'
    };
    return colors[tierName] || 'from-blue-500 to-purple-500';
  };

  // Default avatar URL (working fallback)
  const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.name || 'User') + '&background=3B82F6&color=fff&size=128';

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
          <p className="text-white text-lg">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  // Connection error state
  if (connectionError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md px-6"
        >
          <WifiOff className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connection Error</h2>
          <p className="text-gray-400 mb-6">
            Cannot connect to the server. Please check your internet connection and try again.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleRetry}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
            >
              Retry
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
            >
              Go Home
            </button>
          </div>
          {user && (
            <p className="mt-4 text-sm text-gray-500">
              Showing cached data. Some features may be limited.
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden sticky top-24">
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full border-4 border-gray-900 overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={handleAvatarError}
                        />
                      ) : user?.avatar && !avatarError ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          onError={handleAvatarError}
                        />
                      ) : (
                        <img
                          src={defaultAvatar}
                          alt={user?.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Avatar Upload Overlay */}
                    {editMode && (
                      <label
                        htmlFor="avatar-upload"
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Camera className="w-8 h-8 text-white" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="pt-20 p-6 text-center">
                <h2 className="text-2xl font-bold text-white mb-1">{user?.name || 'User'}</h2>
                <p className="text-gray-400 mb-4">{user?.email || 'No email'}</p>

                {/* Tier Badge */}
                {user?.tier && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getTierColor(user.tier.name)} rounded-full mb-4`}>
                    <Crown className="w-4 h-4 text-white" />
                    <span className="text-white font-medium">{user.tier.name} Tier</span>
                  </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Wallet className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 mb-1">Wallet</p>
                    <p className="text-lg font-bold text-white">PKR {user?.wallet || 0}</p>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl">
                    <Award className="w-5 h-5 text-purple-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 mb-1">Earnings</p>
                    <p className="text-lg font-bold text-white">PKR {user?.totalEarnings || 0}</p>
                  </div>
                </div>

                {/* Member Since */}
                <div className="mt-4 p-3 bg-white/5 rounded-xl flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Member since</p>
                    <p className="text-sm text-white">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>

                {/* Referral Code */}
                <div className="mt-4 p-3 bg-white/5 rounded-xl">
                  <p className="text-xs text-gray-400 mb-2">Your Referral Code</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm text-blue-400 font-mono bg-black/40 p-2 rounded-lg border border-white/10">
                      {user?.referralCode || 'N/A'}
                    </code>
                    <button
                      onClick={copyReferralCode}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition"
                    >
                      {copied ? (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Edit Mode Toggle */}
                <button
                  onClick={() => setEditMode(!editMode)}
                  className={`w-full mt-4 px-4 py-2 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                    editMode
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                      : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  {editMode ? (
                    <>
                      <X className="w-4 h-4" />
                      Cancel Edit
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              {/* Tabs */}
              <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Profile Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === 'security'
                      ? 'bg-blue-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Security
                </button>
              </div>

              {activeTab === 'profile' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editMode || connectionError}
                      required
                      className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition ${
                        !editMode || connectionError ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!editMode || connectionError}
                      required
                      className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition ${
                        !editMode || connectionError ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Avatar Preview */}
                  {avatarPreview && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">New Avatar Preview</label>
                      <div className="flex items-center gap-4">
                        <img
                          src={avatarPreview}
                          alt="Preview"
                          className="w-20 h-20 rounded-full object-cover border-2 border-blue-500"
                          onError={handleAvatarError}
                        />
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition text-sm flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Uploading...</span>
                        <span className="text-blue-400">{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-red-400">{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  {editMode && (
                    <button
                      type="submit"
                      disabled={updating || connectionError}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {updating ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Updating...
                        </>
                      ) : connectionError ? (
                        <>
                          <WifiOff className="w-5 h-5" />
                          No Connection
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  )}
                </form>
              )}

              {activeTab === 'security' && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        disabled={!editMode || connectionError}
                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition ${
                          !editMode || connectionError ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        placeholder="Enter new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>

                    {/* Password Strength */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength + 1) * 20}%` }}
                              className={`h-full ${getPasswordStrengthColor()} rounded-full`}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{getPasswordStrengthText()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Use at least 8 characters with uppercase, numbers & symbols
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={!editMode || connectionError}
                        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition ${
                          !editMode || connectionError ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                        placeholder="Confirm new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {/* Security Tips */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-400 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Security Tips
                    </h4>
                    <ul className="space-y-2 text-xs text-gray-400">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Use a unique password you don't use elsewhere
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Include numbers, symbols, and mixed case letters
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400" />
                        Change your password regularly
                      </li>
                    </ul>
                  </div>

                  {/* Submit Button */}
                  {editMode && (
                    <button
                      type="submit"
                      disabled={updating || connectionError}
                      className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {updating ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Updating...
                        </>
                      ) : connectionError ? (
                        <>
                          <WifiOff className="w-5 h-5" />
                          No Connection
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Update Password
                        </>
                      )}
                    </button>
                  )}
                </form>
              )}

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full mt-4 px-4 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium rounded-xl transition flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Fixed: Removed the <style jsx> tag and replaced with regular style tag */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Profile;