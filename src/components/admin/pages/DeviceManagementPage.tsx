import React, { useState } from 'react';
import {
  HardDrive,
  Search,
  Filter,
  RefreshCw,
  Power,
  Lock,
  Unlock,
  Volume2,
  DoorOpen,
  Wifi,
  Thermometer,
  Clock,
  X,
  CheckCircle2,
  AlertTriangle,
  History,
  Activity,
  Grid3X3,
  Sliders,
} from 'lucide-react';
import { Device, ClientStore } from '../../../types/admin';
import { ConfirmModal } from '../modals/ConfirmModal';

interface DeviceManagementPageProps {
  devices: Device[];
  clients: ClientStore[];
  onUpdateDevice: (updatedDevice: Device) => void;
  onNavigateToSlots: (device: Device) => void;
}

export const DeviceManagementPage: React.FC<DeviceManagementPageProps> = ({
  devices,
  clients,
  onUpdateDevice,
  onNavigateToSlots,
}) => {
  // Filters
  const [filterClient, setFilterClient] = useState('ALL');
  const [filterStore, setFilterStore] = useState('ALL');
  const [filterOnline, setFilterOnline] = useState('ALL');
  const [filterAlert, setFilterAlert] = useState('ALL');
  const [keyword, setKeyword] = useState('');

  // Selected for detail drawer
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [drawerTab, setDrawerTab] = useState<'info' | 'slots' | 'restock' | 'orders' | 'logs'>('info');

  // Confirm Modal State
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    isDanger: boolean;
    action: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    isDanger: false,
    action: () => {},
  });

  // Action toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Filtered devices
  const filteredDevices = devices.filter((dev) => {
    if (filterClient !== 'ALL' && dev.clientId !== filterClient) return false;
    if (filterStore !== 'ALL' && dev.storeId !== filterStore) return false;
    if (filterOnline !== 'ALL' && dev.onlineStatus !== filterOnline) return false;
    if (filterAlert !== 'ALL' && dev.alertStatus !== filterAlert) return false;
    if (keyword.trim()) {
      const q = keyword.toLowerCase().trim();
      return (
        dev.code.toLowerCase().includes(q) ||
        dev.name.toLowerCase().includes(q) ||
        dev.storeName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Remote Control Handlers with Secondary Confirmation
  const handleRemoteOpenDoor = (device: Device) => {
    setConfirmModalConfig({
      isOpen: true,
      title: '高危操作：远程开锁售货柜门',
      message: `确定要向设备「${device.name} (${device.code})」下发远程电磁锁开门指令吗？开门后需提示现场人员及时关闭。`,
      isDanger: true,
      action: () => {
        const updated: Device = { ...device, doorStatus: 'unlocked' };
        onUpdateDevice(updated);
        setActiveDevice(updated);
        showToast(`已向设备 ${device.code} 发送远程开门指令，门锁已释放！`);
      },
    });
  };

  const handleToggleLock = (device: Device) => {
    const nextLocked = !device.locked;
    setConfirmModalConfig({
      isOpen: true,
      title: nextLocked ? '锁定设备售卖服务' : '解锁并恢复设备售卖',
      message: nextLocked
        ? `锁定后设备「${device.name}」将暂停前台扫码购物，屏幕显示维护中。`
        : `解锁后设备「${device.name}」将立即恢复在线扫码开门。`,
      isDanger: nextLocked,
      action: () => {
        const updated: Device = { ...device, locked: nextLocked };
        onUpdateDevice(updated);
        setActiveDevice(updated);
        showToast(nextLocked ? `设备 ${device.code} 已锁定` : `设备 ${device.code} 已恢复正常服务`);
      },
    });
  };

  const handleRemoteReboot = (device: Device) => {
    setConfirmModalConfig({
      isOpen: true,
      title: '远程重启工控机主机',
      message: `确定要远程重启设备「${device.name}」吗？重启过程耗时约 60 秒，期间设备离线并停止对外服务。`,
      isDanger: true,
      action: () => {
        showToast(`重启指令已下发至 ${device.code}，正在等待心跳恢复...`);
      },
    });
  };

  const handleAdjustVolume = (device: Device, newVol: number) => {
    const updated: Device = { ...device, volume: newVol };
    onUpdateDevice(updated);
    setActiveDevice(updated);
    showToast(`已调整设备提示音量为 ${newVol}%`);
  };

  return (
    <div className="space-y-4 relative">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">智能售卖柜管理</h2>
          <p className="text-xs text-slate-500">
            全生命周期设备联网监测、传感器遥测、远程运维与指令控制中心
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('已从云端同步最新设备实时心跳')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            <span>同步心跳</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Client Filter */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500">客户：</span>
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">全部客户</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Online Status */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500">在线状态：</span>
            <select
              value={filterOnline}
              onChange={(e) => setFilterOnline(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">全部状态</option>
              <option value="online">在线</option>
              <option value="offline">离线</option>
            </select>
          </div>

          {/* Alert Status */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500">健康度：</span>
            <select
              value={filterAlert}
              onChange={(e) => setFilterAlert(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 focus:outline-hidden"
            >
              <option value="ALL">全部状态</option>
              <option value="normal">正常运行</option>
              <option value="warning">存在告警</option>
              <option value="critical">严重故障</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜索编号 / 名称 / 门店..."
              className="w-full pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-orange-500"
            />
          </div>
        </div>

        <div className="text-slate-400 text-xs">
          共筛选出 <strong className="text-slate-800 font-mono">{filteredDevices.length}</strong> 台设备
        </div>
      </div>

      {/* Main Devices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">设备名称 / 编号</th>
                <th className="py-2.5 px-3 font-semibold">所属客户</th>
                <th className="py-2.5 px-3 font-semibold">门店网点</th>
                <th className="py-2.5 px-3 font-semibold text-center">在线状态</th>
                <th className="py-2.5 px-3 font-semibold text-center">网络/信号</th>
                <th className="py-2.5 px-3 font-semibold text-center">门状态</th>
                <th className="py-2.5 px-3 font-semibold text-right">箱内温度</th>
                <th className="py-2.5 px-3 font-semibold text-right">在柜饱满率</th>
                <th className="py-2.5 px-3 font-semibold">最后心跳时间</th>
                <th className="py-2.5 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDevices.map((dev) => (
                <tr
                  key={dev.id}
                  onClick={() => setActiveDevice(dev)}
                  className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                    activeDevice?.id === dev.id ? 'bg-orange-50/40' : ''
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{dev.name}</div>
                    <div className="font-mono text-slate-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                      <span>编号: {dev.code}</span>
                      <span className="text-slate-300">·</span>
                      <span className="text-slate-400">{dev.model}</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-slate-700 font-medium">
                    {dev.clientName}
                  </td>

                  <td className="py-3 px-3 text-slate-600 truncate max-w-[140px]">
                    {dev.storeName}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        dev.onlineStatus === 'online'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          dev.onlineStatus === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                        }`}
                      />
                      {dev.onlineStatus === 'online' ? '在线' : '离线'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-1 font-mono text-[11px]">
                      <Wifi
                        className={`w-3.5 h-3.5 ${
                          dev.signalStrength > 70
                            ? 'text-emerald-500'
                            : dev.signalStrength > 30
                            ? 'text-amber-500'
                            : 'text-slate-400'
                        }`}
                      />
                      <span>{dev.netType} ({dev.signalStrength}%)</span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        dev.doorStatus === 'closed'
                          ? 'bg-slate-100 text-slate-700'
                          : 'bg-amber-100 text-amber-800 font-bold'
                      }`}
                    >
                      {dev.doorStatus === 'closed' ? '已闭门' : '已解锁开门'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span
                      className={`font-mono font-bold tabular-nums ${
                        dev.temperature > 8.0 ? 'text-rose-600' : 'text-slate-800'
                      }`}
                    >
                      {dev.temperature.toFixed(1)}°C
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className="font-mono tabular-nums text-slate-700 font-medium">
                      {dev.stockRate}%
                    </span>
                    <span className="text-[10px] text-slate-400 ml-1">
                      ({dev.emptySlotsCount}空)
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                    {dev.lastHeartbeat}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveDevice(dev)}
                        className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                      >
                        详情/控制
                      </button>
                      <span className="text-slate-200">|</span>
                      <button
                        onClick={() => onNavigateToSlots(dev)}
                        className="text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                      >
                        配货道
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Detail & Remote Control Drawer */}
      {activeDevice && (
        <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl border-l border-slate-200 z-40 flex flex-col animate-in slide-in-from-right duration-200 text-slate-800">
          {/* Drawer Header */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                机
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <span>{activeDevice.name}</span>
                  <span className="font-mono text-xs bg-slate-200/70 text-slate-700 px-1.5 py-0.2 rounded font-normal">
                    {activeDevice.code}
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500">{activeDevice.address}</p>
              </div>
            </div>

            <button
              onClick={() => setActiveDevice(null)}
              className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Remote Operations Action Strip (with secondary confirm) */}
          <div className="p-3 bg-slate-900 text-white flex items-center justify-between gap-2 text-xs">
            <div className="text-[11px] text-slate-300">远程运维指令：</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRemoteOpenDoor(activeDevice)}
                className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-500 rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="下发开门指令"
              >
                <DoorOpen className="w-3.5 h-3.5" />
                <span>远程开门</span>
              </button>

              <button
                onClick={() => handleToggleLock(activeDevice)}
                className={`px-2.5 py-1.5 rounded-md font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                  activeDevice.locked
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {activeDevice.locked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                <span>{activeDevice.locked ? '解除锁定' : '服务锁定'}</span>
              </button>

              <button
                onClick={() => handleRemoteReboot(activeDevice)}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-md font-medium flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Power className="w-3.5 h-3.5 text-rose-400" />
                <span>重启主机</span>
              </button>
            </div>
          </div>

          {/* Drawer Tabs */}
          <div className="px-4 border-b border-slate-200 flex items-center gap-4 text-xs font-semibold bg-white">
            {[
              { id: 'info', label: '基础信息与遥测' },
              { id: 'slots', label: '货道库存概览' },
              { id: 'restock', label: '补货履约记录' },
              { id: 'orders', label: '销售流水' },
              { id: 'logs', label: '操作审计日志' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setDrawerTab(tab.id as any)}
                className={`py-3 relative transition-colors cursor-pointer ${
                  drawerTab === tab.id
                    ? 'text-orange-600 border-b-2 border-orange-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Drawer Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            {drawerTab === 'info' && (
              <div className="space-y-4">
                {/* Telemetry Status Cards */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-orange-500" /> 柜温控制
                    </div>
                    <div className="text-base font-bold text-slate-900 font-mono mt-1">
                      {activeDevice.temperature.toFixed(1)}°C
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">目标设定 4.0°C</div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-blue-500" /> 网络遥测
                    </div>
                    <div className="text-base font-bold text-slate-900 font-mono mt-1">
                      {activeDevice.netType} · {activeDevice.signalStrength}%
                    </div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">延迟 24ms</div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                    <div className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-indigo-500" /> 语音音量
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={activeDevice.volume}
                        onChange={(e) => handleAdjustVolume(activeDevice, parseInt(e.target.value))}
                        className="w-full accent-orange-600 cursor-pointer h-1.5"
                      />
                      <span className="font-mono text-xs">{activeDevice.volume}%</span>
                    </div>
                  </div>
                </div>

                {/* Detail Specifications */}
                <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-500">固件版本号</span>
                    <span className="font-mono font-medium text-slate-800">{activeDevice.firmwareVersion}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-500">机型硬件架构</span>
                    <span className="text-slate-800 font-medium">{activeDevice.model} (双目RGB-D + 40路称重)</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-500">所属运营客户</span>
                    <span className="text-slate-800 font-medium">{activeDevice.clientName}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-500">落地物理位置</span>
                    <span className="text-slate-800">{activeDevice.address}</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-500">总货道容量</span>
                    <span className="font-mono text-slate-800">{activeDevice.totalSlots} 货道 (当前存量 {activeDevice.stockRate}%)</span>
                  </div>
                  <div className="px-4 py-2.5 flex justify-between">
                    <span className="text-slate-500">最后心跳上报</span>
                    <span className="font-mono text-slate-800">{activeDevice.lastHeartbeat}</span>
                  </div>
                </div>
              </div>
            )}

            {drawerTab === 'slots' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">货道空间排布（20货道）</span>
                  <button
                    onClick={() => onNavigateToSlots(activeDevice)}
                    className="text-orange-600 hover:text-orange-700 font-medium underline"
                  >
                    跳转到完整货道配置 →
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: 20 }).map((_, i) => {
                    const floor = Math.floor(i / 5) + 1;
                    const col = (i % 5) + 1;
                    const isLow = i === 9 || i === 8;
                    const isEmpty = i === 18;
                    return (
                      <div
                        key={i}
                        className={`p-2 rounded-lg border text-center ${
                          isEmpty
                            ? 'bg-rose-50 border-rose-200 text-rose-700'
                            : isLow
                            ? 'bg-amber-50 border-amber-200 text-amber-700'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="font-mono font-bold text-[10px]">{floor}-{col}</div>
                        <div className="text-[11px] font-bold mt-1">
                          {isEmpty ? '售罄' : isLow ? '缺货' : '8/10'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {drawerTab === 'restock' && (
              <div className="space-y-2">
                <div className="text-slate-500 text-xs mb-2">历史补货巡检任务履约记录：</div>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  <div className="p-3 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <div className="font-mono font-bold text-slate-800">RS-20260616-001</div>
                      <div className="text-[11px] text-slate-500">补货员：陈建国 · 待完成</div>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-medium px-2 py-0.5 rounded">
                      待补货
                    </span>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-mono font-bold text-slate-800">RS-20260615-098</div>
                      <div className="text-[11px] text-slate-500">补货员：陈建国 · 实补 22/24 件</div>
                    </div>
                    <span className="text-[10px] bg-rose-100 text-rose-800 font-medium px-2 py-0.5 rounded">
                      异常登记
                    </span>
                  </div>
                </div>
              </div>
            )}

            {drawerTab === 'orders' && (
              <div className="space-y-2">
                <div className="text-slate-500 text-xs mb-2">本机近 24 小时交易流水：</div>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-slate-800">1516450649369993216</div>
                      <div className="text-[11px] text-slate-500">银鹭牛奶花生 x 1 · 14:33:29</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">¥4.00</div>
                      <div className="text-[10px] text-emerald-600 font-medium">已支付</div>
                    </div>
                  </div>
                  <div className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-mono text-slate-800">1516450649369993202</div>
                      <div className="text-[11px] text-slate-500">银鹭牛奶花生 x 1 · 14:10:05</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-slate-900">¥4.00</div>
                      <div className="text-[10px] text-emerald-600 font-medium">已支付</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {drawerTab === 'logs' && (
              <div className="space-y-2 text-xs">
                <div className="text-slate-500 mb-2">安全控制审计日志流水：</div>
                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-slate-400">2026-06-16 14:33:14 · 操作员：CONSUMER_WECHAT_PAY</div>
                    <div className="text-slate-700 mt-0.5">扫码授权通过，下发柜门解锁脉冲信号 200ms</div>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div className="text-slate-400">2026-06-16 08:30:10 · 操作员：SYSTEM_CRON</div>
                    <div className="text-slate-700 mt-0.5">定时监测在柜存量低于70%，自动触发补货工单推荐</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        isDanger={confirmModalConfig.isDanger}
        onConfirm={confirmModalConfig.action}
        onClose={() => setConfirmModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
