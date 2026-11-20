import React from 'react';
import { X, Headphones, Phone, Clock, MessageSquare } from 'lucide-react';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  cabinetId: string;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ isOpen, onClose, cabinetId }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <Headphones className="w-4 h-4 text-orange-500" />
            <span>谷家智能客服中心</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="bg-orange-50 border border-orange-200/60 rounded-xl p-3.5 space-y-1">
            <div className="text-xs font-semibold text-orange-900">当前设备终端编号</div>
            <div className="font-mono text-base font-bold text-orange-600">{cabinetId}</div>
            <div className="text-[11px] text-orange-700">致电客服时请告知该编号以便快速排查。</div>
          </div>

          <div className="space-y-2 text-xs">
            <a
              href="tel:4008889966"
              className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-orange-400 hover:bg-orange-50/50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="font-semibold text-slate-800">24小时全国客服热线</div>
                  <div className="text-slate-500 text-[11px]">400-888-9966 (按1人工服务)</div>
                </div>
              </div>
              <span className="text-orange-600 font-medium">拨打</span>
            </a>

            <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="font-semibold text-slate-800">在线客服响应时间</div>
                  <div className="text-slate-500 text-[11px]">全天 00:00 - 24:00 极速应答</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};
