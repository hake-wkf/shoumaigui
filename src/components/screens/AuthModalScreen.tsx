import React, { useState } from 'react';
import { X, Info, Star, Refrigerator } from 'lucide-react';
import { MiniProgramHeader } from '../common/MiniProgramHeader';
import { AgreementModal } from '../modals/AgreementModal';
import { BANNER_IMAGE } from '../../data/mockData';

interface AuthModalScreenProps {
  onClose: () => void;
  onConfirmAuth: () => void;
  userScore?: number;
  merchantName?: string;
  cabinetId?: string;
  score?: number;
}

export const AuthModalScreen: React.FC<AuthModalScreenProps> = ({
  onClose,
  onConfirmAuth,
  userScore = 617,
  merchantName = '厦门谷家智能售货机',
  cabinetId = '856565',
  score = 2.0,
}) => {
  const [showAgreement, setShowAgreement] = useState(false);
  const [showServiceTip, setShowServiceTip] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-50 font-sans select-none overflow-hidden">
      {/* Underlying HomeScreen (dimmed in background matching Screenshot 2) */}
      <div className="absolute inset-0 z-0 flex flex-col pointer-events-none">
        <div className="relative bg-[#ff6900] text-white pt-1 pb-14 px-4 rounded-b-[36px]">
          <MiniProgramHeader dark={true} transparent={true} time="11:30" />
          <div className="flex items-center justify-between px-2 mt-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center p-1 border border-white/40">
                <span className="font-bold text-xs">谷</span>
              </div>
              <div className="text-base font-bold tracking-tight">谷家智能</div>
            </div>
          </div>
          <div className="mt-3.5 px-2 flex items-center gap-1.5 text-xs text-white/95">
            <Refrigerator className="w-2.5 h-2.5" />
            <span className="font-mono">{cabinetId}</span>
          </div>
        </div>

        <div className="flex-1 px-4 -mt-8">
          <div className="rounded-2xl bg-white shadow-md p-4 flex items-center justify-between">
            <div className="space-y-1.5 max-w-[55%]">
              <span className="text-base font-black text-slate-800">在身边 购方便</span>
              <p className="text-xs text-slate-500">拿了就走 自动扣款</p>
            </div>
            <div className="w-[42%] aspect-4/3 rounded-xl overflow-hidden">
              <img src={BANNER_IMAGE} alt="售货柜" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Dimmed Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10 transition-opacity" onClick={onClose} />

      {/* Bottom Sheet Drawer matching Screenshot 2 */}
      <div className="relative mt-auto bg-white rounded-t-3xl pt-4 pb-8 px-6 shadow-2xl animate-in slide-in-from-bottom duration-200 z-20">
        {/* Top Close Button */}
        <div className="flex items-center justify-between pb-1">
          <button
            onClick={onClose}
            className="p-1 -ml-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            aria-label="关闭"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-8" />
        </div>

        {/* WeChat Pay Score Shield Badge */}
        <div className="flex flex-col items-center mt-1 mb-5">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Sunburst flower badge */}
            <svg className="w-16 h-16 text-[#07c160]" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 L58 15 L74 6 L75 24 L93 22 L86 39 L100 46 L87 59 L96 73 L79 78 L80 96 L63 92 L55 106 L43 95 L31 103 L27 86 L11 89 L16 72 L0 66 L11 52 L3 37 L20 34 L18 16 L35 21 Z" opacity="0.15" />
              <path d="M50 8 L57 20 L71 13 L71 28 L86 26 L80 40 L93 47 L81 57 L89 70 L74 73 L74 88 L60 84 L53 96 L43 87 L33 93 L30 79 L16 81 L21 67 L7 62 L17 50 L10 38 L25 35 L24 20 L38 24 Z" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#07c160]">
              <span className="font-extrabold text-base tracking-tighter tabular-nums leading-none">
                {userScore}
              </span>
              <span className="text-[8px] font-bold uppercase tracking-wider mt-0.5">分</span>
            </div>
          </div>

          <h3 className="mt-3 text-base font-bold text-slate-900 text-center leading-snug">
            你的微信支付分已达标
            <br />
            可享先选购后付款
          </h3>
        </div>

        {/* Service Details Card */}
        <div className="space-y-3 py-3.5 border-t border-b border-slate-100 text-xs">
          <div className="flex items-start">
            <span className="w-20 text-slate-400 shrink-0">服务商家</span>
            <span className="text-slate-800 font-medium">{merchantName}</span>
          </div>

          <div className="flex items-start">
            <span className="w-20 text-slate-400 shrink-0">服务说明</span>
            <div className="flex-1 text-slate-700 leading-relaxed">
              <span>无人货柜/门店自助选购，选购完成后自动支付实际购买的商品费用。</span>
              <button
                type="button"
                onClick={() => setShowServiceTip(!showServiceTip)}
                className="inline-flex items-center ml-1 text-slate-400 hover:text-slate-600 align-middle"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
              {showServiceTip && (
                <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
                  取货期间关闭柜门后，智能传感器与图像比对算法将耗时约1-3秒计算差额并扣款。
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Agreement Agreement Note */}
        <div className="mt-4 mb-4 text-[11px] text-slate-400 text-center leading-normal">
          请仔细阅读
          <button
            onClick={() => setShowAgreement(true)}
            className="text-slate-600 underline font-medium hover:text-slate-900 mx-0.5 cursor-pointer"
          >
            《扣款授权确认书》
          </button>
          ，同意协议请点击按钮。
        </div>

        {/* Green Confirm Button */}
        <button
          onClick={onConfirmAuth}
          className="w-full py-3 bg-[#07c160] hover:bg-[#06ad56] active:scale-[0.99] text-white rounded-xl text-sm font-semibold tracking-wide shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
        >
          确定
        </button>
      </div>

      <AgreementModal
        isOpen={showAgreement}
        onClose={() => setShowAgreement(false)}
      />
    </div>
  );
};
