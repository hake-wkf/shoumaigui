import React from 'react';
import { Wifi, BatteryMedium, Signal, MoreHorizontal, Disc } from 'lucide-react';

interface MiniProgramHeaderProps {
  title?: string;
  dark?: boolean;
  onBack?: () => void;
  showBack?: boolean;
  time?: string;
  transparent?: boolean;
  customRight?: React.ReactNode;
}

export const MiniProgramHeader: React.FC<MiniProgramHeaderProps> = ({
  title,
  dark = false,
  onBack,
  showBack = false,
  time = '11:26',
  transparent = false,
  customRight,
}) => {
  return (
    <div className={`w-full select-none ${transparent ? 'bg-transparent' : dark ? 'bg-[#ff6900] text-white' : 'bg-white text-slate-800'}`}>
      {/* Phone Status Bar */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1 text-xs tracking-tight">
        <span className="font-semibold">{time}</span>
        <div className="flex items-center gap-1.5 opacity-90">
          <Signal className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">5G</span>
          <span className="text-[10px] border border-current px-0.5 rounded leading-none text-[8px]">HD</span>
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-0.5">
            <BatteryMedium className="w-4 h-4" />
            <span className="text-[10px]">65</span>
          </div>
        </div>
      </div>

      {/* Mini-Program Navigation Bar */}
      <div className="flex items-center justify-between px-4 h-11 relative">
        <div className="flex items-center min-w-[70px]">
          {showBack && (
            <button
              onClick={onBack}
              className="p-1 -ml-1 text-lg font-bold flex items-center justify-center hover:opacity-80 transition-opacity active:scale-95"
              aria-label="Back"
            >
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Title */}
        <div className="text-center font-medium text-[15px] truncate max-w-[190px]">
          {title}
        </div>

        {/* Capsule Pill (WeChat Style) */}
        <div className="flex items-center">
          {customRight ? (
            customRight
          ) : (
            <div className={`flex items-center justify-between px-2.5 py-1 rounded-full border text-xs gap-2 ${
              dark
                ? 'border-white/30 bg-black/15 text-white'
                : 'border-slate-200 bg-white/70 text-slate-700 shadow-xs'
            }`}>
              <button title="小程序更多选项" className="hover:opacity-80 transition-opacity">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
              <span className={`w-[1px] h-3 ${dark ? 'bg-white/30' : 'bg-slate-300'}`} />
              <button title="退出小程序" className="hover:opacity-80 transition-opacity">
                <Disc className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
