'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowUp, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin, 
  Heart,
  Shield,
  BookOpen,
  Globe
} from 'lucide-react';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();

  // Handle scroll to top functionality
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show/hide scroll to top button based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Footer Main Content */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-12 pb-6 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Grid - Responsive Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Column 1: Brand & Description */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Priope</h2>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering students with daily financial awareness. 
                Take control of your spending, build savings habits, 
                and make smarter financial decisions in real-time.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Globe className="w-4 h-4" />
                <span>Made with ❤️ in India</span>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Links</h3>
              <ul className="space-y-2">
                {['Dashboard', 'Expenses', 'Budget', 'Analytics', 'Reports'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-gray-400 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Contact & Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Contact & Support</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <a 
                    href="mailto:support@priope.com" 
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    support@priope.com
                  </a>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">+91 XXX-XXX-XXXX</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">India</span>
                </div>
              </div>
            </div>

            {/* Column 4: Social & Legal */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-blue-300">Connect & Legal</h3>
              <div className="flex space-x-4 mb-6">
                {[
                  { icon: Github, href: 'https://github.com/Yash-raj2208/priope', label: 'GitHub' },
                  { icon: Twitter, href: '#', label: 'Twitter' },
                  { icon: Linkedin, href: '#', label: 'LinkedIn' }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 transition-colors duration-200"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Shield className="w-4 h-4" />
                <span>Your data stays on your device</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-6"></div>

          {/* Bottom Bar - Copyright & Links */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright Section */}
            <div className="text-center md:text-left">
              <p className="text-gray-500 text-sm">
                © {currentYear} Priope. All rights reserved.
              </p>
              <p className="text-gray-600 text-xs mt-1">
                Built for students • Privacy-focused • Made in India 🇮🇳
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center space-x-4 text-sm">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Disclaimer'].map((item) => (
                <a 
                  key={item}
                  href="#" 
                  className="text-gray-500 hover:text-blue-400 transition-colors"
                >
                  {item}
                </a>
              ))}
            </div>

            {/* Made in India Badge */}
            <div className="flex items-center space-x-2 bg-gray-800 px-4 py-2 rounded-full">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-orange-500 to-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">🇮🇳</span>
              </div>
              <span className="text-sm font-medium">Made in India</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}
    </>
  );
};

export default Footer;