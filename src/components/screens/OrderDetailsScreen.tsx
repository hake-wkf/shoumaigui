import React, { useState } from 'react';
import { MiniProgramHeader } from '../common/MiniProgramHeader';
import { Order } from '../../types/vending';

interface OrderDetailsScreenProps {
  order: Order;
  onBack: () => void;
}

export const OrderDetailsScreen: React.FC<OrderDetailsScreenProps> = ({
  order,
  onBack,
}) => {
  const [copyToast, setCopyToast] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopyToast('已复制订单编号');
    setTimeout(() => setCopyToast(null), 1500);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-[#f5f6f8] font-sans select-none overflow-hidden text-slate-800">
      {/* Top Phone Status & Mini-Program Header */}
      <MiniProgramHeader
        dark={false}
        time="11:28"
        transparent={false}
        title="订单详情"
        showBack={true}
        onBack={onBack}
      />

      {/* Main Scrollable Body */}
      <div className="flex-1 overflow-y-auto pb-8">
        {/* Top Status Banner */}
        <div className="bg-[#07c160] text-white px-5 py-4 flex items-center justify-between shadow-xs">
          <div className="text-lg font-bold tracking-tight">
            支付成功
          </div>
          <div className="text-xs opacity-90">
            已完成扣款
          </div>
        </div>

        {/* 商品信息卡片：仅图片、名称、商品价格 */}
        <div className="bg-white m-3 rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
          <div className="text-xs font-bold text-slate-800">商品信息</div>

          <div className="divide-y divide-slate-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-2.5 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 object-contain rounded-xl bg-slate-50 border border-slate-100 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 leading-snug">
                      {item.name}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-slate-900 tabular-nums">
                    ¥{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 订单核心信息：仅订单编号、订单创建时间、订单开门时间 */}
        <div className="bg-white mx-3 rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3.5 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="text-slate-500 shrink-0">订单编号</span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-slate-800 truncate">{order.id}</span>
              <button
                type="button"
                onClick={() => handleCopy(order.id)}
                className="px-2 py-0.5 border border-slate-200 rounded text-[11px] text-slate-600 hover:bg-slate-50 active:scale-95 transition-all shrink-0 cursor-pointer"
              >
                复制
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">订单创建时间</span>
            <span className="font-mono text-slate-800">{order.createdAt}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">订单开门时间</span>
            <span className="font-mono text-slate-800">{order.openTime}</span>
          </div>
        </div>
      </div>

      {/* Copy notification toast */}
      {copyToast && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1.5 rounded-full shadow-lg z-50 animate-in fade-in">
          {copyToast}
        </div>
      )}
    </div>
  );
};
