import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-700 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-gray-100 font-bold text-lg">T</span>
              </div>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-300">TalentHub</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 max-w-md">
              Your gateway to opportunities. Connect talented professionals with amazing companies worldwide.
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2025 TalentHub. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">Browse Jobs</Link></li>
              <li><Link to="/jobs/create" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">Post a Job</Link></li>
              <li><Link to="/about" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};