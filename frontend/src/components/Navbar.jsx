import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Trendly</h1>

        <div className="space-x-6 flex items-center">
          <Link to="/" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 font-medium">Home</Link>
          <Link to="/trends" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 font-medium">Trends</Link>
          
          <Link to="/dev" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 font-medium">Devlopers</Link>
          <Link to="/twitter" className="text-gray-700 dark:text-gray-300 hover:text-blue-500 font-medium">Twitter</Link>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
