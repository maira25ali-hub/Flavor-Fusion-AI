import React from 'react';
import { ChefHat, Heart, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react';
import { ActivePage } from '../types';

interface FooterProps {
  setActivePage: (page: ActivePage) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  return (
    <footer className="bg-[#2C2C2C] text-stone-300 pt-16 pb-12 mt-20 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF8A3D] to-[#FF9F43] flex items-center justify-center text-white shadow-md">
                <ChefHat className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                Flavor Fusion <span className="text-[#FF8A3D]">AI</span>
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Transforming available ingredients into gourmet personalized recipes within seconds using advanced artificial intelligence.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium bg-amber-950/40 border border-amber-800/40 px-3 py-1.5 rounded-xl w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Gemini 3.6 Flash</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-semibold text-base">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => setActivePage('home')} className="hover:text-white transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('generator')} className="hover:text-white transition-colors">
                  AI Recipe Generator
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('saved')} className="hover:text-white transition-colors">
                  My Saved Recipes
                </button>
              </li>
              <li>
                <button onClick={() => setActivePage('settings')} className="hover:text-white transition-colors">
                  Preferences & Settings
                </button>
              </li>
            </ul>
          </div>

          {/* Cuisines Supported */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-semibold text-base">Supported Cuisines</h4>
            <div className="flex flex-wrap gap-1.5 text-xs text-stone-400">
              {['Pakistani', 'Indian', 'Italian', 'Chinese', 'American', 'Mexican', 'Fast Food', 'Desserts'].map(c => (
                <button
                  key={c}
                  onClick={() => setActivePage('generator')}
                  className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 hover:text-white transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Future Innovations */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-semibold text-base">Roadmap & Capabilities</h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Food Wastage AI Engine</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Sub-Second Macro Calculations</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400 shrink-0" />
                <span>PDF & TXT Offline Exports</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} Flavor Fusion AI. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for food lovers and home chefs everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
};
