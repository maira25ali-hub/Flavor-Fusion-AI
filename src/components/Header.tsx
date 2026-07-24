import React, { useState } from 'react';
import { ChefHat, Sparkles, Bookmark, Settings, Home, Menu, X, Sun, Moon } from 'lucide-react';
import { ActivePage, UserSettings } from '../types';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  savedCount: number;
  userSettings: UserSettings;
  setUserSettings: React.Dispatch<React.SetStateAction<UserSettings>>;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  savedCount,
  userSettings,
  setUserSettings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    const nextTheme = userSettings.theme === 'light' ? 'dark' : 'light';
    setUserSettings(prev => ({ ...prev, theme: nextTheme }));
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'generator', label: 'AI Generator', icon: Sparkles, badge: 'Smart' },
    { id: 'saved', label: 'Saved Recipes', icon: Bookmark, count: savedCount },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF8F2]/90 dark:bg-stone-900/90 backdrop-blur-md border-b border-[#F1E6DA] dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <button
            onClick={() => {
              setActivePage('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-3 group text-left focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#FF9F43] flex items-center justify-center text-white shadow-lg shadow-[#FF8A3D]/25 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6 animate-pulse" />
              <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-amber-200" />
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2C2C2C] dark:text-stone-100 flex items-center gap-1.5">
                Flavor Fusion <span className="text-[#FF8A3D]">AI</span>
              </span>
              <p className="text-[10px] tracking-wider uppercase font-medium text-stone-500 dark:text-stone-400">
                Smart AI Kitchen Assistant
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 dark:bg-stone-800/80 p-1.5 rounded-2xl border border-stone-200/50 dark:border-stone-700/50">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id as ActivePage)}
                  id={`nav-link-${item.id}`}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white dark:bg-stone-900 text-[#FF8A3D] shadow-sm font-semibold'
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FF8A3D]' : 'text-stone-500 dark:text-stone-400'}`} />
                  <span>{item.label}</span>
                  
                  {item.badge && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-950 text-[#FF8A3D]">
                      {item.badge}
                    </span>
                  )}

                  {item.count !== undefined && item.count > 0 && (
                    <span className="ml-1 px-2 py-0.5 text-[11px] font-bold rounded-full bg-[#FF8A3D] text-white">
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              id="theme-toggle-btn"
              className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700 transition-colors"
              title="Toggle Dark / Light Theme"
            >
              {userSettings.theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActivePage('generator')}
              id="header-create-recipe-cta"
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white text-sm font-semibold shadow-lg shadow-[#FF8A3D]/25 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Recipe</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300"
            >
              {userSettings.theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#F1E6DA] dark:border-stone-800 bg-[#FFF8F2] dark:bg-stone-900 px-4 pt-3 pb-6 space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActivePage(item.id as ActivePage);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-[#FF8A3D]/10 text-[#FF8A3D] font-semibold'
                    : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-[#FF8A3D] text-white">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => {
              setActivePage('generator');
              setMobileMenuOpen(false);
            }}
            className="w-full mt-3 flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#FF8A3D] to-[#F97316] text-white font-semibold shadow-md"
          >
            <Sparkles className="w-5 h-5" />
            <span>Generate Recipe Now</span>
          </button>
        </div>
      )}
    </header>
  );
};
