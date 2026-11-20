/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Smartphone,
  Monitor,
  Columns,
  Sparkles,
  RefreshCw,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  ListOrdered,
  FileText,
  Boxes,
} from 'lucide-react';
import { AdminSidebar } from './components/admin/layout/AdminSidebar';
import { AdminHeader } from './components/admin/layout/AdminHeader';
import { WorkbenchPage } from './components/admin/pages/WorkbenchPage';
import { DeviceManagementPage } from './components/admin/pages/DeviceManagementPage';
import { ProductManagementPage } from './components/admin/pages/ProductManagementPage';
import { SlotConfigPage } from './components/admin/pages/SlotConfigPage';
import { RestockManagementPage } from './components/admin/pages/RestockManagementPage';
import { InventoryManagementPage } from './components/admin/pages/InventoryManagementPage';
import { OrderManagementPage } from './components/admin/pages/OrderManagementPage';
import { VisionLogPage } from './components/admin/pages/VisionLogPage';
import { AlertTicketsPage } from './components/admin/pages/AlertTicketsPage';
import { ClientStorePage } from './components/admin/pages/ClientStorePage';
import { DataReportsPage } from './components/admin/pages/DataReportsPage';
import { SystemSettingsPage } from './components/admin/pages/SystemSettingsPage';
import { MobileRestockApp } from './components/admin/mobile/MobileRestockApp';

// Consumer front-end screens (for full cycle verification)
import { PhoneFrame } from './components/PhoneFrame';
import { HomeScreen } from './components/screens/HomeScreen';
import { AuthModalScreen } from './components/screens/AuthModalScreen';
import { OrderPlacedScreen } from './components/screens/OrderPlacedScreen';
import { MineScreen } from './components/screens/MineScreen';
import { OrderListScreen } from './components/screens/OrderListScreen';
import { OrderDetailsScreen } from './components/screens/OrderDetailsScreen';

import {
  MOCK_DEVICES,
  MOCK_PRODUCTS,
  MOCK_SLOTS_856565,
  MOCK_RESTOCK_ORDERS,
  MOCK_ADMIN_ORDERS,
  MOCK_VISION_LOGS,
  MOCK_ALERT_TICKETS,
  MOCK_CLIENTS,
  MOCK_INVENTORY_LOGS,
} from './data/adminMockData';

import {
  Device,
  ProductSKU,
  SlotChannel,
  RestockOrder,
  AdminOrder,
  VisionLog,
  AlertTicket,
  ClientStore,
  AdminMenuKey,
} from './types/admin';

import { INITIAL_ORDERS, INITIAL_CABINET } from './data/mockData';
import { Order, ScreenId } from './types/vending';

