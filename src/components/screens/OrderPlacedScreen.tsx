import React from 'react';
import { Check, Star, Refrigerator } from 'lucide-react';
import { MiniProgramHeader } from '../common/MiniProgramHeader';
import { BANNER_IMAGE } from '../../data/mockData';

interface OrderPlacedScreenProps {
  onViewOrderList?: () => void;
  onViewOrderDetails?: () => void;
  cabinetId?: string;
  score?: number;
}

export const OrderPlacedScreen: React.FC<OrderPlacedScreenProps> = ({
  onViewOrderList,
  onViewOrderDetails,
  cabinetId = '856565',
  score = 2.0,
}) => {
  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50 select-none overflow-hidden font-sans">
      {/* Curved Branded Orange Header Background (Matching Screen 3) */}
      <div className="relative bg-[#ff6900] text-white pt-1 pb-14 px-4 rounded-b-[36px] shadow-sm">
        <MiniProgramHeader
          dark={true}
          transparent={true}
          time="11:31"
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
        <div className="mt-3.5 px-2 flex items-center gap-1.5 text-xs text-white/95">
          <div className="w-4 h-4 rounded bg-white/20 flex items-center justify-center">
            <Refrigerator className="w-2.5 h-2.5" />
          </div>
          <span className="font-mono tracking-wide font-medium">{cabinetId}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-4 -mt-8 flex flex-col justify-between pb-12 z-10">
        {/* Banner Card in background */}
        <div className="relative overflow-hidden rounded-2xl bg-white/90 shadow-md border border-slate-100 p-4 flex items-center justify-between opacity-80">
          <div className="space-y-1.5 z-10 max-w-[55%]">
            <div className="flex items-center gap-1">
              <span className="text-base font-black text-slate-800 tracking-tight">在身边</span>
              <span className="text-base font-black text-[#ff6900] tracking-tight">购方便</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              拿了就走 自动扣款
            </p>
          </div>

          {/* Banner Graphic */}
          <div className="w-[42%] aspect-4/3 relative rounded-xl overflow-hidden shadow-xs">
            <img
              src={BANNER_IMAGE}
              alt="智能售货柜"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Screen 3 Bottom Center Area: Big Green Checkmark + 已下单 + 先选购后付款 (Exact match to 3rd reference screenshot) */}
        <div className="my-auto flex flex-col items-center justify-center pt-8 pb-4">
          {/* Solid Green Checkmark Circle */}
          <div className="w-16 h-16 rounded-full bg-[#07c160] flex items-center justify-center text-white shadow-lg shadow-emerald-500/25 mb-4 animate-in zoom-in-75 duration-300">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>

          <h2 className="text-xl font-bold text-slate-900 tracking-tight">已下单</h2>
          <p className="text-sm text-slate-600 font-medium mt-1.5">先选购后付款</p>

          {/* Interactive Navigation Shortcuts for Demo Flow */}
          <div className="mt-8 flex flex-col items-center gap-2">
            {onViewOrderDetails && (
              <button
                onClick={onViewOrderDetails}
                className="px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 active:scale-95 transition-all shadow-sm"
              >
                关门自动结算 · 查看订单详情 →
              </button>
            )}
            {onViewOrderList && (
              <button
                onClick={onViewOrderList}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors py-1"
              >
                查看销售订单列表
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
