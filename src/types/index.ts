export type OrderStatus =
  | 'all'
  | 'awaiting_payment'
  | 'review'
  | 'confirmed'
  | 'packing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  title: string;
  sku: string;
  qty: number;
  price: number;
  image: string;
  color?: string;
  size?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. #1030
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  channel: 'online' | 'phone' | 'viber' | 'messenger';
  channelLabel: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  paymentMethod: 'kpay_qr' | 'kpay_slip' | 'wavepay_qr' | 'wavepay_slip' | 'ayapay' | 'cod' | 'auto_expired';
  paymentMethodLabel: string;
  paymentSlipUrl?: string;
  transactionId?: string;
  status: OrderStatus;
  statusLabel: string;
  timeAgo: string;
  createdAt: string;
  internalNote?: string;
  timeoutSecondsRemaining?: number;
}

export interface ColorwayStock {
  colorName: string;
  colorHex: string;
  batchCode: string;
  sizes: {
    S: number;
    M: number;
    L: number;
    XL: number;
    Free: number;
  };
}

export interface Product {
  sku: string; // e.g. P001
  title: string;
  englishTitle?: string;
  cutDescription: string;
  category: 'sarong' | 'blouse' | 'fabric' | 'accessories';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  image: string;
  badgeTag?: string;
  variantsSummary: string;
  stockCount: number;
  stockUnit: string;
  tags: string[];
  status: 'Published' | 'Restocking' | 'Draft';
  colorways: ColorwayStock[];
}

export interface CustomerTimelineItem {
  code: string;
  desc: string;
  date: string;
  amount: string;
  status: string;
}

export interface Customer {
  id: string;
  name: string;
  initial: string;
  avatarBg: string;
  phone: string;
  city: string;
  district: string;
  address: string;
  social: string;
  tag: 'VIP' | 'Wholesale' | 'Regular';
  tagLabel: string;
  tagSub?: string;
  orderCount: number;
  totalSpent: number;
  notes: string;
  timeline: CustomerTimelineItem[];
}

export interface ActivityLog {
  id: string;
  role: string;
  name: string;
  time: string;
  text: string;
  highlight?: string;
  dotColor: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  roleKey: string;
  phone: string;
  email: string;
  shift: string;
  avatarBg: string;
  status: 'active' | 'on_break' | 'off_duty';
}
