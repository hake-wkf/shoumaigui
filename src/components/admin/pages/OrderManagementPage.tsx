import React, { useState } from 'react';
import {
  Receipt,
  Search,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Filter,
  Copy,
  Clock,
  Eye,
} from 'lucide-react';
import { AdminOrder } from '../../../types/admin';

interface OrderManagementPageProps {
  orders: AdminOrder[];
}

export const OrderManagementPage: React.FC<OrderManagementPageProps> = ({ orders }) => {
  const [filterAnomalyOnly, setFilterAnomalyOnly] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const filteredOrders = orders.filter((o) => {
    if (filterAnomalyOnly && !o.isAnomaly) return false;
    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      return (
        o.orderNo.includes(q) ||
        o.deviceCode.includes(q) ||
        o.userPhone.includes(q) ||
        o.storeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">消费者订单与免密支付审计</h2>
          <p className="text-xs text-slate-500">
            客户直连商户支付网关回调凭证、出货识别与异常交易对账（只读只审）
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-lg">
            <input
              type="checkbox"
              checked={filterAnomalyOnly}
              onChange={(e) => setFilterAnomalyOnly(e.target.checked)}
              className="rounded accent-orange-600 w-3.5 h-3.5"
            />
            <span>仅看异常/退款订单</span>
          </label>

          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索订单号 / 设备 / 手机号..."
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden"
            />
          </div>
        </div>

        <div className="text-slate-400 text-xs">
          展示 <strong className="text-slate-800 font-mono">{filteredOrders.length}</strong> 笔订单记录
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">订单编号</th>
                <th className="py-2.5 px-3 font-semibold">设备与门店</th>
                <th className="py-2.5 px-3 font-semibold">选购商品明细</th>
                <th className="py-2.5 px-3 font-semibold text-right">原价</th>
                <th className="py-2.5 px-3 font-semibold text-right">实付金额</th>
                <th className="py-2.5 px-3 font-semibold text-center">支付状态 (只读)</th>
                <th className="py-2.5 px-3 font-semibold text-center">客户Webhook回调</th>
                <th className="py-2.5 px-3 font-semibold">用户手机</th>
                <th className="py-2.5 px-3 font-semibold">下单时间</th>
                <th className="py-2.5 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className={`hover:bg-slate-50 transition-colors cursor-pointer ${
                    ord.isAnomaly ? 'bg-amber-50/20' : ''
                  }`}
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {ord.orderNo}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{ord.deviceName}</div>
                    <div className="font-mono text-slate-400 text-[11px]">{ord.deviceCode} · {ord.storeName}</div>
                  </td>

                  <td className="py-3 px-3">
                    {ord.items.length === 0 ? (
                      <span className="text-slate-400">无购物开门</span>
                    ) : (
                      <div className="space-y-0.5">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="text-slate-800 font-medium truncate max-w-[160px]">
                            {it.productName} <span className="text-slate-400">x{it.qty}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    ¥{ord.originalAmount.toFixed(2)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                    ¥{ord.payAmount.toFixed(2)}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        ord.payStatus === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700'
                          : ord.payStatus === 'REFUNDED'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ord.payStatus === 'SUCCESS' ? '已支付' : ord.payStatus === 'REFUNDED' ? '已退款' : ord.payStatus}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">
                      200 OK (直连)
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-600">{ord.userPhone}</td>

                  <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{ord.createdAt}</td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(ord);
                      }}
                      className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                    >
                      凭证详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  客户直连支付凭证与回调日志 (只读审计)
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">商户交易单号</span>
                <span className="font-mono font-bold text-slate-800">{selectedOrder.orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">直连结算通道</span>
                <span className="text-slate-800">{selectedOrder.payChannel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">网关回调到达时间</span>
                <span className="font-mono text-slate-700">{selectedOrder.callbackTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">实付扣款金额</span>
                <span className="font-mono font-bold text-orange-600 text-sm">
                  ¥{selectedOrder.payAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {selectedOrder.isAnomaly && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                <strong>异常标记记录：</strong> {selectedOrder.anomalyReason}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 bg-slate-900 text-white font-medium rounded-lg cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
