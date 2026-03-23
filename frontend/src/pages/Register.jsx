// components/auth/Register.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Gift, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Copy,
  Upload,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  Award
} from 'lucide-react';
import API from '../api/axios';

const Register = () => {
  const navigate = useNavigate();
  
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });
  const [tiers, setTiers] = useState([]);
  const [selectedTier, setSelectedTier] = useState(null);
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [hoveredTier, setHoveredTier] = useState(null);
  const [copied, setCopied] = useState(false);

  // Fetch tiers on component mount
  useEffect(() => {
    fetchTiers();
  }, []);

  // Password strength calculator
  useEffect(() => {
    let strength = 0;
    if (formData.password.length > 7) strength += 1;
    if (formData.password.match(/[A-Z]/)) strength += 1;
    if (formData.password.match(/[0-9]/)) strength += 1;
    if (formData.password.match(/[^A-Za-z0-9]/)) strength += 1;
    setPasswordStrength(strength);
  }, [formData.password]);

  const fetchTiers = async () => {
    try {
      const response = await API.get('/auth/tiers');
      console.log('Tiers response:', response.data); // Debug log
      if (response.data.success) {
        setTiers(response.data.tiers);
      } else {
        console.error('Failed to fetch tiers:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching tiers:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to load tiers. Please refresh the page.' 
      });
    }
  };

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage({ type: '', text: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPaymentProof(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPaymentPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validation
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (pass) => pass.length >= 8;

  // Step 1: Register user
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Please enter your name' });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }
    
    if (!validatePassword(formData.password)) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }
    
    if (!termsAccepted) {
      setMessage({ type: 'error', text: 'Please accept the terms and conditions' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        referralCode: formData.referralCode || undefined,
        role: 'user'
      });
      
      console.log('Registration response:', response.data); // Debug log
      
      if (response.data.success) {
        setMessage({ type: 'success', text: 'Account created successfully!' });
        setUserId(response.data.user.id);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token); // Save token if returned
        
        // Move to tier selection after a brief delay
        setTimeout(() => {
          setCurrentStep(2);
          setMessage({ type: '', text: '' });
        }, 1000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Registration failed. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Select Tier
  const handleSelectTier = async (tier) => {
    if (!userId) {
      setMessage({ type: 'error', text: 'User ID not found. Please restart registration.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await API.post(`/auth/selectTier/${userId}`, {
        tierId: tier._id
      });

      console.log('Select tier response:', response.data); // Debug log

      if (response.data.success) {
        setSelectedTier(tier);
        setMessage({ type: 'success', text: 'Tier selected successfully!' });
        
        // Move to payment step after a brief delay
        setTimeout(() => {
          setCurrentStep(3);
          setMessage({ type: '', text: '' });
        }, 1000);
      }
    } catch (error) {
      console.error('Tier selection error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to select tier. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Submit payment proof
  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    
    if (!paymentProof) {
      setMessage({ type: 'error', text: 'Please upload payment proof' });
      return;
    }

    if (!userId) {
      setMessage({ type: 'error', text: 'User ID not found. Please restart registration.' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('paymentProof', paymentProof);

    try {
      const response = await API.post(`/auth/submitPaymentProof/${userId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('Payment submission response:', response.data); // Debug log

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Payment proof submitted! Redirecting to login...' });
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload payment proof. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-[#0B0B10] flex items-center justify-center p-4">
      {/* Subtle gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-[480px]">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              VidCash
            </h1>
          </Link>
          <p className="text-gray-600 text-xs mt-1">by Zayn Ali</p>
        </motion.div>

        {/* Main card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#13131A] rounded-2xl border border-white/[0.05] shadow-2xl overflow-hidden"
        >
          {/* Header with steps */}
          <div className="px-6 pt-6 pb-4 border-b border-white/[0.05]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-white">Create account</h2>
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                      step < currentStep 
                        ? 'bg-blue-500 text-white' 
                        : step === currentStep
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                        : 'bg-white/[0.05] text-gray-600'
                    }`}>
                      {step < currentStep ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 3 && (
                      <div className={`w-6 h-[1px] mx-1 ${
                        step < currentStep ? 'bg-blue-500/50' : 'bg-white/[0.05]'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / 3) * 100}%` }}
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              />
            </div>
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
                  <span>{message.text}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Registration */}
              {currentStep === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleRegister}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">Full name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 pl-9 pr-3 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 pl-9 pr-3 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 pl-9 pr-10 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    {/* Password strength */}
                    {formData.password && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-1 bg-white/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(passwordStrength + 1) * 20}%` }}
                              className={`h-full ${getPasswordStrengthColor()} rounded-full`}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{getPasswordStrengthText()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">Confirm password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 pl-9 pr-10 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  {/* Referral code */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">
                      Referral code <span className="text-gray-600">(optional)</span>
                    </label>
                    <div className="relative">
                      <Gift className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                      <input
                        type="text"
                        name="referralCode"
                        value={formData.referralCode}
                        onChange={handleInputChange}
                        className="w-full h-10 pl-9 pr-3 bg-white/[0.03] border border-white/[0.05] rounded-lg text-white text-sm placeholder-gray-700 focus:outline-none focus:border-blue-500/50 transition"
                        placeholder="Enter code"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      termsAccepted 
                        ? 'bg-blue-500 border-blue-500' 
                        : 'border-white/[0.1] group-hover:border-white/[0.2]'
                    }`}>
                      {termsAccepted && <CheckCircle className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-xs text-gray-500">
                      I agree to the{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition">Terms</a>
                      {' '}and{' '}
                      <a href="#" className="text-blue-400 hover:text-blue-300 transition">Privacy</a>
                    </span>
                  </label>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create account
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  {/* Login link */}
                  <p className="text-center text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-400 hover:text-blue-300 transition">
                      Sign in
                    </Link>
                  </p>
                </motion.form>
              )}

              {/* Step 2: Tier Selection */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-base font-medium text-white mb-1">Choose your plan</h3>
                    <p className="text-xs text-gray-500">Select the tier that matches your goals</p>
                  </div>

                  {tiers.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-8 h-8 border-2 border-gray-700 border-t-blue-500 rounded-full animate-spin mx-auto mb-3" />
                      <p className="text-xs text-gray-500">Loading tiers...</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {tiers.map((tier) => {
                        const isHovered = hoveredTier === tier._id;
                        const isSelected = selectedTier?._id === tier._id;

                        const tierStyles = {
                          Bronze: { border: 'border-orange-500/30', bg: 'bg-orange-500/5', text: 'text-orange-400' },
                          Silver: { border: 'border-gray-500/30', bg: 'bg-gray-500/5', text: 'text-gray-400' },
                          Gold: { border: 'border-yellow-500/30', bg: 'bg-yellow-500/5', text: 'text-yellow-400' },
                          Diamond: { border: 'border-blue-500/30', bg: 'bg-blue-500/5', text: 'text-blue-400' }
                        };

                        return (
                          <motion.button
                            key={tier._id}
                            onHoverStart={() => setHoveredTier(tier._id)}
                            onHoverEnd={() => setHoveredTier(null)}
                            onClick={() => !loading && handleSelectTier(tier)}
                            disabled={loading}
                            whileHover={{ scale: 1.01 }}
                            className={`w-full p-4 rounded-lg border transition-all text-left ${
                              isSelected 
                                ? tierStyles[tier.name]?.border + ' ' + tierStyles[tier.name]?.bg
                                : 'border-white/[0.05] hover:border-white/[0.1] bg-white/[0.02]'
                            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-start gap-3">
                              <span className={`text-2xl ${tierStyles[tier.name]?.text || 'text-gray-400'}`}>
                                {tier.name === 'Bronze' ? '🥉' :
                                 tier.name === 'Silver' ? '🥈' :
                                 tier.name === 'Gold' ? '🥇' : '💎'}
                              </span>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium text-white">{tier.name}</h4>
                                  <span className="text-xs text-gray-400">PKR {tier.price}/mo</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <div>
                                    <div className="text-[10px] text-gray-600">Multiplier</div>
                                    <div className="text-xs font-medium text-white">{tier.multiplier}x</div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-gray-600">Daily</div>
                                    <div className="text-xs font-medium text-white">PKR {tier.dailyEarningLimit}</div>
                                  </div>
                                  <div>
                                    <div className="text-[10px] text-gray-600">Videos</div>
                                    <div className="text-xs font-medium text-white">{tier.maxVideosPerDay}</div>
                                  </div>
                                </div>
                              </div>
                              {isSelected && (
                                <CheckCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                              )}
                              {loading && isSelected && (
                                <div className="w-4 h-4 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* Back button */}
                  <button
                    onClick={() => setCurrentStep(1)}
                    disabled={loading}
                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-400 transition mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    Back to registration
                  </button>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.form
                  key="step3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmitPayment}
                  className="space-y-4"
                >
                  {/* Selected tier summary */}
                  {selectedTier && (
                    <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-3">
                        <Award className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-white">{selectedTier.name} Plan</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Amount to pay:</span>
                        <span className="text-white font-medium">PKR {selectedTier.price}</span>
                      </div>

                      {/* Payment address */}
                      <div className="mt-3 p-3 bg-black/40 rounded-lg border border-white/[0.05]">
                        <p className="text-[10px] text-gray-600 mb-1">BTC Address:</p>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 text-[10px] text-blue-400 font-mono break-all">
                            3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy
                          </code>
                          <button
                            type="button"
                            onClick={() => handleCopy('3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy')}
                            className="p-1.5 bg-white/[0.03] hover:bg-white/[0.05] rounded transition group"
                          >
                            <Copy className="w-3 h-3 text-gray-500 group-hover:text-gray-400" />
                          </button>
                        </div>
                        {copied && (
                          <p className="text-[10px] text-emerald-400 mt-1">Copied!</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* File upload */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">
                      Upload payment screenshot
                    </label>
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="payment-proof"
                        disabled={loading}
                      />
                      <label
                        htmlFor="payment-proof"
                        className={`block cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div className={`border-2 border-dashed rounded-lg transition ${
                          paymentPreview 
                            ? 'border-blue-500/30 bg-blue-500/5' 
                            : 'border-white/[0.05] hover:border-white/[0.1] bg-white/[0.02]'
                        }`}>
                          {paymentPreview ? (
                            <div className="relative">
                              <img
                                src={paymentPreview}
                                alt="Preview"
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition">
                                <span className="text-xs text-white">Click to change</span>
                              </div>
                            </div>
                          ) : (
                            <div className="h-32 flex flex-col items-center justify-center">
                              <Upload className="w-5 h-5 text-gray-600 mb-1" />
                              <p className="text-xs text-gray-400">Click to upload</p>
                              <p className="text-[10px] text-gray-600 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      disabled={loading}
                      className="flex-1 h-9 bg-white/[0.03] hover:bg-white/[0.05] text-gray-400 text-sm font-medium rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      <ArrowLeft className="w-3 h-3" />
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !paymentProof}
                      className="flex-1 h-9 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                    >
                      {loading ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing
                        </>
                      ) : (
                        <>
                          Submit
                          <ChevronRight className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4 mt-4"
        >
          {[
            { icon: Shield, text: 'Secure' },
            { icon: Zap, text: 'Instant' },
            { icon: Award, text: 'Trusted' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-center gap-1 text-gray-600">
                <Icon className="w-3 h-3" />
                <span className="text-[10px]">{item.text}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default Register;