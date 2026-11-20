import React, { useState } from 'react';
import {
  Grid3X3,
  Copy,
  Edit,
  Save,
  CheckSquare,
  Square,
  AlertCircle,
  Plus,
  ArrowRight,
  X,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';
import { SlotChannel, Device, ProductSKU } from '../../../types/admin';
import { ConfirmModal } from '../modals/ConfirmModal';

interface SlotConfigPageProps {
  devices: Device[];
  selectedDevice: Device;
  onSelectDevice: (device: Device) => void;
  slots: SlotChannel[];
  products: ProductSKU[];
  onUpdateSlot: (updatedSlot: SlotChannel) => void;
  onBatchUpdateSlots: (updatedSlots: SlotChannel[]) => void;
}

export const SlotConfigPage: React.FC<SlotConfigPageProps> = ({
  devices,
  selectedDevice,
  onSelectDevice,
  slots,
  products,
  onUpdateSlot,
  onBatchUpdateSlots,
}) => {
  const [selectedSlotIds, setSelectedSlotIds] = useState<string[]>([]);
  const [editingSlot, setEditingSlot] = useState<SlotChannel | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);
  const [targetDeviceIds, setTargetDeviceIds] = useState<string[]>([]);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchPrice, setBatchPrice] = useState<string>('');
  const [batchCapacity, setBatchCapacity] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleSelectSlot = (id: string) => {
    setSelectedSlotIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedSlotIds.length === slots.length) {
      setSelectedSlotIds([]);
    } else {
      setSelectedSlotIds(slots.map((s) => s.id));
    }
  };

  const handleBatchUpdate = () => {
    const updated = slots.map((s) => {
      if (!selectedSlotIds.includes(s.id)) return s;
      return {
        ...s,
        sellingPrice: batchPrice ? parseFloat(batchPrice) || s.sellingPrice : s.sellingPrice,
        capacity: batchCapacity ? parseInt(batchCapacity) || s.capacity : s.capacity,
      };
    });
    onBatchUpdateSlots(updated);
    setShowBatchModal(false);
    setSelectedSlotIds([]);
    showToast(`已批量更新 ${selectedSlotIds.length} 个货道的配置参数`);
  };

  const handleCopyConfigToDevices = () => {
    setShowCopyModal(false);
    showToast(`已将设备 ${selectedDevice.code} 的货道配置同步到 ${targetDeviceIds.length} 台设备`);
    setTargetDeviceIds([]);
  };

  return (
    <div className="space-y-4 relative">
      {/* Page Title & Device Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">柜机货道配置中心</h2>
          <p className="text-xs text-slate-500">
            货道物理矩阵布局、绑定 SKU、容量阈值、终端差价与跨柜模板复制
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-xs">
            <span className="text-slate-500 font-medium">当前配置柜机：</span>
            <select
              value={selectedDevice.id}
              onChange={(e) => {
                const dev = devices.find((d) => d.id === e.target.value);
                if (dev) onSelectDevice(dev);
              }}
              className="font-bold text-slate-800 bg-transparent focus:outline-hidden cursor-pointer"
            >
              {devices.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.code} - {d.name} ({d.model})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => setShowCopyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>复制配置到同型号柜</span>
          </button>
        </div>
      </div>

      {/* Visual Cabinet Slot Matrix (层级矩阵可视化: 4层 x 5列) */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Grid3X3 className="w-4 h-4 text-orange-500" />
            <span>柜体货道透视图（4 层 × 5 列 · 20 货道空间）</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500" /> 充足 (≥70%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-500" /> 缺货 (&lt;30%)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500" /> 售罄 (0件)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded bg-slate-300" /> 故障/停用
            </span>
          </div>
        </div>

        {/* 4 Rows Grid */}
        <div className="space-y-2 bg-slate-900 p-3.5 rounded-xl border border-slate-800">
          {[1, 2, 3, 4].map((floorNum) => {
            const floorSlots = slots.filter((s) => s.floor === floorNum);
            return (
              <div key={floorNum} className="space-y-1">
                <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between px-1">
                  <span>第 {floorNum} 层架 (Floor {floorNum})</span>
                  <span>5 货道</span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {floorSlots.map((slot) => {
                    const rate = slot.capacity > 0 ? (slot.currentStock / slot.capacity) * 100 : 0;
                    const isSelected = selectedSlotIds.includes(slot.id);
                    const isEmpty = slot.currentStock === 0;
                    const isLow = slot.currentStock <= slot.minStockThreshold && !isEmpty;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => handleToggleSelectSlot(slot.id)}
                        className={`relative rounded-lg p-2.5 border transition-all cursor-pointer ${
                          isSelected
                            ? 'ring-2 ring-orange-500 border-transparent bg-slate-800'
                            : 'border-slate-700 bg-slate-800/90 hover:bg-slate-700/80'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-mono font-bold text-white bg-slate-900 px-1.5 py-0.2 rounded">
                            {slot.slotNumber}
                          </span>
                          <span className="font-mono text-orange-400 font-bold">
                            ¥{slot.sellingPrice.toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 my-1.5">
                          <img
                            src={slot.productImage}
                            alt={slot.productName}
                            className="w-8 h-8 object-contain rounded bg-white/10 p-0.5 shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-slate-200 font-medium truncate" title={slot.productName}>
                              {slot.productName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              容量 {slot.capacity}
                            </div>
                          </div>
                        </div>

                        {/* Stock bar */}
                        <div className="space-y-1 mt-1">
                          <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                isEmpty
                                  ? 'bg-rose-500'
                                  : isLow
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>存量</span>
                            <span className={isEmpty ? 'text-rose-400 font-bold' : isLow ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                              {slot.currentStock} / {slot.capacity}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Batch Operations Bar */}
      {selectedSlotIds.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-2 text-orange-900 font-medium">
            <span>已勾选 {selectedSlotIds.length} 个货道</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBatchModal(true)}
              className="px-3 py-1 bg-[#ff6900] text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors cursor-pointer"
            >
              批量修改参数
            </button>
            <button
              onClick={() => setSelectedSlotIds([])}
              className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 cursor-pointer"
            >
              取消勾选
            </button>
          </div>
        </div>
      )}

      {/* Slot Channel Details Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleSelectAll}
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              {selectedSlotIds.length === slots.length ? (
                <CheckSquare className="w-4 h-4 text-orange-600" />
              ) : (
                <Square className="w-4 h-4 text-slate-400" />
              )}
              <span>全选 ({selectedSlotIds.length}/{slots.length})</span>
            </button>
          </div>
          <div className="text-slate-400 text-xs">
            点击任意货道右侧「编辑」可单独更改绑定的商品、容量与价格
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 w-8"></th>
                <th className="py-2.5 px-3 font-semibold">货道编号</th>
                <th className="py-2.5 px-3 font-semibold">绑定商品名称</th>
                <th className="py-2.5 px-3 font-semibold text-right">货道容量</th>
                <th className="py-2.5 px-3 font-semibold text-right">当前在柜</th>
                <th className="py-2.5 px-3 font-semibold text-right">最低预警值</th>
                <th className="py-2.5 px-3 font-semibold text-right">终端售价</th>
                <th className="py-2.5 px-3 font-semibold text-center">状态</th>
                <th className="py-2.5 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {slots.map((slot) => {
                const isSelected = selectedSlotIds.includes(slot.id);
                return (
                  <tr
                    key={slot.id}
                    className={`hover:bg-slate-50 transition-colors ${
                      isSelected ? 'bg-orange-50/30' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelectSlot(slot.id)}
                        className="rounded accent-orange-600 cursor-pointer w-3.5 h-3.5"
                      />
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                      {slot.slotNumber}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={slot.productImage}
                          alt={slot.productName}
                          className="w-7 h-7 object-contain rounded bg-slate-50 border border-slate-100 p-0.5"
                        />
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">
                          {slot.productName}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-800">
                      {slot.capacity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      <span className={slot.currentStock === 0 ? 'text-rose-600' : 'text-slate-800'}>
                        {slot.currentStock}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-500">
                      {slot.minStockThreshold}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-orange-600">
                      ¥{slot.sellingPrice.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          slot.status === 'normal'
                            ? 'bg-emerald-50 text-emerald-700'
                            : slot.status === 'fault'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {slot.status === 'normal' ? '正常' : slot.status === 'fault' ? '卡货故障' : '停用'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setEditingSlot(slot)}
                        className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                      >
                        编辑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Single Slot Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800">
                编辑货道参数 (货道号: {editingSlot.slotNumber})
              </h3>
              <button
                onClick={() => setEditingSlot(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1 font-medium">绑定商品：</label>
                <select
                  value={editingSlot.productId}
                  onChange={(e) => {
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod) {
                      setEditingSlot({
                        ...editingSlot,
                        productId: prod.id,
                        productName: prod.name,
                        productImage: prod.image,
                        sellingPrice: prod.sellingPrice,
                      });
                    }
                  }}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.spec})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-medium">货道容量：</label>
                  <input
                    type="number"
                    value={editingSlot.capacity}
                    onChange={(e) =>
                      setEditingSlot({ ...editingSlot, capacity: parseInt(e.target.value) || 0 })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-medium">零售单价(元)：</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editingSlot.sellingPrice}
                    onChange={(e) =>
                      setEditingSlot({ ...editingSlot, sellingPrice: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 mb-1 font-medium">货道状态：</label>
                <select
                  value={editingSlot.status}
                  onChange={(e) =>
                    setEditingSlot({ ...editingSlot, status: e.target.value as any })
                  }
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-800 bg-white"
                >
                  <option value="normal">正常运营</option>
                  <option value="fault">故障报修</option>
                  <option value="disabled">停用此货道</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingSlot(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateSlot(editingSlot);
                  setEditingSlot(null);
                  showToast(`货道 ${editingSlot.slotNumber} 配置已保存`);
                }}
                className="px-4 py-2 bg-[#ff6900] hover:bg-orange-600 text-white font-medium rounded-lg cursor-pointer"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Copy Config to other devices modal */}
      {showCopyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-orange-600" />
                <h3 className="font-bold text-sm text-slate-800">
                  复制货道配置模板到同型号设备
                </h3>
              </div>
              <button
                onClick={() => setShowCopyModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-500">
              将当前设备 <strong className="text-slate-800 font-mono">{selectedDevice.code}</strong> 的 20
              个货道绑定关系、售价与容量规则，一键同步覆写至下列目标设备：
            </p>

            <div className="border border-slate-200 rounded-xl p-3 divide-y divide-slate-100 max-h-48 overflow-y-auto">
              {devices
                .filter((d) => d.id !== selectedDevice.id && d.model === selectedDevice.model)
                .map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center justify-between py-2 cursor-pointer hover:bg-slate-50 px-1 rounded"
                  >
                    <div>
                      <span className="font-bold text-slate-800 font-mono mr-2">{d.code}</span>
                      <span className="text-slate-600">{d.name}</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={targetDeviceIds.includes(d.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTargetDeviceIds([...targetDeviceIds, d.id]);
                        } else {
                          setTargetDeviceIds(targetDeviceIds.filter((id) => id !== d.id));
                        }
                      }}
                      className="rounded accent-orange-600 w-4 h-4"
                    />
                  </label>
                ))}
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCopyModal(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                disabled={targetDeviceIds.length === 0}
                onClick={handleCopyConfigToDevices}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-medium rounded-lg cursor-pointer"
              >
                确认同步 ({targetDeviceIds.length}台)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Edit Modal */}
      {showBatchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-sm w-full p-5 space-y-4 text-xs">
            <h3 className="font-bold text-sm text-slate-800">
              批量修改已选中的 {selectedSlotIds.length} 个货道
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-slate-600 mb-1">统一销售价 (留空不改)：</label>
                <input
                  type="number"
                  step="0.1"
                  value={batchPrice}
                  onChange={(e) => setBatchPrice(e.target.value)}
                  placeholder="如: 4.5"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1">统一容量 (留空不改)：</label>
                <input
                  type="number"
                  value={batchCapacity}
                  onChange={(e) => setBatchCapacity(e.target.value)}
                  placeholder="如: 10"
                  className="w-full p-2 border border-slate-200 rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowBatchModal(false)}
                className="px-4 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleBatchUpdate}
                className="px-4 py-1.5 bg-[#ff6900] text-white rounded-lg font-semibold"
              >
                确认应用
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
