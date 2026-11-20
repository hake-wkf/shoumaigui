import React, { useState } from 'react';
import { X, Camera, Eye, ShieldCheck, RefreshCw } from 'lucide-react';
import { CAMERA_IMAGE } from '../../data/mockData';

interface SurveillanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  eventId: string;
  openTime: string;
}

export const SurveillanceModal: React.FC<SurveillanceModalProps> = ({
  isOpen,
  onClose,
  orderId,
  eventId,
  openTime,
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'analysis'>('camera');
  const [showAiBoxes, setShowAiBoxes] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 text-white rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-sm">智能柜内部监控快照 (开门记录)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Controls */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('camera')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeTab === 'camera' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              双目俯视机位
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeTab === 'analysis' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              AI图像差分比对
            </button>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={showAiBoxes}
              onChange={(e) => setShowAiBoxes(e.target.checked)}
              className="rounded accent-orange-500 w-3.5 h-3.5"
            />
            <span>显示AI检测框</span>
          </label>
        </div>

        {/* Media Frame */}
        <div className="relative bg-black aspect-4/3 overflow-hidden flex items-center justify-center">
          <img
            src={CAMERA_IMAGE}
            alt="智能柜内部监控画面"
            className="w-full h-full object-cover"
          />

          {/* OSD Telemetry Overlay */}
          <div className="absolute top-2 left-3 font-mono text-[11px] text-emerald-400 bg-black/60 px-2 py-0.5 rounded leading-tight pointer-events-none">
            <div>CAM-01 · 谷家智能856565</div>
            <div>TIME: {openTime}</div>
            <div>STATUS: DOOR_UNLOCKED · REC</div>
          </div>

          {/* Simulated AI bounding boxes */}
          {showAiBoxes && (
            <>
              {/* Picked item bounding box */}
              <div className="absolute top-[38%] left-[28%] w-16 h-20 border-2 border-emerald-400 bg-emerald-400/15 rounded flex flex-col justify-between p-0.5 pointer-events-none animate-pulse">
                <span className="bg-emerald-500 text-black text-[9px] font-bold px-1 rounded-xs w-max">
                  拿取: 银鹭牛奶花生
                </span>
                <span className="text-emerald-300 text-[8px] font-mono self-end">
                  Conf: 99.4%
                </span>
              </div>

              {/* Other detected items */}
              <div className="absolute top-[38%] left-[45%] w-14 h-20 border border-blue-400/70 bg-blue-400/5 rounded p-0.5 pointer-events-none">
                <span className="text-blue-300 text-[8px] font-mono bg-blue-900/80 px-0.5 rounded">
                  Fanta: 4
                </span>
              </div>
              <div className="absolute top-[38%] left-[62%] w-14 h-20 border border-blue-400/70 bg-blue-400/5 rounded p-0.5 pointer-events-none">
                <span className="text-blue-300 text-[8px] font-mono bg-blue-900/80 px-0.5 rounded">
                  Tea: 3
                </span>
              </div>
            </>
          )}

          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded text-[10px] text-slate-300">
            <Eye className="w-3 h-3 text-emerald-400" />
            <span>智能视觉取证链认证已上链</span>
          </div>
        </div>

        {/* Info Footer */}
        <div className="p-4 bg-slate-950 text-xs space-y-2 border-t border-slate-800">
          <div className="flex justify-between text-slate-400">
            <span>关联事件：{eventId}</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 视觉与重力双重校验匹配
            </span>
          </div>
          <div className="text-slate-300 leading-relaxed">
            取证判定：用户在 {openTime} 开门，并在 14:33:24 拿取第三层架左二位「银鹭牛奶花生360g」，重力传感器检测到 -360g 减少量，判定出货成功。
          </div>
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              关闭预览
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
