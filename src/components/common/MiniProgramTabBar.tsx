import React from 'react';
import { Home, User } from 'lucide-react';

interface MiniProgramTabBarProps {
  activeTab: 'home' | 'mine';
  onSelectTab: (tab: 'home' | 'mine') => void;
}

export const MiniProgramTabBar: React.FC<MiniProgramTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-200 grid grid-cols-2 items-center pt-2 pb-4 px-2 shrink-0 z-20 select-none">
      <button
        type="button"
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer ${
          activeTab === 'home' ? 'text-[#ff6900]' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
        <span className={`text-[11px] leading-tight ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
          首页
        </span>
      </button>

      <button
        type="button"
        onClick={() => onSelectTab('mine')}
        className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-colors cursor-pointer ${
          activeTab === 'mine' ? 'text-[#ff6900]' : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <User className={`w-5 h-5 ${activeTab === 'mine' ? 'stroke-[2.2]' : 'stroke-[1.8]'}`} />
        <span className={`text-[11px] leading-tight ${activeTab === 'mine' ? 'font-bold' : 'font-medium'}`}>
          我的
        </span>
      </button>
    </div>
  );
};
