import { motion } from 'framer-motion';
import { BarChart3, Menu, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import CallToAction from './DownloadCTA';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // React 19 pattern: Use passive event listener with cleanup
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    // Passive listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Overview', href: '#executive-summary' },
    { label: 'Data', href: '#visualization' },
    { label: 'Analysis', href: '#gender-analysis' },
    { label: 'Solutions', href: '#conclusions' },
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
          ? 'bg-white/70 backdrop-blur-md backdrop-saturate-150 shadow-lg border-b border-white/20'
          : 'bg-transparent'
      }`}
      style={{
        backdropFilter: scrolled ? 'blur(12px) saturate(150%)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px) saturate(150%)' : 'none',
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BarChart3 className={`w-8 h-8 ${scrolled ? 'text-purple-600' : 'text-white'}`} />
            <span className={`text-xl font-bold ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              Behind the Drink
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className={`text-sm font-medium transition-colors hover:text-purple-600 ${
                  scrolled ? 'text-gray-700' : 'text-white hover:text-purple-200'
                }`}
              >
                {item.label}
              </button>
            ))}

            <CallToAction variant="header" />
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              scrolled ? 'text-gray-700 hover:bg-gray-100/50' : 'text-white hover:bg-white/10'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white/85 backdrop-blur-md backdrop-saturate-150 rounded-lg shadow-lg mt-2 py-4 border border-white/20"
            style={{
              backdropFilter: 'blur(12px) saturate(150%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%)',
            }}
          >
            {navItems.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="block w-full text-left px-6 py-3 text-gray-700 hover:bg-gray-50/50 transition-colors"
              >
                {item.label}
              </button>
            ))}
            <div className="px-6 py-3 border-t border-gray-100/50">
              <CallToAction variant="header" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navigation;
