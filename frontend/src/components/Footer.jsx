import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore.js';

const Footer = () => {
  const { showFooter } = useAuthStore();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    showFooter && <footer className="w-full relative bg-IPCprimary text-white overflow-hidden">

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-IPClight-bg mb-4">
                  IndiPostCollect
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  Your one-stop destination for Indian postal history and collectibles.
                </p>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: Facebook, to: "#", color: "hover:text-blue-400" },
                  { icon: Twitter, to: "#", color: "hover:text-sky-400" },
                  { icon: Instagram, to: "#", color: "hover:text-pink-400" },
                  { icon: Linkedin, to: "#", color: "hover:text-blue-600" }
                ].map(({ icon: Icon, to, color }, index) => (
                  <Link
                    key={index}
                    to={to}
                    className={`p-3 bg-slate-700/50 rounded-full ${color} transition-all duration-300 hover:scale-110 hover:bg-slate-600/50 backdrop-blur-sm`}
                  >
                    <Icon size={20} alt={Icon.displayName} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Learn', 'Community', 'Museum', 'Marketplace', 'Events'].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={`/${link.toLowerCase()}`}
                      className="text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                {['Web Development', 'Mobile Apps', 'UI/UX Design', 'E-commerce', 'Consulting', 'Support'].map((service, index) => (
                  <li key={index}>
                    <Link
                      to="#services"
                      className="text-slate-300 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block"
                    >
                      {service}
                    </Link>
                  </li>
                ))}
              </ul>
            </div> */}

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-white">Get in Touch</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Mail size={16} />
                  </div> 
                  <a
                    href="mailto:codinger@gmail.com"
                    className="text-slate-300 hover:text-white transition-colors duration-300"
                  >
                    codinger@gmail.com
                  </a>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <Phone size={16} />
                  </div>
                  <a
                    href="tel:+18001234567"
                    className="text-slate-300 hover:text-white transition-colors duration-300"
                  >
                    +1 (800) 123-4567
                  </a>
                </div>
                
                <div className="flex items-center space-x-3 group">
                  <div className="p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <MapPin size={16} />
                  </div>
                  <span className="text-slate-300">
                    123 Business St, City, State 12345
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-slate-700/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div>
                <h4 className="text-lg font-semibold text-white mb-2">Stay Updated</h4>
                <p className="text-slate-300">Subscribe to our newsletter for the latest updates</p>
              </div>
              <div className="flex space-x-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 md:w-64 px-4 py-3 border-b-2 rounded-sm focus:border-2 focus:border-IPClight-bg focus:outline-none"
                />
                <button className="px-6 py-3 rounded-sm bg-IPCaccent font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-slate-400 text-sm">
                © 2025 IndiPostCollect. All rights reserved. | 
                <Link to="/privacy" className="hover:text-white transition-colors duration-300 ml-1">Privacy Policy</Link> | 
                <Link to="/terms" className="hover:text-white transition-colors duration-300 ml-1">Terms of Service</Link>
              </div>
              
              {/* Back to Top Button */}
              <button
                onClick={scrollToTop}
                className="group flex items-center space-x-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-full transition-all duration-300 hover:scale-105"
              >
                <span className="text-sm text-slate-300 group-hover:text-white">Back to Top</span>
                <ArrowUp size={16} className="text-slate-300 group-hover:text-white group-hover:-translate-y-1 transition-all duration-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;