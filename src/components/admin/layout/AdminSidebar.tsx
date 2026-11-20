import React from 'react';
import {
  LayoutDashboard,
  HardDrive,
  Package,
  Grid3X3,
  RefreshCw,
  Boxes,
  Receipt,
  ScanEye,
  AlertTriangle,
  Building2,
  BarChart3,
  Settings,
  Smartphone,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { AdminMenuKey } from '../../../types/admin';

interface AdminSidebarProps {
  currentMenu: AdminMenuKey;
  onSelectMenu: (menu: AdminMenuKey) => void;
  onOpenMobileApp: () => void;
  onOpenCustomerApp: () => void;
  pendingRestockCount: number;
  activeAlertCount: number;
}

interface MenuItemDef {
  key: AdminMenuKey;
  label: string;
  icon: React.ElementType;
  badge?: number;
  badgeColor?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentMenu,
  onSelectMenu,
  onOpenMobileApp,
  onOpenCustomerApp,
  pendingRestockCount,
  activeAlertCount,
}) => {
  const menuItems: MenuItemDef[] = [
    { key: 'workbench', label: '工作台', icon: LayoutDashboard },
    { key: 'devices', label: '设备管理', icon: HardDrive },
    { key: 'products', label: '商品管理', icon: Package },
    { key: 'slots', label: '货道配置', icon: Grid3X3 },
    {
      key: 'restock',
      label: '补货管理',
      icon: RefreshCw,
      badge: pendingRestockCount > 0 ? pendingRestockCount : undefined,
      badgeColor: 'bg-amber-500',
    },
    { key: 'inventory', label: '库存管理', icon: Boxes },
    { key: 'orders', label: '订单管理', icon: Receipt },
    { key: 'vision', label: '识别记录', icon: ScanEye },
    {
      key: 'alerts',
      label: '告警工单',
      icon: AlertTriangle,
      badge: activeAlertCount > 0 ? activeAlertCount : undefined,
      badgeColor: 'bg-rose-500',
    },
    { key: 'clients', label: '客户与门店', icon: Building2 },
    { key: 'reports', label: '数据报表', icon: BarChart3 },
    { key: 'settings', label: '系统设置', icon: Settings },
  ];

  return (
    <aside className="w-56 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center gap-2.5 border-b border-slate-800/80">
        <div className="w-7 h-7 rounded-lg bg-[#ff6900] text-white flex items-center justify-center font-bold text-xs shadow-md shadow-orange-500/20 shrink-0">
          谷
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-white tracking-tight truncate">
            谷家智能中台
          </div>
          <div className="text-[10px] text-slate-400 font-mono tracking-wider">
            BRAND VENDING OS
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-2.5 px-2 space-y-0.5 text-xs">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentMenu === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onSelectMenu(item.key as AdminMenuKey)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-orange-400' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`${item.badgeColor} text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full tabular-nums`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Cross-Platform Quick Switchers */}
      <div className="p-2 border-t border-slate-800/80 space-y-1">
        <button
          onClick={onOpenMobileApp}
          className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/40 text-xs font-medium transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Smartphone className="w-3.5 h-3.5" />
            <span>补货员手机端</span>
          </div>
          <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <button
          onClick={onOpenCustomerApp}
          className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 text-xs transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>前台扫码流程</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">小程序</span>
        </button>
      </div>

      {/* Operator User Card */}
      <div className="p-3 border-t border-slate-800/80 flex items-center gap-2.5 bg-slate-950">
        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-slate-200">
          林
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-semibold text-slate-200 truncate">林总监</div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 inline" />
            <span>平台管理员</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
