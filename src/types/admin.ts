// Administrative types for the Brand Vending Operations Management System

export type OnlineStatus = 'online' | 'offline';
export type DoorStatus = 'closed' | 'open' | 'unlocked';
export type NetType = '4G' | '5G' | 'Wi-Fi' | 'Ethernet';
export type DeviceAlertStatus = 'normal' | 'warning' | 'critical';

export interface Device {
  id: string;
  code: string; // e.g. "856565"
  name: string;
  clientId: string;
  clientName: string;
  storeId: string;
  storeName: string;
  model: string;
  onlineStatus: OnlineStatus;
  netType: NetType;
  signalStrength: number; // 0-100%
  doorStatus: DoorStatus;
  temperature: number; // e.g. 4.2 °C
  targetTemp: number; // e.g. 4.0 °C
  alertStatus: DeviceAlertStatus;
  lastHeartbeat: string;
  firmwareVersion: string;
  totalSlots: number;
  emptySlotsCount: number;
  stockRate: number; // percentage e.g. 78%
  volume: number; // 0-100
  locked: boolean;
  address: string;
}

export interface ProductSKU {
  id: string;
  sku: string;
  name: string;
  spec: string;
  barcode: string;
  category: string;
  costPrice: number;
  sellingPrice: number;
  status: 'on_shelf' | 'off_shelf';
  image: string;
  visionTrained: boolean;
  featureCode: string;
  shelfLifeDays: number;
  totalStockAllDevices: number;
  monthlySales: number;
}

export interface SlotChannel {
  id: string;
  deviceId: string;
  slotNumber: string; // e.g. "1-1", "1-2", "2-1"
  floor: number; // 1-4
  column: number; // 1-5
  productId: string;
  productName: string;
  productImage: string;
  capacity: number; // e.g. 10
  currentStock: number; // e.g. 4
  minStockThreshold: number; // e.g. 2
  sellingPrice: number;
  status: 'normal' | 'fault' | 'disabled';
  lastRefillTime: string;
}

export type RestockStatus =
  | 'draft'
  | 'pending_dispatch'
  | 'pending_restock'
  | 'in_progress'
  | 'completed'
  | 'anomaly'
  | 'cancelled';

export interface RestockItem {
  slotNumber: string;
  productId: string;
  productName: string;
  productImage: string;
  capacity: number;
  currentStock: number;
  suggestedQty: number; // should replenish
  actualQty: number; // actual replenished
  diffQty: number; // actual - suggested
  status: 'pending' | 'completed' | 'exception';
  exceptionReason?: '少补' | '错补' | '货道故障' | '商品破损';
  note?: string;
}

export interface RestockOrder {
  id: string;
  orderNo: string; // e.g. "RS-20260616-008"
  deviceId: string;
  deviceCode: string;
  deviceName: string;
  clientId: string;
  clientName: string;
  storeId: string;
  storeName: string;
  operatorId?: string;
  operatorName?: string;
  operatorPhone?: string;
  skuCount: number;
  targetTotalQty: number;
  actualTotalQty: number;
  status: RestockStatus;
  createdAt: string;
  deadline: string;
  completedAt?: string;
  items: RestockItem[];
  hasException: boolean;
  exceptionSummary?: string;
}

export interface InventoryLog {
  id: string;
  time: string;
  deviceCode: string;
  productName: string;
  type: '销售出库' | '补货入库' | '损耗盘亏' | '盘盈调整';
  qtyChange: number; // -1, +8
  afterStock: number;
  operator: string;
  orderId?: string;
}

export interface AdminOrder {
  id: string;
  orderNo: string;
  deviceId: string;
  deviceCode: string;
  deviceName: string;
  storeName: string;
  items: {
    productId: string;
    productName: string;
    spec: string;
    price: number;
    qty: number;
    subtotal: number;
  }[];
  originalAmount: number;
  discountAmount: number;
  payAmount: number;
  payStatus: 'SUCCESS' | 'REFUNDED' | 'PARTIAL_REFUND' | 'FAILED';
  payChannel: string; // e.g. "微信代扣直连商户"
  callbackStatus: 'SUCCESS' | 'RETRYING' | 'FAILED';
  callbackTime: string;
  userPhone: string;
  createdAt: string;
  isAnomaly: boolean;
  anomalyReason?: string;
}

export interface VisionLog {
  id: string;
  time: string;
  deviceCode: string;
  doorEventId: string;
  imageSnapshot: string;
  detectedProduct: string;
  confidence: number; // e.g. 0.985
  finalProduct: string;
  amount: number;
  isManualOverride: boolean;
  overrideBy?: string;
  status: 'SUCCESS' | 'UNCERTAIN' | 'FAILED';
  failReason?: string;
}

export interface AlertTicket {
  id: string;
  ticketNo: string;
  type: '温度过高' | '连续关门异常' | '设备离线' | '重力传感器漂移' | '缺货率严重预警';
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  deviceId: string;
  deviceCode: string;
  deviceName: string;
  storeName: string;
  triggerTime: string;
  status: 'PENDING' | 'PROCESSING' | 'RESOLVED' | 'CLOSED';
  handlerName?: string;
  resolutionNote?: string;
}

export interface ClientStore {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  devicesCount: number;
  stores: {
    id: string;
    name: string;
    address: string;
    devicesCount: number;
  }[];
  apiConfig: {
    appId: string;
    appSecret: string;
    webhookUrl: string;
    status: 'ACTIVE' | 'DISABLED';
  };
}

export type AdminMenuKey =
  | 'workbench'
  | 'devices'
  | 'products'
  | 'slots'
  | 'restock'
  | 'inventory'
  | 'orders'
  | 'vision'
  | 'alerts'
  | 'clients'
  | 'reports'
  | 'settings';
