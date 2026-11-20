export interface ProductItem {
  id: string;
  name: string;
  spec: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  stock: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  spec: string;
  price: number;
  quantity: number;
  image: string;
}

export type OrderStatus = '已支付' | '挂起' | '异常' | '已退款' | '部分退款';

export interface Order {
  id: string;
  cabinetId: string;
  cabinetName: string;
  status: OrderStatus;
  tag?: '非友好' | '正常' | '新用户';
  createdAt: string;
  openTime: string;
  payTime?: string;
  items: OrderItem[];
  totalAmount: number;
  discountAmount: number;
  eventId: string;
  channel: string;
  paymentMethod: string;
  userPhone: string;
  userId: string;
  notes?: string;
  inBlacklist?: boolean;
}

export type ScreenId = 'home' | 'auth' | 'shopping' | 'mine' | 'orders' | 'detail';

export interface CabinetState {
  id: string;
  name: string;
  address: string;
  score: number;
  doorOpen: boolean;
  statusText: string;
}
