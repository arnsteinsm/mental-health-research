import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, BarChart3, Clock, Award } from 'lucide-react';
import DownloadCTA from './DownloadCTA';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Track active section for progress indicator
      const sections = ['executive-summary', 'visualization', 'correlation', 'gender-analysis', 'conclusions'];
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Crisis', href: '#executive-summary', time: '2 min' },
    { label: 'Data', href: '#visualization', time: '3 min' },
    { label: 'Analysis', href: '#gender-analysis', time: '4 min' },
    { label: 'Solutions', href: '#conclusions', time: '3 min' },
    { label: 'Sources', href: '#bibliography', time: '1 min' }
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Judge Appeal */}
          <div className="flex items-center space-x-3">
            <BarChart3 className={`w-8 h-8 ${scrolled ? 'text-purple-600' : 'text-white'}`} />
            <div>
              <span className={`text-xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                Behind the Drink
              </span>
              <div className={`text-xs ${scrolled ? 'text-gray-600' : 'text-purple-200'} flex items-center`}>
                <Award className="w-3 h-3 mr-1" />
                Data Visualization Competition Entry
              </div>
            </div>
          </div>

          {/* Desktop Navigation with Time Estimates */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map((item, index) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className={`group relative text-sm font-medium transition-colors hover:text-purple-600 ${
                  scrolled ? 'text-gray-700' : 'text-white hover:text-purple-200'
                } ${activeSection === item.href.slice(1) ? 'text-purple-600' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <span>{item.label}</span>
                  <div className={`text-xs opacity-60 flex items-center ${scrolled ? 'text-gray-500' : 'text-purple-200'}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    {item.time}
                  </div>
                </div>
                {activeSection === item.href.slice(1) && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-purple-600"
                  />
                )}
              </button>
            ))}
            
            {/* Total Time Indicator */}
            <div className={`text-xs ${scrolled ? 'text-gray-600' : 'text-purple-200'} border-l pl-4 ml-4`}>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                ~13 min read
              </div>
            </div>
            
            {/* Download CTA in Header */}
            <DownloadCTA variant="header" />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled 
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Progress Bar */}
        {scrolled && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-blue-600 origin-left"
            style={{
              scaleX: Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1)
            }}
          />
        )}

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white rounded-lg shadow-lg mt-2 py-4"
          >
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-500">{item.time}</span>
                </div>
              </button>
            ))}
            <div className="px-6 py-3 border-t border-gray-100">
              <DownloadCTA variant="header" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;