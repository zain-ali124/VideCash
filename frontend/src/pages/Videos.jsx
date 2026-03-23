// pages/Videos.jsx
import { useEffect, useRef, useState, useCallback } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import { toast, Toaster } from "react-hot-toast";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Clock,
  DollarSign,
  Eye,
  Film,
  Search,
  Grid,
  List,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Wallet,
  Award,
  TrendingUp,
  Sparkles,
  Zap,
  Crown,
  Star,
  Calendar,
  Target,
  Video as VideoIcon,
  Trophy,
  Gift,
  Info
} from "lucide-react";

const Videos = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchTime, setWatchTime] = useState(0);
  const [hasEarned, setHasEarned] = useState(false);
  const [loading, setLoading] = useState(true);
  const [earning, setEarning] = useState(false);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [rewardData, setRewardData] = useState(null);
  const [confetti, setConfetti] = useState([]);

  const videoRef = useRef(null);
  const progressInterval = useRef(null);
  const navigate = useNavigate();

  // 1️⃣ Fetch all videos and user stats
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch videos
        const videosRes = await API.get("/auth/videos");
        setVideos(videosRes.data.videos);
        
        // Fetch user's video stats (today's earnings, limit, etc.)
        try {
          const statsRes = await API.get("/auth/video-stats");
          setUserStats(statsRes.data.stats);
        } catch (statsErr) {
          console.log("Stats not available yet");
        }
        
      } catch (error) {
        console.error("Error fetching videos:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Failed to load videos. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  // 2️⃣ Filter and sort videos
  useEffect(() => {
    let filtered = [...videos];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "highest-reward":
        filtered.sort((a, b) => b.reward - a.reward);
        break;
      case "lowest-reward":
        filtered.sort((a, b) => a.reward - b.reward);
        break;
      case "shortest":
        filtered.sort((a, b) => a.duration - b.duration);
        break;
      case "longest":
        filtered.sort((a, b) => b.duration - a.duration);
        break;
      default:
        break;
    }

    setFilteredVideos(filtered);
  }, [videos, searchQuery, sortBy]);

  // 3️⃣ Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, []);

  // 4️⃣ Start/stop watch time tracking
  useEffect(() => {
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }

    // Start new interval if video is playing and not earned yet
    if (videoRef.current && selectedVideo && !hasEarned && !earning) {
      progressInterval.current = setInterval(() => {
        if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
          setWatchTime((prev) => {
            const newTime = prev + 1;
            
            // Check if we've reached 75%
            if (selectedVideo && newTime >= selectedVideo.duration * 0.75 && !hasEarned && !earning) {
              earnReward();
            }
            
            return newTime;
          });
        }
      }, 1000);
    }

    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
        progressInterval.current = null;
      }
    };
  }, [selectedVideo, hasEarned, earning]);

  // 5️⃣ Check if user already earned for this video
  useEffect(() => {
    if (selectedVideo && selectedVideo.watched) {
      setHasEarned(true);
      setWatchTime(selectedVideo.duration);
    }
  }, [selectedVideo]);

  // 6️⃣ Earn reward API
  const earnReward = useCallback(async () => {
    if (!selectedVideo || hasEarned || earning) return;

    try {
      setEarning(true);
      
      const response = await API.post(`/auth/earnVideoReward/${selectedVideo._id}`, {
        watchTime: Math.min(watchTime, selectedVideo.duration),
      });

      if (response.data.success) {
        setHasEarned(true);
        setRewardData(response.data.data);
        
        // Generate confetti
        const newConfetti = Array.from({ length: 50 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          size: Math.random() * 10 + 5,
          color: `hsl(${Math.random() * 60 + 40}, 100%, 50%)`,
          delay: Math.random() * 0.5
        }));
        setConfetti(newConfetti);
        
        setShowRewardModal(true);
        
        // Update video in list to show it's watched
        setVideos(prevVideos => 
          prevVideos.map(v => 
            v._id === selectedVideo._id 
              ? { ...v, watched: true } 
              : v
          )
        );
        
        // Update user stats
        if (userStats) {
          setUserStats({
            ...userStats,
            todayEarnings: (userStats.todayEarnings || 0) + response.data.data.reward,
            videosWatchedToday: (userStats.videosWatchedToday || 0) + 1
          });
        }
        
        toast.success(`🎉 You earned PKR ${response.data.data.reward}!`);
        
        // Auto close modal after 4 seconds
        setTimeout(() => {
          setShowRewardModal(false);
          setConfetti([]);
        }, 4000);
      }
    } catch (error) {
      console.error("Error earning reward:", error);
      
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        const errorMsg = error.response?.data?.message || "Error earning reward";
        toast.error(`❌ ${errorMsg}`);
      }
    } finally {
      setEarning(false);
    }
  }, [selectedVideo, hasEarned, earning, watchTime, userStats, navigate]);

  // 7️⃣ Select video
  const handleSelectVideo = (video) => {
    // Check if user has reached daily limit
    if (userStats && userStats.todayEarnings >= userStats.dailyLimit) {
      toast.error("⚠️ You've reached your daily earning limit!");
      return;
    }
    
    // Check if video already watched
    if (video.watched) {
      toast.error("You've already earned from this video");
      return;
    }
    
    setSelectedVideo(video);
    setWatchTime(0);
    setHasEarned(false);
    setError(null);
  };

  // 8️⃣ Skip video
  const handleSkip = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    
    setSelectedVideo(null);
    setWatchTime(0);
    setHasEarned(false);
    setEarning(false);
  };

  // 9️⃣ Handle video end
  const handleVideoEnd = () => {
    if (!hasEarned && !earning) {
      // If video ended but user didn't watch 75%, they don't get reward
      toast.error("⚠️ You need to watch at least 75% of the video to earn reward");
    }
  };

  // 🔟 Format time
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Get tier color
  const getTierColor = () => {
    if (!userStats?.tier) return "from-blue-500 to-purple-500";
    const colors = {
      "Bronze": "from-orange-500 to-amber-500",
      "Silver": "from-gray-400 to-gray-500",
      "Gold": "from-yellow-500 to-amber-500",
      "Diamond": "from-blue-500 to-purple-500"
    };
    return colors[userStats.tier] || "from-blue-500 to-purple-500";
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
          <p className="text-white text-lg">Loading videos...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
          >
            Try Again
          </button>
        </div>
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
            background: "#1F2937",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
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
        {/* Header with User Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Watch & Earn</h1>
              <p className="text-gray-400">Watch videos and earn rewards instantly</p>
            </div>

            {/* Tier Badge */}
            {userStats && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${getTierColor()} rounded-full`}
              >
                <Crown className="w-4 h-4 text-white" />
                <span className="text-white font-medium">{userStats.tier || "Bronze"} Tier</span>
              </motion.div>
            )}
          </div>

          {/* Stats Cards */}
          {userStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-blue-400" />
                  <span className="text-xs text-gray-400">Today's Earnings</span>
                </div>
                <p className="text-xl font-bold text-white">PKR {userStats.todayEarnings || 0}</p>
                <p className="text-xs text-gray-500 mt-1">of PKR {userStats.dailyLimit || 0}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-400">This Week</span>
                </div>
                <p className="text-xl font-bold text-white">PKR {userStats.weekEarnings || 0}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-gray-400">This Month</span>
                </div>
                <p className="text-xl font-bold text-white">PKR {userStats.monthEarnings || 0}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <VideoIcon className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-gray-400">Watched Today</span>
                </div>
                <p className="text-xl font-bold text-white">{userStats.videosWatchedToday || 0}</p>
              </motion.div>
            </div>
          )}

          {/* Daily Progress Bar */}
          {userStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-4 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Daily Progress</span>
                <span className="text-sm text-white">
                  {userStats.dailyLimit > 0 
                    ? Math.min(100, Math.round((userStats.todayEarnings / userStats.dailyLimit) * 100)) 
                    : 0}%
                </span>
              </div>
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${userStats.dailyLimit > 0 
                      ? Math.min(100, (userStats.todayEarnings / userStats.dailyLimit) * 100) 
                      : 0}%` 
                  }}
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {userStats.dailyLimit - userStats.todayEarnings > 0 
                  ? `PKR ${userStats.dailyLimit - userStats.todayEarnings} remaining today` 
                  : "Daily limit reached"}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-blue-500/50 transition"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest-reward">Highest Reward</option>
              <option value="lowest-reward">Lowest Reward</option>
              <option value="shortest">Shortest</option>
              <option value="longest">Longest</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Video Grid */}
        {!selectedVideo && (
          <>
            {filteredVideos.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Film className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No videos found</h3>
                <p className="text-gray-400">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filteredVideos.map((video, index) => (
                  <motion.div
                    key={video._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: viewMode === "grid" ? 1.03 : 1.01, y: -4 }}
                    className={`relative group cursor-pointer ${
                      viewMode === "list" ? "flex gap-4" : ""
                    } ${video.watched ? "opacity-75" : ""}`}
                    onClick={() => !video.watched && handleSelectVideo(video)}
                  >
                    {/* Thumbnail */}
                    <div
                      className={`relative overflow-hidden rounded-xl ${
                        viewMode === "grid" ? "aspect-video" : "w-48 h-28 flex-shrink-0"
                      }`}
                    >
                      <img
                        src={video.thumbnail || "https://images.unsplash.com/photo-1578022761797-b8636ac1773c?w=640&h=360&fit=crop"}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-2 left-2 flex items-center gap-2">
                          <Play className="w-8 h-8 text-white" />
                          <span className="text-white text-sm font-medium">Watch now</span>
                        </div>
                      </div>

                      {/* Duration Badge */}
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 rounded-lg text-xs text-white">
                        {formatTime(video.duration)}
                      </div>

                      {/* Watched Badge */}
                      {video.watched && (
                        <div className="absolute top-2 left-2 px-2 py-1 bg-emerald-500 rounded-lg text-xs text-white flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Watched
                        </div>
                      )}
                    </div>

                    {/* Video Info */}
                    <div className={`flex-1 ${viewMode === "list" ? "py-1" : "mt-3"}`}>
                      <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">
                        {video.title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatTime(video.duration)}
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                          <DollarSign className="w-4 h-4" />
                          PKR {video.reward}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {video.views || 0}
                        </span>
                      </div>
                      {video.watched && (
                        <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Already earned
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Video Player */}
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">{selectedVideo.title}</h2>
              <button
                onClick={handleSkip}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="bg-black/50 rounded-2xl overflow-hidden border border-white/10">
              <div className="relative">
                <video
                  ref={videoRef}
                  src={selectedVideo.videoUrl}
                  controls
                  autoPlay
                  onEnded={handleVideoEnd}
                  className="w-full max-h-[70vh] object-contain"
                />

                {/* Reward Info Overlay */}
                {!hasEarned && !earning && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 flex items-center gap-3">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-white">
                      Watch {formatTime(selectedVideo.duration * 0.75)} to earn
                    </span>
                    <span className="text-sm font-bold text-emerald-400">
                      PKR {selectedVideo.reward}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-400">
                      {formatTime(watchTime)} / {formatTime(selectedVideo.duration)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">
                      Need: {formatTime(selectedVideo.duration * 0.75)}
                    </span>
                  </div>
                </div>

                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${(watchTime / selectedVideo.duration) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                  <div
                    className="absolute top-0 w-0.5 h-full bg-yellow-400"
                    style={{ left: `${(selectedVideo.duration * 0.75 / selectedVideo.duration) * 100}%` }}
                  />
                </div>

                {/* Status Messages */}
                <div className="mt-4 text-center">
                  {hasEarned && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30">
                      <Trophy className="w-5 h-5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">
                        Reward earned! PKR {selectedVideo.reward} added to wallet
                      </span>
                    </div>
                  )}
                  
                  {earning && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 rounded-lg border border-blue-500/30">
                      <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                      <span className="text-blue-400 font-medium">Processing reward...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Reward Modal */}
      <AnimatePresence>
        {showRewardModal && rewardData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowRewardModal(false);
              setConfetti([]);
            }}
          >
            {/* Confetti Animation */}
            {confetti.map((c) => (
              <motion.div
                key={c.id}
                initial={{
                  x: `${c.x}vw`,
                  y: "-10vh",
                  rotate: 0,
                  scale: 0
                }}
                animate={{
                  y: "110vh",
                  rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                  scale: 1
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: c.delay,
                  ease: "easeOut"
                }}
                className="absolute"
                style={{
                  width: c.size,
                  height: c.size,
                  backgroundColor: c.color,
                  borderRadius: "2px"
                }}
              />
            ))}

            {/* Main Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 20, repeat: Infinity }}
                  className="absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur-3xl"
                />
                <motion.div
                  animate={{
                    scale: [1, 1.3, 1],
                    rotate: [0, -360],
                  }}
                  transition={{ duration: 25, repeat: Infinity }}
                  className="absolute -left-20 -bottom-20 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl"
                />
              </div>

              <div className="relative p-8 text-center">
                {/* Success Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="relative mx-auto mb-6"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full blur-xl"
                  />
                  <div className="relative w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-12 h-12 text-white" />
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-white mb-2"
                >
                  Reward Earned! 🎉
                </motion.h2>

                {/* Video Title */}
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm text-gray-400 mb-4"
                >
                  from "{selectedVideo?.title}"
                </motion.p>

                {/* Amount */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-400 mb-6"
                >
                  PKR {rewardData.reward}
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="grid grid-cols-2 gap-4 mb-6"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <Wallet className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 mb-1">Wallet Balance</p>
                    <p className="text-lg font-semibold text-white">PKR {rewardData.wallet}</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-white/5 rounded-xl border border-white/10"
                  >
                    <TrendingUp className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-400 mb-1">Today's Earnings</p>
                    <p className="text-lg font-semibold text-emerald-400">PKR {rewardData.dailyEarning}</p>
                  </motion.div>
                </motion.div>

                {/* Continue Button */}
                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowRewardModal(false);
                    setConfetti([]);
                  }}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-xl hover:shadow-lg transition"
                >
                  Continue Watching
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Styles */}
      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 14px;
          height: 14px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        input[type=range]::-moz-range-thumb {
          width: 14px;
          height: 14px;
          background: #3B82F6;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        input[type=range]::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          transition: transform 0.2s;
        }
      `}</style>
    </div>
  );
};

export default Videos;