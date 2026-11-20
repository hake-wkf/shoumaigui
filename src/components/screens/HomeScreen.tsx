import React, { useState } from 'react';
import { Star, Headphones, Sparkles, Refrigerator } from 'lucide-react';
import { MiniProgramHeader } from '../common/MiniProgramHeader';
import { MiniProgramTabBar } from '../common/MiniProgramTabBar';
import { BANNER_IMAGE } from '../../data/mockData';
import { ServiceModal } from '../modals/ServiceModal';

interface HomeScreenProps {
  onOpenDoorClick: () => void;
  onNavigateTab?: (tab: 'home' | 'mine') => void;
  cabinetId?: string;
  score?: number;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onOpenDoorClick,
  onNavigateTab,
  cabinetId = '856565',
  score = 2.0,
}) => {
  const [showServiceModal, setShowServiceModal] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50 select-none overflow-hidden font-sans">
      {/* Curved Branded Orange Header Background */}
      <div className="relative bg-[#ff6900] text-white pt-1 pb-12 px-4 rounded-b-[36px] shadow-sm shrink-0">
        <MiniProgramHeader
          dark={true}
          transparent={true}
          time="11:26"
        />

        {/* Brand bar */}
        <div className="flex items-center justify-between px-2 mt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center p-1 border border-white/40">
              <span className="font-bold text-xs tracking-wider">谷</span>
            </div>
            <div>
              <div className="text-base font-bold tracking-tight flex items-center gap-1">
                谷家智能
                <span className="text-[9px] font-normal tracking-wider opacity-80 uppercase">GrainLife</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-medium border border-white/30">
            <Star className="w-3.5 h-3.5 fill-current text-amber-300" />
            <span className="tabular-nums font-semibold">{score.toFixed(1)}</span>
          </div>
        </div>

        {/* Cabinet Serial Tag */}
        <div className="mt-3 px-2 flex items-center gap-1.5 text-xs text-white/95">
          <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
            <Refrigerator className="w-2.5 h-2.5" />
          </div>
          <span className="font-mono tracking-wide font-medium">{cabinetId}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 -mt-7 flex flex-col justify-between pb-5 z-10 overflow-y-auto">
        {/* Banner Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white shadow-md border border-slate-100 p-4 flex items-center justify-between shrink-0">
          <div className="space-y-1.5 z-10 max-w-[55%]">
            <div className="flex items-center gap-1">
              <span className="text-base font-black text-slate-800 tracking-tight">在身边</span>
              <span className="text-base font-black text-[#ff6900] tracking-tight">购方便</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              拿了就走 · 自动扣款
            </p>
            <div className="inline-flex items-center gap-1 text-[10px] text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 text-orange-500" />
              AI视觉感应识货
            </div>
          </div>

          {/* Banner Graphic */}
          <div className="w-[42%] aspect-4/3 relative rounded-xl overflow-hidden shadow-xs">
            <img
              src={BANNER_IMAGE}
              alt="智能售货柜"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Mid Cabinet Status */}
        <div className="my-auto text-center py-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>智能冷柜待命 · 实时温控 4°C 恒冷</span>
          </div>
        </div>

        {/* Floating Customer Service */}
        <div className="flex justify-end pr-1 mb-2">
          <button
            type="button"
            onClick={() => setShowServiceModal(true)}
            className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs text-slate-700 px-3 py-1.5 rounded-full shadow-md border border-slate-200/70 hover:bg-slate-50 active:scale-95 transition-all text-xs font-medium cursor-pointer"
          >
            <Headphones className="w-3.5 h-3.5 text-orange-600" />
            <span>客服</span>
          </button>
        </div>

        {/* Bottom CTA Area */}
        <div className="flex flex-col items-center gap-2.5">
          {/* Glowing Big Orange Button */}
          <button
            type="button"
            onClick={onOpenDoorClick}
            className="group relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#ff6900] via-[#ff771a] to-[#ff944d] text-white flex flex-col items-center justify-center shadow-xl shadow-orange-500/30 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
            aria-label="点击开门"
          >
            {/* Ripple outer glow */}
            <span className="absolute inset-0 rounded-full bg-orange-500/25 animate-ping opacity-60 pointer-events-none" />

            {/* Cabinet door icon */}
            <div className="w-8 h-8 mb-1 rounded border-2 border-white/90 flex items-center justify-end pr-0.5 relative">
              <span className="w-1 h-1 rounded-full bg-white absolute right-1 top-3.5" />
            </div>
            <span className="text-xs font-bold tracking-tight">点击开门</span>
          </button>

          {/* WeChat Pay Score Credit Tag */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
            <svg className="w-4 h-4 text-[#07c160]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 2.22.73 4.27 1.95 5.94L3 22l4.24-.92C8.75 21.64 10.33 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z" />
            </svg>
            <span className="text-[#07c160] font-bold">微信支付分</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 text-[11px]">550分及以上优享</span>
          </div>
        </div>
      </div>

      {/* Mini Program Bottom Tab Bar */}
      <MiniProgramTabBar
        activeTab="home"
        onSelectTab={(tab) => {
          if (onNavigateTab) onNavigateTab(tab);
        }}
      />

      <ServiceModal
        isOpen={showServiceModal}
        onClose={() => setShowServiceModal(false)}
        cabinetId={cabinetId}
      />
    </div>
  );
};
