import React, { useState } from 'react';
import {
  QrCode,
  Scan,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Package,
  Plus,
  Minus,
  AlertOctagon,
  X,
  Sparkles,
  Camera,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { RestockOrder, RestockItem } from '../../../types/admin';
import { MiniProgramHeader } from '../../common/MiniProgramHeader';

interface MobileRestockAppProps {
  orders: RestockOrder[];
  onFinishOrder: (updatedOrder: RestockOrder) => void;
  onExit: () => void;
}

export const MobileRestockApp: React.FC<MobileRestockAppProps> = ({
  orders,
  onFinishOrder,
  onExit,
}) => {
  // Select active restock order
  const [selectedOrder, setSelectedOrder] = useState<RestockOrder>(
    orders.find((o) => o.status === 'pending_restock' || o.status === 'in_progress') || orders[0]
  );

  // Steps: 'select_device' | 'slot_list' | 'refill_item' | 'complete_summary'
  const [step, setStep] = useState<'select_device' | 'slot_list' | 'refill_item' | 'complete_summary'>('slot_list');

  // Currently replenishing item index
  const [currentItemIdx, setCurrentItemIdx] = useState(0);

  // Local state for items
  const [items, setItems] = useState<RestockItem[]>(selectedOrder.items);

  // Anomaly modal state
  const [showAnomalyModal, setShowAnomalyModal] = useState(false);
  const [anomalyType, setAnomalyType] = useState<'少补' | '错补' | '货道故障' | '商品破损'>('少补');
  const [anomalyNote, setAnomalyNote] = useState('');

  // Scanning animation simulator
  const [isScanning, setIsScanning] = useState(false);

  const currentItem = items[currentItemIdx];

  const handleUpdateItemQty = (delta: number) => {
    if (!currentItem) return;
    const newQty = Math.max(0, currentItem.actualQty + delta);
    const updated = [...items];
    updated[currentItemIdx] = {
      ...currentItem,
      actualQty: newQty,
      diffQty: newQty - currentItem.suggestedQty,
    };
    setItems(updated);
  };

  const handleSimulateScanBarcode = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      // Auto-fill actualQty to suggestedQty on successful scan!
      if (currentItem) {
        const updated = [...items];
        updated[currentItemIdx] = {
          ...currentItem,
          actualQty: currentItem.suggestedQty,
          diffQty: 0,
        };
        setItems(updated);
      }
    }, 800);
  };

  const handleSaveAnomaly = () => {
    if (!currentItem) return;
    const updated = [...items];
    updated[currentItemIdx] = {
      ...currentItem,
      status: 'exception',
      exceptionReason: anomalyType,
      note: anomalyNote || `${anomalyType}登记`,
    };
    setItems(updated);
    setShowAnomalyModal(false);
    setAnomalyNote('');
  };

  const handleNextSlot = () => {
    if (!currentItem) return;
    const updated = [...items];
    if (updated[currentItemIdx].status !== 'exception') {
      updated[currentItemIdx].status = 'completed';
    }
    setItems(updated);

    if (currentItemIdx < items.length - 1) {
      setCurrentItemIdx(currentItemIdx + 1);
    } else {
      setStep('complete_summary');
    }
  };

  const handleFinalSubmit = () => {
    const hasAnyException = items.some((i) => i.status === 'exception' || i.diffQty !== 0);
    const actualSum = items.reduce((sum, i) => sum + i.actualQty, 0);

    const finishedOrder: RestockOrder = {
      ...selectedOrder,
      items: items,
      actualTotalQty: actualSum,
      status: hasAnyException ? 'anomaly' : 'completed',
      hasException: hasAnyException,
      exceptionSummary: hasAnyException
        ? items
            .filter((i) => i.status === 'exception')
            .map((i) => `货道 ${i.slotNumber} [${i.exceptionReason}: ${i.note || ''}]`)
            .join('; ')
        : undefined,
      completedAt: new Date().toLocaleString('zh-CN'),
    };

    onFinishOrder(finishedOrder);
    setStep('complete_summary');
  };

  const completedCount = items.filter((i) => i.status === 'completed' || i.status === 'exception').length;

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-100 font-sans select-none overflow-hidden text-slate-800">
      {/* Top Phone Status & Header */}
      <MiniProgramHeader
        dark={false}
        time="14:35"
        title="谷家移动补货助手"
        showBack={true}
        onBack={() => {
          if (step === 'refill_item') setStep('slot_list');
          else if (step === 'slot_list') onExit();
          else onExit();
        }}
        customRight={
          <button
            onClick={onExit}
            className="text-xs text-orange-600 font-bold px-2 py-1"
          >
            退出
          </button>
        }
      />

      {/* Screen 1: Slot Checklist Overview */}
      {step === 'slot_list' && (
        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Top Device Banner */}
          <div className="bg-slate-900 text-white p-4 shrink-0 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <span className="bg-orange-600 text-white font-bold px-2 py-0.5 rounded text-[10px]">
                当前设备
              </span>
              <span className="font-mono text-slate-300 font-semibold">{selectedOrder.orderNo}</span>
            </div>
            <h3 className="font-bold text-base mt-1 tracking-tight">{selectedOrder.deviceName}</h3>
            <p className="text-xs text-slate-400 mt-0.5">终端编号：{selectedOrder.deviceCode} · {selectedOrder.storeName}</p>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">待完成货道：</span>
              <span className="font-mono font-bold text-orange-400">
                {completedCount} / {items.length} 货道
              </span>
            </div>
          </div>

          {/* Slot List Feed */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {items.map((it, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentItemIdx(idx);
                  setStep('refill_item');
                }}
                className={`bg-white rounded-xl p-3 border shadow-xs flex items-center justify-between transition-all cursor-pointer ${
                  it.status === 'completed'
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : it.status === 'exception'
                    ? 'border-rose-300 bg-rose-50/20'
                    : 'border-slate-200 hover:border-orange-400'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {it.slotNumber}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{it.productName}</h4>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      在柜 {it.currentStock} · 应补 +<strong className="text-orange-600 font-mono">{it.suggestedQty}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  {it.status === 'completed' ? (
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 已核验 {it.actualQty}
                    </span>
                  ) : it.status === 'exception' ? (
                    <span className="text-[11px] text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-full">
                      {it.exceptionReason}
                    </span>
                  ) : (
                    <span className="text-xs text-orange-600 font-semibold flex items-center gap-0.5">
                      去补货 <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 space-y-2">
            <button
              onClick={() => {
                // Find first uncompleted or 0
                const nextUndone = items.findIndex((i) => i.status === 'pending');
                setCurrentItemIdx(nextUndone !== -1 ? nextUndone : 0);
                setStep('refill_item');
              }}
              className="w-full py-3.5 bg-[#ff6900] hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform cursor-pointer"
            >
              <Scan className="w-4 h-4" />
              <span>开始逐货道扫码补货</span>
            </button>
          </div>
        </div>
      )}

      {/* Screen 2: Step-by-Step Refill Individual Slot */}
      {step === 'refill_item' && currentItem && (
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          {/* Top Progress bar */}
          <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between text-xs shrink-0">
            <span className="text-slate-300">
              第 <strong className="text-orange-400 font-mono">{currentItemIdx + 1}</strong> / {items.length} 个货道
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnomalyModal(true)}
                className="text-[11px] text-rose-400 border border-rose-500/40 bg-rose-500/10 px-2.5 py-1 rounded-md font-medium"
              >
                异常登记 (少补/破损)
              </button>
            </div>
          </div>

          {/* Slot Card Information */}
          <div className="p-4 space-y-4 flex-1">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 text-center space-y-3">
              <div className="inline-block bg-slate-900 text-white font-mono text-base font-bold px-3 py-1 rounded-xl">
                货道编号：{currentItem.slotNumber}
              </div>

              <div className="w-24 h-24 mx-auto rounded-xl bg-slate-50 border border-slate-200 p-2 overflow-hidden flex items-center justify-center">
                <img
                  src={currentItem.productImage}
                  alt={currentItem.productName}
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <h3 className="font-bold text-base text-slate-900">{currentItem.productName}</h3>
                <p className="text-xs text-slate-500 mt-1">
                  货道最大容量 {currentItem.capacity} 件 · 当前在柜剩余 {currentItem.currentStock} 件
                </p>
              </div>

              {/* Target replenishment prompt */}
              <div className="p-3 bg-orange-50 border border-orange-200/80 rounded-xl flex items-center justify-between text-xs">
                <span className="text-orange-800 font-medium">系统建议应补入数量：</span>
                <span className="font-mono text-xl font-black text-orange-600">
                  +{currentItem.suggestedQty} 件
                </span>
              </div>
            </div>

            {/* Barcode Scan Verification Simulator */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Scan className="w-4 h-4 text-orange-600" />
                  扫码校验商品条码
                </span>
                <span className="text-[11px] text-slate-400">防止错补串货</span>
              </div>

              <button
                type="button"
                onClick={handleSimulateScanBarcode}
                className="w-full py-3 bg-slate-50 border-2 border-dashed border-slate-300 hover:border-orange-500 rounded-xl flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
              >
                <Camera className="w-4 h-4 text-slate-500" />
                <span>{isScanning ? '正在识别条形码...' : '点击模拟摄像头扫码'}</span>
              </button>

              {/* Quantity Modifier */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-xs font-medium text-slate-600 mb-2">填写实际补入数量：</div>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => handleUpdateItemQty(-1)}
                    className="w-12 h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center text-xl font-bold text-slate-700 cursor-pointer shadow-xs"
                  >
                    <Minus className="w-5 h-5" />
                  </button>

                  <div className="text-center">
                    <div className="font-mono text-3xl font-black text-slate-900 tabular-nums">
                      {currentItem.actualQty}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">实补总数(件)</div>
                  </div>

                  <button
                    onClick={() => handleUpdateItemQty(1)}
                    className="w-12 h-12 rounded-xl bg-orange-600 hover:bg-orange-700 active:scale-95 text-white flex items-center justify-center text-xl font-bold cursor-pointer shadow-md shadow-orange-500/20"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="p-3 bg-white border-t border-slate-200 shrink-0 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                if (currentItemIdx > 0) setCurrentItemIdx(currentItemIdx - 1);
                else setStep('slot_list');
              }}
              className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs text-center cursor-pointer"
            >
              上一个货道
            </button>

            <button
              onClick={handleNextSlot}
              className="py-3 bg-[#ff6900] hover:bg-orange-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
            >
              <span>{currentItemIdx === items.length - 1 ? '完成并结算' : '提交当前货道'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Screen 3: Complete Summary */}
      {step === 'complete_summary' && (
        <div className="flex-1 flex flex-col justify-between p-4 overflow-y-auto text-center space-y-4">
          <div className="my-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-in zoom-in-75">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">补货巡检任务已完成</h2>
              <p className="text-xs text-slate-500 mt-1">
                设备 {selectedOrder.deviceCode} 货道库存已在线回写
              </p>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between text-slate-500">
                <span>工单编号</span>
                <span className="font-mono text-slate-800">{selectedOrder.orderNo}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>实补商品总计</span>
                <span className="font-mono font-bold text-slate-900">
                  {items.reduce((s, i) => s + i.actualQty, 0)} 件
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>异常货道记录</span>
                <span className="font-medium text-rose-600">
                  {items.filter((i) => i.status === 'exception').length} 个
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleFinalSubmit}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl text-sm shadow-md cursor-pointer"
            >
              提交审核并返回中台
            </button>
          </div>
        </div>
      )}

      {/* Anomaly Register Modal */}
      {showAnomalyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span>货道异常登记</span>
              </div>
              <button
                onClick={() => setShowAnomalyModal(false)}
                className="p-1 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">异常类型：</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['少补', '错补', '货道故障', '商品破损'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setAnomalyType(t)}
                      className={`p-2 rounded-lg border font-semibold text-center cursor-pointer transition-colors ${
                        anomalyType === t
                          ? 'border-rose-500 bg-rose-50 text-rose-700'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">详细说明/损耗原因：</label>
                <textarea
                  rows={3}
                  value={anomalyNote}
                  onChange={(e) => setAnomalyNote(e.target.value)}
                  placeholder="如：运输途中罐身凹陷破损1件，已做退库登记..."
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAnomalyModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveAnomaly}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700"
              >
                登记并保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
