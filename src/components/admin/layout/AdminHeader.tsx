import React from 'react';
import {
  Building2,
  Store,
  Bell,
  RefreshCw,
  Search,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';
import { ClientStore } from '../../../types/admin';

interface AdminHeaderProps {
  clients: ClientStore[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  selectedStoreId: string;
  onSelectStore: (storeId: string) => void;
  onRefresh: () => void;
  alertCount: number;
  onOpenAlerts: () => void;
  onOpenMobileRestocker: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  clients,
  selectedClientId,
  onSelectClient,
  selectedStoreId,
  onSelectStore,
  onRefresh,
  alertCount,
  onOpenAlerts,
  onOpenMobileRestocker,
}) => {
  const currentClient = clients.find((c) => c.id === selectedClientId);
  const availableStores = currentClient ? currentClient.stores : [];

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-4 shrink-0 select-none text-slate-800">
      {/* Left: Global Client & Store Selectors */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">客户:</span>
          <select
            value={selectedClientId}
            onChange={(e) => {
              onSelectClient(e.target.value);
              onSelectStore('ALL');
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-orange-500"
          >
            <option value="ALL">全部合作客户</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-slate-300">/</span>

        <div className="flex items-center gap-1.5 text-xs">
          <Store className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">门店:</span>
          <select
            value={selectedStoreId}
            onChange={(e) => onSelectStore(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-orange-500"
          >
            <option value="ALL">全部运营网点</option>
            {availableStores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 ml-3 pl-3 border-l border-slate-200 text-[11px] text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>MQTT 实时心跳同步正常</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Mobile Restocker Shortcut */}
        <button
          onClick={onOpenMobileRestocker}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100/70 text-xs font-medium transition-colors cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>补货员手机端模拟</span>
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="刷新数据"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        {/* Alert Bell */}
        <button
          onClick={onOpenAlerts}
          className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="查看待处理告警"
        >
          <Bell className="w-4 h-4" />
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          )}
          {alertCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          )}
        </button>
      </div>
    </header>
  );
};
