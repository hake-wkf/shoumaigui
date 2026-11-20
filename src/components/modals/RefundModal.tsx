import React, { useState } from 'react';
import { X, AlertTriangle, CheckCircle2, RotateCcw } from 'lucide-react';
import { Order } from '../../types/vending';

interface RefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  mode: 'direct' | 'modify';
  onConfirmRefund: (orderId: string, refundAmount: number, reason: string, updatedQty?: number) => void;
}

export const RefundModal: React.FC<RefundModalProps> = ({
  isOpen,
  onClose,
  order,
  mode,
  onConfirmRefund,
}) => {
  const [selectedReason, setSelectedReason] = useState('商品拿错/未拿却被扣款');
  const [refundAmount, setRefundAmount] = useState<number>(order.totalAmount);
  const [targetQuantity, setTargetQuantity] = useState<number>(0);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const reasons = [
    '商品拿错/未拿却被扣款',
    '商品包装破损/过期变质',
    'AI视觉识别数量有误',
    '柜门未正常打开但扣款',
    '其他原因 (已与用户沟通)',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmRefund(order.id, refundAmount, selectedReason, targetQuantity);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <RotateCcw className="w-4 h-4 text-orange-600" />
            <span>{mode === 'direct' ? '办理直接全额退款' : '修正订单并处理退款'}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-semibold text-slate-800 text-base">退款已成功提交</h3>
            <p className="text-xs text-slate-500">
              退款金额 ¥{refundAmount.toFixed(2)} 将通过微信原路退回用户账户。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 border border-slate-100">
              <div className="flex justify-between text-slate-500">
                <span>订单编号:</span>
                <span className="font-mono text-slate-700">{order.id}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>订单原始金额:</span>
                <span className="font-semibold text-slate-800">¥{order.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>付款用户:</span>
                <span className="text-slate-700">{order.userPhone} (ID: {order.userId})</span>
              </div>
            </div>

            {mode === 'modify' ? (
              <div className="space-y-3">
                <label className="block text-xs font-medium text-slate-700">
                  修正实际拿取件数：
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.max(0, targetQuantity - 1);
                      setTargetQuantity(next);
                      const unitPrice = order.items[0]?.price || 4.0;
                      const newAmount = order.totalAmount - (next * unitPrice);
                      setRefundAmount(Math.max(0, newAmount));
                    }}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="font-semibold text-sm w-12 text-center">{targetQuantity} 件</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = targetQuantity + 1;
                      setTargetQuantity(next);
                      const unitPrice = order.items[0]?.price || 4.0;
                      const newAmount = order.totalAmount - (next * unitPrice);
                      setRefundAmount(Math.max(0, newAmount));
                    }}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
                <div className="text-[11px] text-slate-500">
                  系统将依据修正后的商品实际件数自动重新回滚库存。
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                退款金额 (元)：
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-sm font-semibold text-slate-500">¥</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={order.totalAmount}
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 font-semibold text-slate-800"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                退款原因：
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:border-orange-500 text-slate-700 bg-white"
              >
                {reasons.map((r, i) => (
                  <option key={i} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div className="flex items-start gap-2 bg-amber-50 p-2.5 rounded-lg border border-amber-200/50 text-[11px] text-amber-800">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                退款将即时生效并同步释放库存，同时会给用户发送微信支付退款凭证通知。
              </span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm transition-colors"
              >
                确认处理
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
