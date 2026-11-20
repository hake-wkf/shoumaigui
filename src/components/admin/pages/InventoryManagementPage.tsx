import React, { useState } from 'react';
import {
  Boxes,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  History,
  FileSpreadsheet,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { InventoryLog, ProductSKU } from '../../../types/admin';

interface InventoryManagementPageProps {
  products: ProductSKU[];
  inventoryLogs: InventoryLog[];
}

export const InventoryManagementPage: React.FC<InventoryManagementPageProps> = ({
  products,
  inventoryLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'current' | 'logs' | 'audit' | 'warnings'>('current');
  const [keyword, setKeyword] = useState('');

  const totalInCabinetStock = products.reduce((s, p) => s + p.totalStockAllDevices, 0);
  const transitStock = 120; // In transit to cabinets

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">智能库存与在途管理</h2>
          <p className="text-xs text-slate-500">
            全网柜机在柜实时存量、分仓在途调拨、出入库动销流水与盘盈盘亏核销
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
            <span className="text-slate-500">全网在柜实存：</span>
            <span className="font-mono font-bold text-slate-900 ml-1">{totalInCabinetStock} 件</span>
          </div>
          <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
            <span className="text-slate-500">在途调拨库存：</span>
            <span className="font-mono font-bold text-indigo-600 ml-1">{transitStock} 件</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-3 border-b border-slate-200 flex items-center gap-2 text-xs font-semibold rounded-t-xl">
        {[
          { id: 'current', label: '当前在柜总库存' },
          { id: 'logs', label: '出入库动销流水' },
          { id: 'audit', label: '盘点单与盘盈盘亏' },
          { id: 'warnings', label: '库存安全预警' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-3 relative transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Current Stock Table */}
      {activeTab === 'current' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">商品图 / SKU</th>
                  <th className="py-2.5 px-3 font-semibold">商品名称与规格</th>
                  <th className="py-2.5 px-3 font-semibold">条形码</th>
                  <th className="py-2.5 px-3 font-semibold text-right">在柜总库存</th>
                  <th className="py-2.5 px-3 font-semibold text-right">在途数量</th>
                  <th className="py-2.5 px-3 font-semibold text-right">近30天出货</th>
                  <th className="py-2.5 px-3 font-semibold text-center">库存健康度</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 flex items-center gap-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-8 h-8 object-contain rounded bg-slate-50 border border-slate-100 p-0.5"
                      />
                      <span className="font-mono text-slate-600">{p.sku}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{p.name}</div>
                      <div className="text-[11px] text-slate-400">{p.spec}</div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{p.barcode}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {p.totalStockAllDevices} 件
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-indigo-600 font-semibold">
                      {Math.round(p.totalStockAllDevices * 0.25)} 件
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {p.monthlySales} 件
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          p.totalStockAllDevices > 30
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.totalStockAllDevices > 10
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {p.totalStockAllDevices > 30 ? '充裕' : p.totalStockAllDevices > 10 ? '平稳' : '紧俏'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Stock Logs Table */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">发生时间</th>
                  <th className="py-2.5 px-3 font-semibold">柜机编号</th>
                  <th className="py-2.5 px-3 font-semibold">变动商品</th>
                  <th className="py-2.5 px-3 font-semibold">流水类型</th>
                  <th className="py-2.5 px-3 font-semibold text-right">变动数量</th>
                  <th className="py-2.5 px-3 font-semibold text-right">变动后结存</th>
                  <th className="py-2.5 px-3 font-semibold">操作主体</th>
                  <th className="py-2.5 px-3 font-semibold">关联订单号</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{log.time}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{log.deviceCode}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{log.productName}</td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          log.type === '销售出库'
                            ? 'bg-blue-50 text-blue-700'
                            : log.type === '补货入库'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {log.type}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold">
                      <span className={log.qtyChange < 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {log.qtyChange > 0 ? `+${log.qtyChange}` : log.qtyChange}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-800">{log.afterStock}</td>
                    <td className="py-2.5 px-3 text-slate-600">{log.operator}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                      {log.orderId || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit & Warnings */}
      {(activeTab === 'audit' || activeTab === 'warnings') && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-6 text-center text-xs text-slate-500 space-y-2">
          <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
          <div className="font-medium text-slate-700">
            {activeTab === 'audit' ? '周期实物盘点单记录' : '全局库存阈值监控与安全线'}
          </div>
          <p className="text-slate-400 max-w-md mx-auto">
            {activeTab === 'audit'
              ? '支持运营人员发起定期物理盘点，通过自动比对实物计数与系统数据生成盘盈盘亏报表并自动调整成本结存。'
              : '系统根据各门店历史销售速率实时动态调整安全库存水位线，并在低于20%时自动向补货员手机端推送预警。'}
          </p>
        </div>
      )}
    </div>
  );
};
