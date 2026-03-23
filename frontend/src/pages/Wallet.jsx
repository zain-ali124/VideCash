// pages/Wallet.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Wallet as WalletIcon,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Copy,
  Share2,
  Download,
  Calendar,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  History,
  Banknote,
  CreditCard,
  Smartphone,
  Landmark,
  Loader,
  Check,
  X,
  Info,
  Shield,
  Lock,
  Gift,
  Award,
  Sparkles,
  Rocket,
  Zap,
  Users
} from 'lucide-react';
import API from '../api/axios';
import NavBar from '../components/NavBar';
import { Toaster, toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Wallet = () => {
  const navigate = useNavigate();
  
  // State management
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  
  // Withdrawal form state
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [accountDetails, setAccountDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    accountType: 'bank' // bank, easypaisa, jazzcash
  });
  const [submitting, setSubmitting] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  // Fetch wallet data on mount
  useEffect(() => {
    fetchWalletData();
    fetchTransactions();
    fetchWithdrawals();
  }, []);

  // Fetch wallet balance and earnings
  const fetchWalletData = async () => {
    try {
      const response = await API.get('/auth/earning');
      if (response.data.success) {
        setWalletData(response.data.earnings);
      }
    } catch (error) {
      console.error('Error fetching wallet data:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
      } else {
        toast.error('Failed to load wallet data');
      }
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    try {
      const response = await API.get('/auth/transactions');
      if (response.data.success) {
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Fetch withdrawal history
  const fetchWithdrawals = async () => {
    try {
      const response = await API.get('/auth/withdrawals');
      if (response.data.success) {
        setWithdrawals(response.data.withdrawals || []);
      }
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh all data
  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      fetchWalletData(),
      fetchTransactions(),
      fetchWithdrawals()
    ]);
    toast.success('Wallet updated!');
  };

  // Handle withdrawal request - FIXED: Format account details as string
  const handleWithdraw = async (e) => {
    e.preventDefault();
    setWithdrawError('');

    // Validate amount
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError('Please enter a valid amount');
      return;
    }

    // Check minimum amount (if you want to keep it)
    if (amount < 4) {
      setWithdrawError('Minimum withdrawal amount is PKR 100');
      return;
    }

    // Check if amount exceeds wallet balance
    if (amount > (walletData?.wallet || 0)) {
      setWithdrawError('Insufficient wallet balance');
      return;
    }

    // Validate account details
    if (!accountDetails.accountName || !accountDetails.accountNumber) {
      setWithdrawError('Please fill in all account details');
      return;
    }

    if (accountDetails.accountType === 'bank' && !accountDetails.bankName) {
      setWithdrawError('Please enter bank name');
      return;
    }

    setSubmitting(true);

    try {
      // ✅ FIXED: Format account details as a single string for backend
      let formattedAccountDetails = '';
      
      if (accountDetails.accountType === 'bank') {
        formattedAccountDetails = `Bank: ${accountDetails.bankName}, Account Name: ${accountDetails.accountName}, Account Number: ${accountDetails.accountNumber}`;
      } else {
        formattedAccountDetails = `${accountDetails.accountType === 'easypaisa' ? 'EasyPaisa' : 'JazzCash'}: ${accountDetails.accountName}, Number: ${accountDetails.accountNumber}`;
      }

      const response = await API.post('/auth/withdraw', {
        amount,
        accountDetails: formattedAccountDetails // Send as string, not object
      });

      if (response.data.success) {
        toast.success('Withdrawal request submitted successfully!');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        setAccountDetails({
          accountName: '',
          accountNumber: '',
          bankName: '',
          accountType: 'bank'
        });
        
        // Refresh data
        await fetchWalletData();
        await fetchWithdrawals();
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      const errorMsg = error.response?.data?.message || 'Failed to submit withdrawal request';
      setWithdrawError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy • hh:mm a');
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Clock },
      'approved': { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: CheckCircle },
      'completed': { color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', icon: CheckCircle },
      'rejected': { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: XCircle },
      'cancelled': { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: XCircle }
    };
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full border ${config.color}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  // Get transaction icon
  const getTransactionIcon = (type) => {
    const icons = {
      'earning': { icon: TrendingUp, color: 'text-green-400 bg-green-500/20' },
      'referral_bonus': { icon: Gift, color: 'text-blue-400 bg-blue-500/20' },
      'withdrawal': { icon: TrendingDown, color: 'text-red-400 bg-red-500/20' }
    };
    const config = icons[type] || icons.earning;
    const Icon = config.icon;
    
    return (
      <div className={`p-2 rounded-lg ${config.color}`}>
        <Icon className="w-4 h-4" />
      </div>
    );
  };

  if (loading) {
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
          <p className="text-white text-lg">Loading wallet...</p>
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-bold text-white mb-2">My Wallet</h1>
            <p className="text-gray-400">Manage your earnings and withdrawals</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              disabled={refreshing}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-gray-300 transition flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition flex items-center gap-2"
            >
              <WalletIcon className="w-4 h-4" />
              Withdraw
            </motion.button>
          </motion.div>
        </div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl" />
            
            {/* Animated Background Pattern */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 360],
              }}
              transition={{ duration: 20, repeat: Infinity }}
              className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full"
            />

            {/* Content */}
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <WalletIcon className="w-6 h-6 text-blue-400" />
                    <span className="text-sm text-gray-300">Available Balance</span>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="p-1 hover:bg-white/10 rounded transition"
                    >
                      {showBalance ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                    </button>
                  </div>
                  <h2 className="text-5xl font-bold text-white mb-2">
                    {showBalance ? formatCurrency(walletData?.wallet) : '••••••'}
                  </h2>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Total Earnings:</span>
                    <span className="text-emerald-400 font-medium">{formatCurrency(walletData?.totalEarnings)}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-right mb-4">
                    <p className="text-sm text-gray-400 mb-1">Today's Earnings</p>
                    <p className="text-2xl font-bold text-emerald-400">{formatCurrency(walletData?.dailyEarning)}</p>
                  </div>
                  {walletData?.tier && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${
                      walletData.tier.name === 'Bronze' ? 'from-orange-500 to-amber-500' :
                      walletData.tier.name === 'Silver' ? 'from-gray-400 to-gray-500' :
                      walletData.tier.name === 'Gold' ? 'from-yellow-500 to-amber-500' :
                      'from-blue-500 to-purple-500'
                    } rounded-full`}>
                      <Award className="w-4 h-4 text-white" />
                      <span className="text-white text-sm font-medium">{walletData.tier.name} Tier</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm text-gray-400">Last Earning</span>
            </div>
            <p className="text-lg text-white">
              {walletData?.lastEarningDate ? formatDate(walletData.lastEarningDate) : 'No earnings yet'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <History className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm text-gray-400">Last Withdrawal</span>
            </div>
            <p className="text-lg text-white">
              {walletData?.lastWithdrawalDate ? formatDate(walletData.lastWithdrawalDate) : 'No withdrawals yet'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <span className="text-sm text-gray-400">Referrals</span>
            </div>
            <p className="text-lg text-white font-medium">{walletData?.referralCount || 0}</p>
          </motion.div>
        </div>

        {/* Transactions & Withdrawals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transactions History */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Recent Transactions</h3>
            
            {transactions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {transactions.map((transaction, index) => (
                  <motion.div
                    key={transaction._id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                  >
                    <div className="flex items-center gap-3">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <p className="text-sm font-medium text-white">{transaction.description || transaction.type}</p>
                        <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        transaction.type === 'withdrawal' ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <History className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            )}
          </motion.div>

          {/* Withdrawals History */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Withdrawal History</h3>
            
            {withdrawals.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {withdrawals.map((withdrawal, index) => (
                  <motion.div
                    key={withdrawal._id || index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(withdrawal.amount)}
                        </span>
                      </div>
                      {getStatusBadge(withdrawal.status)}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">{formatDate(withdrawal.createdAt)}</span>
                      {withdrawal.processedAt && (
                        <span className="text-gray-500">Processed: {formatDate(withdrawal.processedAt)}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Banknote className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500">No withdrawal requests yet</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Withdrawal Modal - FIXED: Send account details as string */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowWithdrawModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">Request Withdrawal</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Available balance: {formatCurrency(walletData?.wallet)}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleWithdraw} className="p-6 space-y-4">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Amount (PKR)
                  </label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="0.01"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Minimum withdrawal: PKR 100
                  </p>
                </div>

                {/* Account Type */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Account Type</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'bank', label: 'Bank', icon: Landmark },
                      { value: 'easypaisa', label: 'EasyPaisa', icon: Smartphone },
                      { value: 'jazzcash', label: 'JazzCash', icon: Smartphone }
                    ].map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setAccountDetails({ ...accountDetails, accountType: type.value, bankName: type.value === 'bank' ? accountDetails.bankName : '' })}
                          className={`p-3 rounded-xl border transition flex flex-col items-center gap-1 ${
                            accountDetails.accountType === type.value
                              ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-xs">{type.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Account Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Account Holder Name</label>
                  <input
                    type="text"
                    value={accountDetails.accountName}
                    onChange={(e) => setAccountDetails({ ...accountDetails, accountName: e.target.value })}
                    placeholder="Enter account holder name"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition"
                    required
                  />
                </div>

                {/* Account Number */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">Account Number / Mobile Number</label>
                  <input
                    type="text"
                    value={accountDetails.accountNumber}
                    onChange={(e) => setAccountDetails({ ...accountDetails, accountNumber: e.target.value })}
                    placeholder="Enter account/mobile number"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition"
                    required
                  />
                </div>

                {/* Bank Name (only for bank transfers) */}
                {accountDetails.accountType === 'bank' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Bank Name</label>
                    <input
                      type="text"
                      value={accountDetails.bankName}
                      onChange={(e) => setAccountDetails({ ...accountDetails, bankName: e.target.value })}
                      placeholder="Enter bank name"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition"
                      required
                    />
                  </div>
                )}

                {/* Info Box */}
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-400">
                      Withdrawals are processed within 24-48 hours. You must wait 14 days between withdrawals.
                    </p>
                  </div>
                </div>

                {/* Error Message */}
                {withdrawError && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-400">{withdrawError}</span>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Submit
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default Wallet;