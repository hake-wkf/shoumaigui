import React from 'react';

interface PhoneFrameProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: string;
  stepNumber?: number;
  highlight?: boolean;
  className?: string;
  onClickTitle?: () => void;
}

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  title,
  subtitle,
  badge,
  stepNumber,
  highlight = false,
  className = '',
  onClickTitle,
}) => {
  return (
    <div className={`flex flex-col items-center shrink-0 ${className}`}>
      {/* Step Title Header if provided */}
      {title && (
        <div
          onClick={onClickTitle}
          className={`mb-3 text-center max-w-[360px] ${onClickTitle ? 'cursor-pointer group' : ''}`}
        >
          <div className="inline-flex items-center gap-1.5 mb-0.5">
            {stepNumber && (
              <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                highlight ? 'bg-[#ff6900] text-white shadow-xs' : 'bg-slate-700 text-slate-200 group-hover:bg-[#ff6900] group-hover:text-white'
              }`}>
                {stepNumber}
              </span>
            )}
            <h3 className={`font-bold text-sm tracking-tight transition-colors ${
              highlight ? 'text-white' : 'text-slate-200 group-hover:text-orange-400'
            }`}>
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/30 px-1.5 py-0.5 rounded font-medium">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-400 leading-tight">{subtitle}</p>
          )}
        </div>
      )}

      {/* Realistic Mobile Device Mockup with standard 375x812 (9:19.5) App Proportions */}
      <div className={`relative w-[360px] sm:w-[375px] h-[780px] sm:h-[812px] rounded-[48px] p-3 bg-slate-950 shadow-2xl transition-all duration-200 border-[3.5px] ${
        highlight
          ? 'border-[#ff6900] shadow-orange-500/15'
          : 'border-slate-800 shadow-black/50'
      }`}>
        {/* Top Speaker / Dynamic Island Pill */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-4 bg-black rounded-full z-40 flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
        </div>

        {/* Screen Bezel & Container */}
        <div className="w-full h-full rounded-[38px] overflow-hidden bg-white relative flex flex-col shadow-inner">
          {children}

          {/* iOS / Android Home Indicator Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-36 h-1 bg-slate-800/25 rounded-full pointer-events-none z-30" />
        </div>
      </div>
    </div>
  );
};