export default function App() {
  // Top Level Mode: 'admin' (Desktop Web Operations) | 'mobile_restock' (Restocker App) | 'consumer_flow' (Scan to Open Applet)
  const [systemMode, setSystemMode] = useState<'admin' | 'mobile_restock' | 'consumer_flow'>('admin');

  // Admin Navigation
  const [adminMenu, setAdminMenu] = useState<AdminMenuKey>('workbench');
  const [selectedClientId, setSelectedClientId] = useState<string>('ALL');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('ALL');

  // Shared Domain Data
  const [devices, setDevices] = useState<Device[]>(MOCK_DEVICES);
  const [products, setProducts] = useState<ProductSKU[]>(MOCK_PRODUCTS);
  const [slots, setSlots] = useState<SlotChannel[]>(MOCK_SLOTS_856565);
  const [restockOrders, setRestockOrders] = useState<RestockOrder[]>(MOCK_RESTOCK_ORDERS);
  const [adminOrders, setAdminOrders] = useState<AdminOrder[]>(MOCK_ADMIN_ORDERS);
  const [visionLogs, setVisionLogs] = useState<VisionLog[]>(MOCK_VISION_LOGS);
  const [alertTickets, setAlertTickets] = useState<AlertTicket[]>(MOCK_ALERT_TICKETS);
  const [clients, setClients] = useState<ClientStore[]>(MOCK_CLIENTS);

  // Selected device for slot configuration
  const [currentSlotDevice, setCurrentSlotDevice] = useState<Device>(MOCK_DEVICES[0]);
  const [currentRestockDetail, setCurrentRestockDetail] = useState<RestockOrder | null>(null);

  // Consumer Front-End States
  const [consumerScreen, setConsumerScreen] = useState<ScreenId>('home');
  const [consumerOrders, setConsumerOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [consumerSelectedOrder, setConsumerSelectedOrder] = useState<Order>(INITIAL_ORDERS[0]);
  const [consumerPanoramic, setConsumerPanoramic] = useState(true);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Handlers for Admin mutations
  const handleUpdateDevice = (updated: Device) => {
    setDevices((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleUpdateProduct = (updated: ProductSKU) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleAddProduct = (newProd: ProductSKU) => {
    setProducts((prev) => [newProd, ...prev]);
    showToast(`已成功录入商品 ${newProd.name}`);
  };

  const handleUpdateSlot = (updated: SlotChannel) => {
    setSlots((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
  };

  const handleBatchUpdateSlots = (updatedList: SlotChannel[]) => {
    setSlots(updatedList);
  };

  const handleUpdateRestockOrder = (updated: RestockOrder) => {
    setRestockOrders((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
  };

  const handleCreateRestockOrder = (newOrder: RestockOrder) => {
    setRestockOrders([newOrder, ...restockOrders]);
  };

  const handleManualVisionOverride = (logId: string, correctedProd: string, amount: number) => {
    setVisionLogs((prev) =>
      prev.map((l) =>
        l.id === logId
          ? {
              ...l,
              finalProduct: correctedProd,
              amount: amount,
              isManualOverride: true,
              overrideBy: '林管理员 (人工核验)',
              status: 'SUCCESS',
            }
          : l
      )
    );
    showToast('视觉日志出货判定已人工修正');
  };

  const handleUpdateTicket = (updated: AlertTicket) => {
    setAlertTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    showToast(`工单 ${updated.ticketNo} 状态已更新`);
  };

  const pendingRestockCount = restockOrders.filter(
    (r) => r.status === 'pending_restock' || r.status === 'in_progress'
  ).length;
  const activeAlertCount = alertTickets.filter(
    (t) => t.status === 'PENDING' || t.status === 'PROCESSING'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none text-slate-800">
      {/* Top System-Level Bar (Mode Switcher) */}
      <div className="bg-slate-950 text-slate-300 h-10 px-4 flex items-center justify-between border-b border-slate-800 text-xs shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#ff6900]" />
          <span className="font-bold text-white tracking-tight">谷家智能售卖柜品牌运营系统</span>
          <span className="text-slate-500 hidden sm:inline">| 企业级私有化中台</span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => setSystemMode('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              systemMode === 'admin'
                ? 'bg-[#ff6900] text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>品牌桌面后台</span>
          </button>

          <button
            onClick={() => setSystemMode('mobile_restock')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              systemMode === 'mobile_restock'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>补货员手机端</span>
          </button>

          <button
            onClick={() => setSystemMode('consumer_flow')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
              systemMode === 'consumer_flow'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>前台扫码小程序</span>
          </button>
        </div>
      </div>

      {/* Main View: MODE 1 - Desktop Admin Console */}
      {systemMode === 'admin' && (
        <div className="flex-1 flex overflow-hidden">
          {/* Left Fixed Navigation */}
          <AdminSidebar
            currentMenu={adminMenu}
            onSelectMenu={(menu) => setAdminMenu(menu)}
            onOpenMobileApp={() => setSystemMode('mobile_restock')}
            onOpenCustomerApp={() => setSystemMode('consumer_flow')}
            pendingRestockCount={pendingRestockCount}
            activeAlertCount={activeAlertCount}
          />

          {/* Right Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#f8fafc]">
            {/* Top Customer/Store Switcher & Header */}
            <AdminHeader
              clients={clients}
              selectedClientId={selectedClientId}
              onSelectClient={(cId) => setSelectedClientId(cId)}
              selectedStoreId={selectedStoreId}
              onSelectStore={(sId) => setSelectedStoreId(sId)}
              onRefresh={() => showToast('已从云端物联网网关刷新最新设备遥测')}
              alertCount={activeAlertCount}
              onOpenAlerts={() => setAdminMenu('alerts')}
              onOpenMobileRestocker={() => setSystemMode('mobile_restock')}
            />

            {/* Scrollable Work Area */}
            <main className="flex-1 overflow-y-auto p-6">
              {adminMenu === 'workbench' && (
                <WorkbenchPage
                  devices={devices}
                  orders={adminOrders}
                  restockOrders={restockOrders}
                  alertTickets={alertTickets}
                  onNavigate={(page) => setAdminMenu(page)}
                  onSelectDevice={(d) => {
                    setCurrentSlotDevice(d);
                    setAdminMenu('slots');
                  }}
                  onSelectRestock={(r) => {
                    setCurrentRestockDetail(r);
                    setAdminMenu('restock');
                  }}
                />
              )}

              {adminMenu === 'devices' && (
                <DeviceManagementPage
                  devices={devices}
                  clients={clients}
                  onUpdateDevice={handleUpdateDevice}
                  onNavigateToSlots={(d) => {
                    setCurrentSlotDevice(d);
                    setAdminMenu('slots');
                  }}
                />
              )}

              {adminMenu === 'products' && (
                <ProductManagementPage
                  products={products}
                  onUpdateProduct={handleUpdateProduct}
                  onAddProduct={handleAddProduct}
                />
              )}

              {adminMenu === 'slots' && (
                <SlotConfigPage
                  devices={devices}
                  selectedDevice={currentSlotDevice}
                  onSelectDevice={(d) => setCurrentSlotDevice(d)}
                  slots={slots}
                  products={products}
                  onUpdateSlot={handleUpdateSlot}
                  onBatchUpdateSlots={handleBatchUpdateSlots}
                />
              )}

              {adminMenu === 'restock' && (
                <RestockManagementPage
                  restockOrders={restockOrders}
                  devices={devices}
                  products={products}
                  onUpdateRestockOrder={handleUpdateRestockOrder}
                  onCreateRestockOrder={handleCreateRestockOrder}
                  initialSelectedOrder={currentRestockDetail}
                />
              )}

              {adminMenu === 'inventory' && (
                <InventoryManagementPage
                  products={products}
                  inventoryLogs={MOCK_INVENTORY_LOGS}
                />
              )}

              {adminMenu === 'orders' && (
                <OrderManagementPage orders={adminOrders} />
              )}

              {adminMenu === 'vision' && (
                <VisionLogPage
                  logs={visionLogs}
                  onManualOverride={handleManualVisionOverride}
                />
              )}

              {adminMenu === 'alerts' && (
                <AlertTicketsPage
                  tickets={alertTickets}
                  onUpdateTicket={handleUpdateTicket}
                />
              )}

              {adminMenu === 'clients' && (
                <ClientStorePage
                  clients={clients}
                  onUpdateClient={(updated) => {
                    setClients((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
                  }}
                />
              )}

              {adminMenu === 'reports' && <DataReportsPage />}

              {adminMenu === 'settings' && <SystemSettingsPage />}
            </main>
          </div>
        </div>
      )}

      {/* Main View: MODE 2 - Mobile Restocker App */}
      {systemMode === 'mobile_restock' && (
        <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center p-4">
          <div className="mb-3 flex items-center justify-between w-full max-w-[375px] text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              补货员现场手机端模拟 (375 × 812)
            </span>
            <button
              onClick={() => setSystemMode('admin')}
              className="text-orange-400 hover:text-orange-300 underline font-medium cursor-pointer"
            >
              返回桌面后台 →
            </button>
          </div>

          <PhoneFrame highlight={true}>
            <MobileRestockApp
              orders={restockOrders}
              onFinishOrder={(finished) => {
                handleUpdateRestockOrder(finished);
                showToast(`补货任务 ${finished.orderNo} 现场提交完成！`);
                setSystemMode('admin');
                setAdminMenu('restock');
              }}
              onExit={() => setSystemMode('admin')}
            />
          </PhoneFrame>
        </div>
      )}

      {/* Main View: MODE 3 - Consumer Frontend Mini-Program Flow */}
      {systemMode === 'consumer_flow' && (
        <div className="flex-1 bg-slate-900 flex flex-col overflow-y-auto p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto w-full mb-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">前台微信扫码小程序 (标准 App 比例 375 × 812)</span>
              <span className="text-slate-500 hidden sm:inline">| 底部导航：首页(开门页) · 我的（头像/登录用户/订单栏目）</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConsumerPanoramic(!consumerPanoramic)}
                className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 cursor-pointer"
              >
                {consumerPanoramic ? '切换为单屏交互模式' : '切换为全景浏览'}
              </button>
              <button
                onClick={() => setSystemMode('admin')}
                className="px-3 py-1 rounded bg-[#ff6900] text-white font-semibold cursor-pointer"
              >
                返回管理后台 →
              </button>
            </div>
          </div>

          {consumerPanoramic ? (
            <div className="w-full flex justify-start overflow-x-auto pb-8">
              <div className="flex items-start gap-6 px-4 mx-auto">
                <PhoneFrame
                  stepNumber={1}
                  title="首页 (开门页)"
                  subtitle="扫码开门 + 底部导航"
                  badge="Tab 1"
                >
                  <HomeScreen
                    onOpenDoorClick={() => {
                      setConsumerPanoramic(false);
                      setConsumerScreen('auth');
                    }}
                    onNavigateTab={(tab) => {
                      setConsumerPanoramic(false);
                      setConsumerScreen(tab);
                    }}
                    cabinetId={INITIAL_CABINET.id}
                  />
                </PhoneFrame>

                <PhoneFrame
                  stepNumber={2}
                  title="微信支付分授权"
                  subtitle="先选购后付款"
                  badge="弹窗"
                >
                  <AuthModalScreen
                    onClose={() => setConsumerScreen('home')}
                    onConfirmAuth={() => {
                      setConsumerPanoramic(false);
                      setConsumerScreen('shopping');
                      showToast('支付分授权成功，门锁已释放');
                    }}
                    userScore={617}
                  />
                </PhoneFrame>

                <PhoneFrame
                  stepNumber={3}
                  title="已下单状态"
                  subtitle="先选购后付款"
                  badge="流程"
                >
                  <OrderPlacedScreen
                    cabinetId={INITIAL_CABINET.id}
                    onViewOrderDetails={() => {
                      setConsumerPanoramic(false);
                      setConsumerScreen('detail');
                    }}
                    onViewOrderList={() => {
                      setConsumerPanoramic(false);
                      setConsumerScreen('orders');
                    }}
                  />
                </PhoneFrame>

                <PhoneFrame
                  stepNumber={4}
                  title="我的页面"
                  subtitle="头像 · 登录用户 · 订单栏目"
                  badge="Tab 2"
                >
                  <MineScreen
                    orders={consumerOrders}
                    onNavigateTab={(tab) => {
                      setConsumerPanoramic(false);
                      setConsumerScreen(tab);
                    }}
                    onOpenOrders={() => {
                      setConsumerPanoramic(false);
                      setConsumerScreen('orders');
                    }}
                  />
                </PhoneFrame>

                <PhoneFrame
                  stepNumber={5}
                  title="我的订单"
                  subtitle="仅展示支付成功订单"
                  badge="列表"
                >
                  <OrderListScreen
                    orders={consumerOrders}
                    onSelectOrder={(ord) => {
                      setConsumerSelectedOrder(ord);
                      setConsumerPanoramic(false);
                      setConsumerScreen('detail');
                    }}
                    onBack={() => {
                      setConsumerPanoramic(false);
                      setConsumerScreen('mine');
                    }}
                  />
                </PhoneFrame>

                <PhoneFrame
                  stepNumber={6}
                  title="订单详情"
                  subtitle="单号/价格/图片/名称/创建/开门时间"
                  badge="详情"
                >
                  <OrderDetailsScreen
                    order={consumerSelectedOrder}
                    onBack={() => {
                      setConsumerPanoramic(false);
                      setConsumerScreen('orders');
                    }}
                  />
                </PhoneFrame>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="mb-3 flex flex-wrap items-center justify-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
                {[
                  { id: 'home', label: '首页(开门)' },
                  { id: 'auth', label: '支付分授权' },
                  { id: 'shopping', label: '已下单' },
                  { id: 'mine', label: '我的' },
                  { id: 'orders', label: '我的订单' },
                  { id: 'detail', label: '订单详情' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setConsumerScreen(s.id as ScreenId)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      consumerScreen === s.id
                        ? 'bg-[#ff6900] text-white font-semibold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <PhoneFrame highlight={true}>
                {consumerScreen === 'home' && (
                  <HomeScreen
                    onOpenDoorClick={() => setConsumerScreen('auth')}
                    onNavigateTab={(tab) => setConsumerScreen(tab)}
                    cabinetId={INITIAL_CABINET.id}
                  />
                )}
                {consumerScreen === 'auth' && (
                  <AuthModalScreen
                    onClose={() => setConsumerScreen('home')}
                    onConfirmAuth={() => {
                      setConsumerScreen('shopping');
                      showToast('支付分授权成功，门锁已释放');
                    }}
                    userScore={617}
                  />
                )}
                {consumerScreen === 'shopping' && (
                  <OrderPlacedScreen
                    cabinetId={INITIAL_CABINET.id}
                    onViewOrderDetails={() => setConsumerScreen('detail')}
                    onViewOrderList={() => setConsumerScreen('orders')}
                  />
                )}
                {consumerScreen === 'mine' && (
                  <MineScreen
                    orders={consumerOrders}
                    onNavigateTab={(tab) => setConsumerScreen(tab)}
                    onOpenOrders={() => setConsumerScreen('orders')}
                  />
                )}
                {consumerScreen === 'orders' && (
                  <OrderListScreen
                    orders={consumerOrders}
                    onSelectOrder={(o) => {
                      setConsumerSelectedOrder(o);
                      setConsumerScreen('detail');
                    }}
                    onBack={() => setConsumerScreen('mine')}
                  />
                )}
                {consumerScreen === 'detail' && (
                  <OrderDetailsScreen
                    order={consumerSelectedOrder}
                    onBack={() => setConsumerScreen('orders')}
                  />
                )}
              </PhoneFrame>
            </div>
          )}
        </div>
      )}

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
