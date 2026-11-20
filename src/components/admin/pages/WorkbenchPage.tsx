import React from 'react';
import {
  DollarSign,
  ShoppingCart,
  HardDrive,
  AlertTriangle,
  RefreshCw,
  ScanEye,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertOctagon,
} from 'lucide-react';
import { Device, AdminOrder, RestockOrder, AlertTicket } from '../../../types/admin';

interface WorkbenchPageProps {
  devices: Device[];
  orders: AdminOrder[];
  restockOrders: RestockOrder[];
  alertTickets: AlertTicket[];
  onNavigate: (page: any) => void;
  onSelectDevice: (device: Device) => void;
  onSelectRestock: (order: RestockOrder) => void;
}

export const WorkbenchPage: React.FC<WorkbenchPageProps> = ({
  devices,
  orders,
  restockOrders,
  alertTickets,
  onNavigate,
  onSelectDevice,
  onSelectRestock,
}) => {
  // Aggregate KPIs
  const todaySales = orders
    .filter((o) => o.payStatus === 'SUCCESS')
    .reduce((sum, o) => sum + o.payAmount, 0);

  const todayOrdersCount = orders.length;
  const onlineDevicesCount = devices.filter((d) => d.onlineStatus === 'online').length;
  const lowStockDevices = devices.filter((d) => d.stockRate < 70 || d.emptySlotsCount > 2);
  const pendingRestockCount = restockOrders.filter(
    (r) => r.status === 'pending_restock' || r.status === 'in_progress'
  ).length;
  const visionFailCount = 1;
  const abnormalDevicesCount = devices.filter((d) => d.alertStatus !== 'normal' || d.onlineStatus === 'offline').length;

  return (
    <div className="space-y-5">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">运营工作台</h2>
          <p className="text-xs text-slate-500">
            实时品牌终端售卖柜网点经营与设备状态监测总览
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono">
          最后更新：{new Date().toLocaleTimeString('zh-CN')}
        </div>
      </div>

      {/* 7 Compact Data Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* Metric 1: 今日销售额 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>今日销售额</span>
            <DollarSign className="w-3.5 h-3.5 text-orange-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              ¥{todaySales.toFixed(2)}
            </span>
            <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
              +14.2% 较昨日
            </div>
          </div>
        </div>

        {/* Metric 2: 今日订单数 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>今日订单数</span>
            <ShoppingCart className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-slate-900 tabular-nums">
              {todayOrdersCount}
            </span>
            <span className="text-xs text-slate-500 ml-1">笔</span>
            <div className="text-[10px] text-slate-400 mt-0.5">自营免密代扣</div>
          </div>
        </div>

        {/* Metric 3: 在线设备数 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>在线设备数</span>
            <HardDrive className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-emerald-600 tabular-nums">
              {onlineDevicesCount}
            </span>
            <span className="text-xs text-slate-500 ml-1">/ {devices.length}</span>
            <div className="text-[10px] text-slate-400 mt-0.5">
              在线率 {((onlineDevicesCount / devices.length) * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Metric 4: 缺货设备数 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>缺货设备数</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-amber-600 tabular-nums">
              {lowStockDevices.length}
            </span>
            <span className="text-xs text-slate-500 ml-1">台</span>
            <div className="text-[10px] text-amber-600/90 font-medium mt-0.5">
              建议及时派单补货
            </div>
          </div>
        </div>

        {/* Metric 5: 待补货任务数 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>待补货任务数</span>
            <RefreshCw className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-indigo-600 tabular-nums">
              {pendingRestockCount}
            </span>
            <span className="text-xs text-slate-500 ml-1">单</span>
            <div className="text-[10px] text-slate-400 mt-0.5">
              包含补货中 1 单
            </div>
          </div>
        </div>

        {/* Metric 6: 识别失败数 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>识别失败数</span>
            <ScanEye className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-rose-600 tabular-nums">
              {visionFailCount}
            </span>
            <span className="text-xs text-slate-500 ml-1">次</span>
            <div className="text-[10px] text-slate-400 mt-0.5">
              已人工二次复核
            </div>
          </div>
        </div>

        {/* Metric 7: 设备异常数 */}
        <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="text-[11px] font-medium text-slate-500 flex items-center justify-between">
            <span>设备异常数</span>
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="mt-2">
            <span className="text-xl font-bold text-red-600 tabular-nums">
              {abnormalDevicesCount}
            </span>
            <span className="text-xs text-slate-500 ml-1">台</span>
            <div className="text-[10px] text-red-500 font-medium mt-0.5">
              含离线与温控异常
            </div>
          </div>
        </div>
      </div>

      {/* 4 Compact Data Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Table 1: 待补货设备列表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
              <h3 className="text-xs font-bold text-slate-900">待补货设备列表</h3>
              <span className="text-[11px] text-slate-400">（在柜存销比预警）</span>
            </div>
            <button
              onClick={() => onNavigate('restock')}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5 cursor-pointer"
            >
              一键创建补货单 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2 px-3 font-semibold">设备编号</th>
                  <th className="py-2 px-3 font-semibold">所属门店</th>
                  <th className="py-2 px-3 font-semibold text-right">在柜饱满率</th>
                  <th className="py-2 px-3 font-semibold text-right">空货道</th>
                  <th className="py-2 px-3 font-semibold text-center">状态</th>
                  <th className="py-2 px-3 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lowStockDevices.map((dev) => (
                  <tr key={dev.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      {dev.code}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[130px]">
                      {dev.storeName}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <div className="w-14 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              dev.stockRate < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${dev.stockRate}%` }}
                          />
                        </div>
                        <span className="font-mono tabular-nums">{dev.stockRate}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-amber-600 font-bold">
                      {dev.emptySlotsCount} 个
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-medium">
                        缺货中
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSelectDevice(dev)}
                        className="text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                      >
                        查看货道
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: 设备异常列表 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-red-600 rounded-full" />
              <h3 className="text-xs font-bold text-slate-900">设备异常工单列表</h3>
              <span className="text-[11px] text-slate-400">（需运维处置）</span>
            </div>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-0.5 cursor-pointer"
            >
              全部告警 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2 px-3 font-semibold">告警编号</th>
                  <th className="py-2 px-3 font-semibold">设备</th>
                  <th className="py-2 px-3 font-semibold">异常类型</th>
                  <th className="py-2 px-3 font-semibold">触发时间</th>
                  <th className="py-2 px-3 font-semibold text-center">级别</th>
                  <th className="py-2 px-3 font-semibold text-right">处理人</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {alertTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-600">{t.ticketNo}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      {t.deviceCode}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{t.type}</td>
                    <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">
                      {t.triggerTime.slice(11)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                          t.severity === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-700'
                            : t.severity === 'WARNING'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {t.severity === 'CRITICAL' ? '紧急' : t.severity === 'WARNING' ? '重要' : '提示'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-600 font-medium">
                      {t.handlerName || '待指派'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 3: 最近订单 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-blue-600 rounded-full" />
              <h3 className="text-xs font-bold text-slate-900">实时流水订单</h3>
              <span className="text-[11px] text-slate-400">（消费者代扣）</span>
            </div>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-0.5 cursor-pointer"
            >
              全部订单 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2 px-3 font-semibold">订单编号</th>
                  <th className="py-2 px-3 font-semibold">设备</th>
                  <th className="py-2 px-3 font-semibold">商品明细</th>
                  <th className="py-2 px-3 font-semibold text-right">金额</th>
                  <th className="py-2 px-3 font-semibold text-center">状态</th>
                  <th className="py-2 px-3 font-semibold text-right">下单时间</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 4).map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {ord.orderNo.slice(-8)}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">
                      {ord.deviceCode}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[140px]">
                      {ord.items.length > 0 ? ord.items[0].productName : '无购物开门'}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      ¥{ord.payAmount.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                        {ord.payStatus === 'SUCCESS' ? '已支付' : ord.payStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-400 font-mono text-[11px]">
                      {ord.createdAt.slice(11)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 4: 补货任务进度 */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full" />
              <h3 className="text-xs font-bold text-slate-900">补货任务执行跟踪</h3>
              <span className="text-[11px] text-slate-400">（现场履约）</span>
            </div>
            <button
              onClick={() => onNavigate('restock')}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5 cursor-pointer"
            >
              补货管理 <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
                <tr>
                  <th className="py-2 px-3 font-semibold">补货单号</th>
                  <th className="py-2 px-3 font-semibold">设备与门店</th>
                  <th className="py-2 px-3 font-semibold">补货员</th>
                  <th className="py-2 px-3 font-semibold text-right">应补/实补</th>
                  <th className="py-2 px-3 font-semibold text-center">执行状态</th>
                  <th className="py-2 px-3 font-semibold text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {restockOrders.map((ro) => (
                  <tr key={ro.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                      {ro.orderNo}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 truncate max-w-[130px]">
                      {ro.deviceCode} · {ro.storeName}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{ro.operatorName || '未分配'}</td>
                    <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                      <span className="font-bold text-slate-900">{ro.actualTotalQty}</span>
                      <span className="text-slate-400"> / {ro.targetTotalQty}</span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                          ro.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : ro.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700'
                            : ro.status === 'anomaly'
                            ? 'bg-rose-50 text-rose-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {ro.status === 'completed'
                          ? '已完成'
                          : ro.status === 'in_progress'
                          ? '补货中'
                          : ro.status === 'anomaly'
                          ? '异常登记'
                          : '待补货'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onSelectRestock(ro)}
                        className="text-orange-600 hover:text-orange-700 font-medium cursor-pointer"
                      >
                        详情
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
