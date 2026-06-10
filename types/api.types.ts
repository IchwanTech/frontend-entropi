export type OrderStatus =
  | "PENDING"
  | "PAYMENT_PROCESSING"
  | "PAYMENT_CONFIRMED"
  | "FEE_CALCULATED"
  | "SHIPPED"
  | "DELIVERED"
  | "REFUNDED"
  | "FAILED";

export type AccountType =
  | "order_balance"
  | "order_pending"
  | "payment_received"
  | "fees_owed"
  | "seller_payout";

export interface OrderSummary {
  id: string;
  customerId: string;
  amount: string;
  fee: string;
  payout: string;
  paymentMethod: string;
  status: OrderStatus;
  version: number;
  lastEventType: string | null;
  lastEventAt: string | null;
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  account: AccountType;
  debit: string | null;
  credit: string | null;
  runningBalance: string;
  description: string | null;
  timestamp: string;
}

export interface SettlementSummary {
  date: string;
  totalOrders: number;
  totalRevenue: string;
  totalFees: string;
  totalPayout: string;
  settledAt: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  message: string;
}
