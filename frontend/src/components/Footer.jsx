// components/layout/Footer.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  Send,
  Heart,
  Award,
  Shield,
  TrendingUp,
  ChevronRight,
  Star,
  Clock,
  DollarSign,
  Globe, Users
} from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Pricing Plans', href: '#plans' },
    { name: 'Success Stories', href: '#reviews' },
    { name: 'Referral Program', href: '#referral' },
    { name: 'Leaderboard', href: '#leaderboard' },
  ];

  const supportLinks = [
    { name: 'Help Center', href: '/help' },
    { name: 'FAQs', href: '/faq' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
  ];

  const companyLinks = [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Blog', href: '/blog' },
    { name: 'Press Kit', href: '/press' },
    { name: 'Affiliates', href: '/affiliates' },
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Active Users', color: 'blue' },
    { icon: DollarSign, value: '$2M+', label: 'Total Payouts', color: 'green' },
    { icon: Clock, value: '24/7', label: 'Support', color: 'purple' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/vidcash', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: Twitter, href: 'https://twitter.com/vidcash', label: 'Twitter', color: 'hover:bg-sky-500' },
    { icon: Instagram, href: 'https://instagram.com/vidcash', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: Youtube, href: 'https://youtube.com/vidcash', label: 'YouTube', color: 'hover:bg-red-600' },
    { icon: Globe, href: 'https://linkedin.com/company/vidcash', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  ];

  const paymentMethods = [
    'Visa', 'Mastercard', 'PayPal', 'JazzCash', 'EasyPaisa'
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 45, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-20 right-20 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-10"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -45, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-10"
        />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8 items-center"
          >
            <div>
              <h3 className="text-2xl font-bold mb-2">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Stay Updated
                </span>
              </h3>
              <p className="text-gray-400">
                Get the latest news, updates, and exclusive offers directly to your inbox.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-blue-500 transition text-white placeholder-gray-500"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:shadow-lg transition flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Subscribe
              </motion.button>
            </form>
            
            {subscribed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
              >
                Successfully subscribed! 🎉
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Link to="/" className="inline-block mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                VidCash
              </h3>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Transform your screen time into real earnings. Join the future of digital earning with VidCash.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    whileHover={{ y: -5 }}
                    className="text-center"
                  >
                    <Icon className={`w-5 h-5 text-${stat.color}-400 mx-auto mb-1`} />
                    <div className="font-bold text-sm">{stat.value}</div>
                    <div className="text-xs text-gray-500">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="w-4 h-4 text-green-400" />
              <span>SSL Secure</span>
              <Award className="w-4 h-4 text-yellow-400 ml-2" />
              <span>Verified</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <FooterLink key={index} href={link.href}>
                  {link.name}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Support
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <FooterLink key={index} href={link.href}>
                  {link.name}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* Company */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Company
            </h4>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <FooterLink key={index} href={link.href}>
                  {link.name}
                </FooterLink>
              ))}
            </ul>
          </motion.div>

          {/* Contact & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-purple-400" />
              Contact Us
            </h4>
            
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition group">
                <Mail className="w-4 h-4 group-hover:text-blue-400 transition" />
                <a href="mailto:support@vidcash.com" className="text-sm">
                  support@vidcash.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400 hover:text-white transition group">
                <Phone className="w-4 h-4 group-hover:text-green-400 transition" />
                <a href="tel:+923001234567" className="text-sm">
                  +92 300 1234567
                </a>
              </li>
              <li className="flex items-center gap-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Karachi, Pakistan</span>
              </li>
            </ul>

            {/* Social Links */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold mb-3 text-gray-300">Follow Us</h5>
              <div className="flex gap-2">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      className={`p-2 bg-white/5 rounded-lg hover:bg-white/20 transition-all duration-300 ${social.color}`}
                      aria-label={social.label}
                    >
                      <Icon className="w-5 h-5" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h5 className="text-sm font-semibold mb-2 text-gray-300">We Accept</h5>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map((method, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-white/5 rounded text-xs text-gray-400"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-white/10 mt-16 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>© {new Date().getFullYear()} VidCash.</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> by
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Zayn Ali
                </span>
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <a href="/terms" className="hover:text-white transition">Terms</a>
              <a href="/privacy" className="hover:text-white transition">Privacy</a>
              <a href="/cookies" className="hover:text-white transition">Cookies</a>
              <a href="/accessibility" className="hover:text-white transition">Accessibility</a>
            </div>

            <div className="text-xs text-gray-500">
              v2.0.0 | Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Back to Top Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.1 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition z-50"
      >
        <ChevronRight className="w-5 h-5 transform -rotate-90" />
      </motion.button>
    </footer>
  );
};

const FooterLink = ({ href, children }) => (
  <motion.li
    whileHover={{ x: 5 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <a
      href={href}
      className="text-gray-400 hover:text-white transition flex items-center gap-2 group"
    >
      <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition text-blue-400" />
      <span>{children}</span>
    </a>
  </motion.li>
);

export default Footer;