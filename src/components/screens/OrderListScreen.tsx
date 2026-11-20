import React from 'react';
import { ChevronRight, FileText } from 'lucide-react';
import { MiniProgramHeader } from '../common/MiniProgramHeader';
import { Order } from '../../types/vending';

interface OrderListScreenProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  onBack?: () => void;
}

export const OrderListScreen: React.FC<OrderListScreenProps> = ({
  orders,
  onSelectOrder,
  onBack,
}) => {
  // 订单只有支付成功的订单
  const paidOrders = orders.filter(
    (order) => order.status === '已支付' && order.totalAmount > 0 && order.items.length > 0
  );

  return (
    <div className="relative w-full h-full flex flex-col bg-[#f5f6f8] font-sans select-none overflow-hidden text-slate-800">
      {/* Top Phone Status Bar & Mini-Program Header */}
      <MiniProgramHeader
        dark={false}
        time="11:27"
        transparent={false}
        title="我的订单"
        showBack={Boolean(onBack)}
        onBack={onBack}
      />

      {/* Paid Orders List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3 pb-8">
        {paidOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center text-slate-400 text-xs space-y-2 mt-4">
            <FileText className="w-8 h-8 mx-auto text-slate-300" />
            <p>暂无支付成功的订单记录</p>
          </div>
        ) : (
          paidOrders.map((order) => {
            const firstItem = order.items[0];
            return (
              <button
                key={order.id}
                type="button"
                onClick={() => onSelectOrder(order)}
                className="w-full text-left bg-white rounded-2xl shadow-xs border border-slate-100 p-3.5 hover:shadow-md transition-shadow cursor-pointer space-y-3"
              >
                {/* Top row: 订单编号 + 已支付 */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-100">
                  <span className="font-mono text-[11px] text-slate-500">
                    订单号 {order.id}
                  </span>
                  <span className="text-[#07c160] font-semibold">已支付</span>
                </div>

                {/* Product row: 图片 + 名称 + 商品价格 */}
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-slate-900 truncate">
                            {item.name}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              x{item.quantity}
                            </div>
                          )}
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

                {/* Bottom row: 创建时间 + 查看详情 */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span className="font-mono">{order.createdAt}</span>
                  <span className="flex items-center gap-0.5 text-slate-500 font-medium">
                    订单详情 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
