// components/auth/Login.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  LogIn,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Award,
  Github,
  Chrome
} from 'lucide-react';
import API from '../api/axios';

const Login = () => {
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);

  // Check for saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setMessage({ type: '', text: '' });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }
    if (!formData.password) {
      setMessage({ type: 'error', text: 'Please enter your password' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await API.post('/auth/login', formData);

      if (response.data.success) {
        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Save token and user data
        localStorage.setItem('token', response.data.accessToken);
        localStorage.setItem('user', JSON.stringify(response.data.user));

        // Show success message
        setMessage({ 
          type: 'success', 
          text: 'Login successful! Redirecting...' 
        });

        // Redirect based on user role
        setTimeout(() => {
          if (response.data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }, 1500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  const floatAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B10] flex items-center justify-center p-4 overflow-hidden">
      {/* Premium animated background */}
      <div className="fixed inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-r from-emerald-600/20 via-blue-600/20 to-purple-600/20 rounded-full blur-3xl"
        />

        {/* Animated grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />

        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
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
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
          />
        ))}
      </div>

      <div className="relative w-full max-w-[420px] z-10">
        {/* Animated logo */}
        <motion.div
          variants={floatAnimation}
          initial="initial"
          animate="animate"
          className="text-center mb-6"
        >
          <Link to="/" className="inline-block group">
            <motion.h1
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              VidCash
            </motion.h1>
          </Link>
          <p className="text-gray-600 text-xs mt-1">Welcome back! 👋</p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
          className="relative"
        >
          {/* Card background with glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50" />
          
          {/* Card content */}
          <div className="relative bg-[#13131A] rounded-2xl border border-white/[0.05] shadow-2xl overflow-hidden">
            {/* Animated border gradient */}
            <div className="absolute inset-0 rounded-2xl p-[1px] overflow-hidden">
              <motion.div
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              />
            </div>

            {/* Header */}
            <div className="relative px-6 pt-8 pb-6 text-center border-b border-white/[0.05]">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center border border-white/[0.05]"
              >
                <LogIn className="w-6 h-6 text-blue-400" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-semibold text-white mb-1"
              >
                Welcome Back
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xs text-gray-500"
              >
                Sign in to continue to your account
              </motion.p>
            </div>

            {/* Messages */}
            <AnimatePresence mode="wait">
              {message.text && (
                <motion.div
                  key={message.text}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-6 pt-4"
                >
                  <div className={`p-3 rounded-lg flex items-start gap-2 text-sm ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                      : 'bg-red-500/10 border border-red-500/20 text-red-400'
                  }`}>
                    {message.type === 'success' ? (
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-xs">{message.text}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <div className="p-6">
              <motion.form
                variants={staggerContainer}
                initial="initial"
                animate="animate"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Email field */}
                <motion.div variants={fadeInUp} className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email address
                  </label>
                  <div className="relative group">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white text-sm placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all group-hover:border-white/[0.1]"
                      placeholder="john@example.com"
                    />
                    <motion.div
                      animate={{
                        scaleX: focusedField === 'email' ? 1 : 0,
                        opacity: focusedField === 'email' ? 1 : 0
                      }}
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </motion.div>

                {/* Password field */}
                <motion.div variants={fadeInUp} className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-400 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Password
                  </label>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className="w-full h-11 px-4 bg-white/[0.03] border border-white/[0.05] rounded-xl text-white text-sm placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition-all group-hover:border-white/[0.1]"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <motion.div
                      animate={{
                        scaleX: focusedField === 'password' ? 1 : 0,
                        opacity: focusedField === 'password' ? 1 : 0
                      }}
                      className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500 to-purple-500"
                    />
                  </div>
                </motion.div>

                {/* Remember me & Forgot password */}
                <motion.div variants={fadeInUp} className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      rememberMe 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-white/[0.1] group-hover:border-white/[0.2]'
                    }`}>
                      {rememberMe && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs text-gray-500">Remember me</span>
                  </label>
                  
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-400 hover:text-blue-300 transition"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Submit button */}
                <motion.button
                  variants={fadeInUp}
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full h-11 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <motion.div
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  />
                </motion.button>

                {/* Social login */}
                <motion.div variants={fadeInUp} className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.05]" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-[#13131A] text-gray-600">Or continue with</span>
                  </div>
                </motion.div>

                <motion.div variants={fadeInUp} className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="h-10 bg-white/[0.03] hover:bg-white/[0.05] rounded-xl flex items-center justify-center gap-2 transition group"
                  >
                    <Github className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300">GitHub</span>
                  </button>
                  <button
                    type="button"
                    className="h-10 bg-white/[0.03] hover:bg-white/[0.05] rounded-xl flex items-center justify-center gap-2 transition group"
                  >
                    <Chrome className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
                    <span className="text-xs text-gray-400 group-hover:text-gray-300">Google</span>
                  </button>
                </motion.div>
              </motion.form>

              {/* Register link */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-center"
              >
                <p className="text-xs text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    to="/register" 
                    className="text-blue-400 hover:text-blue-300 transition font-medium border-b border-blue-400/30 hover:border-blue-400"
                  >
                    Create free account
                  </Link>
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Demo credentials - Elegant card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-white/[0.02] rounded-xl border border-white/[0.05] backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-3 h-3 text-yellow-400" />
            <span className="text-xs font-medium text-gray-400">Demo Access</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setFormData({
                  email: 'user@example.com',
                  password: 'user123'
                });
                setMessage({ type: 'success', text: 'Demo user credentials filled!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 2000);
              }}
              className="px-3 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg transition group"
            >
              <div className="text-xs font-medium text-white">👤 User Demo</div>
              <div className="text-[10px] text-gray-500 mt-0.5">user@example.com</div>
            </button>
            
            <button
              onClick={() => {
                setFormData({
                  email: 'admin@example.com',
                  password: 'admin123'
                });
                setMessage({ type: 'success', text: 'Admin credentials filled!' });
                setTimeout(() => setMessage({ type: '', text: '' }), 2000);
              }}
              className="px-3 py-2 bg-white/[0.03] hover:bg-white/[0.05] rounded-lg transition group"
            >
              <div className="text-xs font-medium text-white">👑 Admin Demo</div>
              <div className="text-[10px] text-gray-500 mt-0.5">admin@example.com</div>
            </button>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4 mt-4"
        >
          {[
            { icon: Shield, text: 'Secure' },
            { icon: Zap, text: 'Fast' },
            { icon: Award, text: 'Trusted' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="flex items-center gap-1 text-gray-600"
              >
                <Icon className="w-3 h-3" />
                <span className="text-[10px]">{item.text}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Login;