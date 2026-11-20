import React from 'react';
import { X, Image as ImageIcon, Calendar, Tag } from 'lucide-react';
import { OrderItem } from '../../types/vending';

interface SnapshotModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
  orderId: string;
  createTime: string;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  isOpen,
  onClose,
  items,
  orderId,
  createTime,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <ImageIcon className="w-4 h-4 text-orange-500" />
            <span>商品快照留存 (下单瞬间状态)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
            💡 快照记录了用户取货扣款时柜内该商品的标价、规格与版本信息，不受后续运营价格调整影响。
          </div>

          <div className="text-xs text-slate-500 flex items-center justify-between">
            <span>订单号: {orderId}</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {createTime}
            </span>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {items.map((item, idx) => (
              <div key={idx} className="p-3.5 flex items-center gap-3 bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-14 h-14 object-contain rounded-lg border border-slate-100 bg-slate-50 p-1"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.spec}</span>
                    <span>数量: x{item.quantity}</span>
                  </div>
                  <div className="mt-1 font-semibold text-xs text-orange-600">
                    快照单价: ¥{item.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition-colors"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
};
