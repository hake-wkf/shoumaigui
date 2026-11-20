import React, { useState } from 'react';
import {
  RefreshCw,
  Plus,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  ArrowRight,
  ArrowLeft,
  Grid3X3,
  Sparkles,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  AlertOctagon,
  X,
  Edit,
} from 'lucide-react';
import { RestockOrder, RestockStatus, Device, ProductSKU } from '../../../types/admin';
import { ConfirmModal } from '../modals/ConfirmModal';

interface RestockManagementPageProps {
  restockOrders: RestockOrder[];
  devices: Device[];
  products: ProductSKU[];
  onUpdateRestockOrder: (order: RestockOrder) => void;
  onCreateRestockOrder: (order: RestockOrder) => void;
  initialSelectedOrder?: RestockOrder | null;
}

export const RestockManagementPage: React.FC<RestockManagementPageProps> = ({
  restockOrders,
  devices,
  products,
  onUpdateRestockOrder,
  onCreateRestockOrder,
  initialSelectedOrder = null,
}) => {
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<RestockOrder | null>(initialSelectedOrder);
  const [showAdviceModal, setShowAdviceModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDispatchModal, setShowDispatchModal] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState('陈建国（补货专员）');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm modal
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const statusFilters: { key: string; label: string }[] = [
    { key: 'ALL', label: '全部补货单' },
    { key: 'pending_dispatch', label: '待分配' },
    { key: 'pending_restock', label: '待补货' },
    { key: 'in_progress', label: '补货中' },
    { key: 'completed', label: '已完成' },
    { key: 'anomaly', label: '异常登记' },
    { key: 'cancelled', label: '已取消' },
  ];

  const filteredOrders = restockOrders.filter((o) => {
    if (activeTab !== 'ALL' && o.status !== activeTab) return false;
    return true;
  });

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      '补货单号,设备编号,客户,门店,补货员,商品种数,应补总数,实补总数,状态,创建时间,要求完成时间\n' +
      restockOrders
        .map(
          (o) =>
            `${o.orderNo},${o.deviceCode},${o.clientName},${o.storeName},${o.operatorName || '-'},${o.skuCount},${o.targetTotalQty},${o.actualTotalQty},${o.status},${o.createdAt},${o.deadline}`
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `补货工单导出_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('已导出补货工单 CSV 数据');
  };

  const handleCompleteOrder = (order: RestockOrder) => {
    setConfirmConfig({
      isOpen: true,
      title: '提交补货单最终完成审核',
      message: `确定要将补货单「${order.orderNo}」状态标记为已完成吗？系统将依据实补数量更新设备货道库存。`,
      action: () => {
        const updated: RestockOrder = {
          ...order,
          status: 'completed',
          actualTotalQty: order.targetTotalQty,
          completedAt: new Date().toLocaleString('zh-CN'),
        };
        onUpdateRestockOrder(updated);
        setSelectedOrder(updated);
        showToast(`补货单 ${order.orderNo} 已审核归档入库`);
      },
    });
  };

  const handleDispatch = () => {
    if (!selectedOrder) return;
    const updated: RestockOrder = {
      ...selectedOrder,
      operatorName: selectedOperator,
      operatorPhone: '13799881122',
      status: 'pending_restock',
    };
    onUpdateRestockOrder(updated);
    setSelectedOrder(updated);
    setShowDispatchModal(false);
    showToast(`已将补货单 ${selectedOrder.orderNo} 指派给 ${selectedOperator}`);
  };

  // If in detail mode: render Split View
  if (selectedOrder) {
    const isCompleted = selectedOrder.status === 'completed';
    const hasAnomaly = selectedOrder.hasException;
    const completionRate =
      selectedOrder.targetTotalQty > 0
        ? Math.min(100, Math.round((selectedOrder.actualTotalQty / selectedOrder.targetTotalQty) * 100))
        : 0;

    return (
      <div className="space-y-4">
        {/* Detail Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedOrder(null)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="返回补货单列表"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-mono">
                  {selectedOrder.orderNo}
                </h2>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    selectedOrder.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedOrder.status === 'anomaly'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedOrder.status === 'in_progress'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOrder.status === 'completed'
                    ? '已完成'
                    : selectedOrder.status === 'anomaly'
                    ? '异常登记'
                    : selectedOrder.status === 'in_progress'
                    ? '补货中'
                    : '待补货'}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                目标设备：{selectedOrder.deviceCode} · {selectedOrder.storeName} ({selectedOrder.clientName})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowDispatchModal(true)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium cursor-pointer shadow-xs"
            >
              指派补货员
            </button>

            <button
              onClick={() => handleExportCSV()}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-1 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印出库单</span>
            </button>

            {selectedOrder.status !== 'completed' && (
              <button
                onClick={() => handleCompleteOrder(selectedOrder)}
                className="px-3.5 py-1.5 bg-[#ff6900] hover:bg-orange-600 text-white rounded-lg font-semibold cursor-pointer shadow-xs"
              >
                审核并完成补货
              </button>
            )}
          </div>
        </div>

        {/* Progress & Exception Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-6">
              <div>
                <span className="text-slate-400">责任补货员：</span>
                <span className="font-semibold text-slate-800 ml-1">
                  {selectedOrder.operatorName || '未分配'}
                </span>
                {selectedOrder.operatorPhone && (
                  <span className="font-mono text-slate-500 ml-1">({selectedOrder.operatorPhone})</span>
                )}
              </div>

              <div>
                <span className="text-slate-400">要求完成时间：</span>
                <span className="font-mono text-slate-700 ml-1">{selectedOrder.deadline}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-500">实补履约进度：</span>
              <div className="w-40 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-300"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                {selectedOrder.actualTotalQty} / {selectedOrder.targetTotalQty} 件 ({completionRate}%)
              </span>
            </div>
          </div>

          {hasAnomaly && selectedOrder.exceptionSummary && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2 text-xs text-rose-800">
              <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">补货异常登记：</span>
                <span>{selectedOrder.exceptionSummary}</span>
              </div>
            </div>
          )}
        </div>

        {/* Core Split View: Left (Visual Slot Diagram) + Right (Slot Items Table) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left: Device Slot Matrix Visual Diagram (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Grid3X3 className="w-4 h-4 text-orange-500" />
                <span>柜机货道缺货高亮图</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {selectedOrder.deviceCode}
              </span>
            </div>

            <p className="text-[11px] text-slate-500">
              橙色框为本单应补货道（共 {selectedOrder.items.length} 个货位）：
            </p>

            <div className="space-y-1.5 bg-slate-900 p-3 rounded-xl border border-slate-800">
              {[1, 2, 3, 4].map((floor) => (
                <div key={floor} className="grid grid-cols-5 gap-1.5">
                  {[1, 2, 3, 4, 5].map((col) => {
                    const slotNum = `${floor}-${col}`;
                    const targetItem = selectedOrder.items.find(
                      (it) => it.slotNumber === slotNum
                    );
                    const isTarget = !!targetItem;
                    const isCompleted = targetItem?.status === 'completed';
                    const isException = targetItem?.status === 'exception';

                    return (
                      <div
                        key={col}
                        className={`aspect-square rounded flex flex-col items-center justify-center p-1 text-[10px] font-mono border transition-all ${
                          isException
                            ? 'bg-rose-900/60 border-rose-500 text-rose-200 font-bold'
                            : isCompleted
                            ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                            : isTarget
                            ? 'bg-orange-500/30 border-orange-400 text-orange-200 animate-pulse font-bold'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-500'
                        }`}
                        title={
                          targetItem
                            ? `${slotNum}: ${targetItem.productName} 应补${targetItem.suggestedQty}`
                            : `${slotNum}: 存量充足无需补货`
                        }
                      >
                        <span>{slotNum}</span>
                        {isTarget && (
                          <span className="text-[9px] scale-90">
                            {isCompleted ? '✓' : `+${targetItem.suggestedQty}`}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
              💡 提示：补货员可在移动端通过扫描货道条形码快速入库，每完成一个货道，上方色块将自动由橙转绿。
            </div>
          </div>

          {/* Right: Slot Detail Items Table (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                本工单货道物料明细清单
              </span>
              <span className="text-[11px] text-slate-500">
                共 {selectedOrder.items.length} 个待补货道
              </span>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">货道号</th>
                    <th className="py-2.5 px-3 font-semibold">商品图 / 名称</th>
                    <th className="py-2.5 px-3 font-semibold text-right">容量</th>
                    <th className="py-2.5 px-3 font-semibold text-right">当前在柜</th>
                    <th className="py-2.5 px-3 font-semibold text-right text-orange-600">
                      建议补货
                    </th>
                    <th className="py-2.5 px-3 font-semibold text-right">实际补入</th>
                    <th className="py-2.5 px-3 font-semibold text-right">差异数</th>
                    <th className="py-2.5 px-3 font-semibold text-center">状态</th>
                    <th className="py-2.5 px-3 font-semibold">备注/异常说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {selectedOrder.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {it.slotNumber}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={it.productImage}
                            alt={it.productName}
                            className="w-8 h-8 object-contain rounded bg-slate-50 border border-slate-100 p-0.5"
                          />
                          <span className="font-medium text-slate-800 truncate max-w-[150px]">
                            {it.productName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-mono text-slate-600">
                        {it.capacity}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-700">
                        {it.currentStock}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-orange-600 tabular-nums">
                        +{it.suggestedQty}
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {it.actualQty}
                      </td>

                      <td className="py-3 px-3 text-right font-mono">
                        <span
                          className={
                            it.diffQty < 0
                              ? 'text-rose-600 font-bold'
                              : it.diffQty > 0
                              ? 'text-blue-600 font-bold'
                              : 'text-slate-400'
                          }
                        >
                          {it.diffQty === 0 ? '0' : it.diffQty > 0 ? `+${it.diffQty}` : it.diffQty}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                            it.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : it.status === 'exception'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {it.status === 'completed'
                            ? '已完成'
                            : it.status === 'exception'
                            ? it.exceptionReason || '异常'
                            : '待补货'}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-500 text-[11px] truncate max-w-[160px]">
                        {it.note || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Dispatch Modal */}
        {showDispatchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-xs">
              <h3 className="font-bold text-sm text-slate-800">指派工单补货专员</h3>
              <div>
                <label className="block text-slate-600 mb-1">选择网点巡检运维员：</label>
                <select
                  value={selectedOperator}
                  onChange={(e) => setSelectedOperator(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-white"
                >
                  <option value="陈建国（补货专员）">陈建国 (负责软件园二期/三期 · 13799881122)</option>
                  <option value="王志强">王志强 (负责五缘湾 · 13611223344)</option>
                  <option value="李思齐">李思齐 (深圳南山区专员 · 13822334455)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowDispatchModal(false)}
                  className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  取消
                </button>
                <button
                  onClick={handleDispatch}
                  className="px-4 py-1.5 bg-[#ff6900] text-white rounded-lg font-semibold cursor-pointer"
                >
                  确认指派
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.action}
          onClose={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    );
  }

  // List View Mode
  return (
    <div className="space-y-4 relative">
      {/* Page Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">智能补货工单调度</h2>
          <p className="text-xs text-slate-500">
            全网柜机缺货建议测算、补货派工、现场实补对账与损耗破损核销
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdviceModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>查看缺货建议</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>导出工单</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#ff6900] hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建补货单</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-3 border-b border-slate-200 flex items-center gap-2 text-xs font-medium rounded-t-xl">
        {statusFilters.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`py-3 px-3 relative transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'text-orange-600 font-bold border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">补货单号</th>
                <th className="py-2.5 px-3 font-semibold">目标设备 / 编号</th>
                <th className="py-2.5 px-3 font-semibold">所属客户与门店</th>
                <th className="py-2.5 px-3 font-semibold">指派补货员</th>
                <th className="py-2.5 px-3 font-semibold text-right">SKU品类数</th>
                <th className="py-2.5 px-3 font-semibold text-right">应补/实补总数</th>
                <th className="py-2.5 px-3 font-semibold text-center">状态</th>
                <th className="py-2.5 px-3 font-semibold">创建时间</th>
                <th className="py-2.5 px-3 font-semibold">要求完成时间</th>
                <th className="py-2.5 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord)}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">
                    {ord.orderNo}
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{ord.deviceName}</div>
                    <div className="font-mono text-slate-500 text-[11px]">{ord.deviceCode}</div>
                  </td>

                  <td className="py-3 px-3">
                    <div className="text-slate-800 font-medium">{ord.storeName}</div>
                    <div className="text-slate-400 text-[11px]">{ord.clientName}</div>
                  </td>

                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {ord.operatorName || (
                      <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">
                        待指派
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-right font-mono text-slate-700">
                    {ord.skuCount} 款
                  </td>

                  <td className="py-3 px-3 text-right font-mono tabular-nums">
                    <span className="font-bold text-slate-900">{ord.actualTotalQty}</span>
                    <span className="text-slate-400"> / {ord.targetTotalQty} 件</span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        ord.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : ord.status === 'anomaly'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200/50'
                          : ord.status === 'in_progress'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {ord.status === 'completed'
                        ? '已完成'
                        : ord.status === 'anomaly'
                        ? '异常登记'
                        : ord.status === 'in_progress'
                        ? '补货中'
                        : '待补货'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                    {ord.createdAt}
                  </td>

                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {ord.deadline}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedOrder(ord);
                      }}
                      className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Out of Stock Advice Modal */}
      {showAdviceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm text-slate-800">
                  全网柜机缺货建议（基于存销比预测）
                </h3>
              </div>
              <button
                onClick={() => setShowAdviceModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-500 leading-relaxed">
              算法模型根据近 7 天销售频次与当前柜内实时库存推算，检测到 2 台设备已触发严重断货风险：
            </p>

            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-800">856566 - 软件园三期研发中心A座</div>
                  <div className="text-[11px] text-rose-600 mt-0.5">
                    在柜饱满率 48% · 7 个货道已低于安全库存 (缺货商品: 银鹭牛奶花生、元气森林)
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAdviceModal(false);
                    showToast('已为 856566 自动生成智能补货工单！');
                  }}
                  className="px-3 py-1.5 bg-[#ff6900] text-white rounded-lg font-semibold hover:bg-orange-700 cursor-pointer shrink-0"
                >
                  一键生成补货单
                </button>
              </div>
            </div>

            <div className="pt-2 flex justify-end border-t border-slate-100">
              <button
                onClick={() => setShowAdviceModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Restock Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800">新建补货任务工单</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">选择目标设备：</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800">
                  {devices.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name} ({d.storeName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">指派补货专员：</label>
                <select className="w-full p-2 border border-slate-200 rounded-lg bg-white text-slate-800">
                  <option value="陈建国">陈建国 (13799881122)</option>
                  <option value="王志强">王志强 (13611223344)</option>
                  <option value="李思齐">李思齐 (13822334455)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">要求完成时限：</label>
                <input
                  type="text"
                  defaultValue="2026-06-16 18:00:00"
                  className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const newRo: RestockOrder = {
                    id: `ro-${Date.now()}`,
                    orderNo: `RS-${Date.now().toString().slice(-8)}`,
                    deviceId: 'dev-1',
                    deviceCode: '856565',
                    deviceName: '谷家智能冷柜-创客大堂01号',
                    clientId: 'client-1',
                    clientName: '厦门谷家科技有限公司',
                    storeId: 'store-1',
                    storeName: '软件园二期创客大堂店',
                    operatorId: 'op-101',
                    operatorName: '陈建国（补货专员）',
                    operatorPhone: '13799881122',
                    skuCount: 3,
                    targetTotalQty: 25,
                    actualTotalQty: 0,
                    status: 'pending_restock',
                    createdAt: new Date().toLocaleString('zh-CN'),
                    deadline: '2026-06-16 18:00:00',
                    hasException: false,
                    items: [],
                  };
                  onCreateRestockOrder(newRo);
                  setShowCreateModal(false);
                  showToast('新补货工单已成功下发至补货员手机端');
                }}
                className="px-4 py-2 bg-[#ff6900] text-white rounded-lg font-semibold hover:bg-orange-700 cursor-pointer"
              >
                下发工单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
