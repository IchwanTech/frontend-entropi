import axios from "axios";
import type {
  ApiResponse,
  OrderSummary,
  LedgerEntry,
  SettlementSummary,
} from "@/types/api.types";

const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10_000,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message ?? err.message ?? "API error";
    return Promise.reject(new Error(message));
  },
);

const apiGet = async <T>(path: string): Promise<T> => {
  const res = await http.get<ApiResponse<T>>(path);
  return res.data.data;
};

const apiPost = async <T>(
  path: string,
  body: unknown,
  extraHeaders?: Record<string, string>,
): Promise<T> => {
  const res = await http.post<ApiResponse<T>>(path, body, {
    headers: extraHeaders,
  });
  return res.data.data;
};

export const apiClient = {
  // Orders
  getOrders: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) params.set("status", status);
    return apiGet<{ orders: OrderSummary[]; total: number }>(
      `/orders?${params}`,
    );
  },

  getOrder: (id: string) => apiGet<OrderSummary>(`/orders/${id}`),

  createOrder: (
    body: {
      orderId: string;
      customerId: string;
      amount: string;
      paymentMethod: string;
    },
    idempotencyKey: string,
  ) =>
    apiPost<OrderSummary>("/orders", body, {
      "Idempotency-Key": idempotencyKey,
    }),

  payOrder: (id: string, customerId: string, idempotencyKey: string) =>
    apiPost<{ payment: unknown; order: OrderSummary }>(
      `/orders/${id}/pay`,
      { customerId },
      { "Idempotency-Key": idempotencyKey },
    ),

  shipOrder: (id: string, trackingNumber: string, idempotencyKey: string) =>
    apiPost<{ data: OrderSummary }>(
      `/orders/${id}/ship`,
      { trackingNumber },
      { "Idempotency-Key": idempotencyKey },
    ),

  getEvents: (orderId: string) =>
    apiGet<unknown[]>(`/orders/${orderId}/events`),

  // Ledger
  getLedger: (orderId: string) =>
    apiGet<LedgerEntry[]>(`/orders/${orderId}/ledger`),

  verifyLedger: (orderId: string) =>
    apiGet<{ balanced: boolean; difference: string }>(
      `/verify-ledger/${orderId}`,
    ),

  // Settlement
  settle: (date: string, idempotencyKey: string) =>
    apiPost<SettlementSummary>(
      "/settle",
      { date },
      { "Idempotency-Key": idempotencyKey },
    ),

  getSettlement: (date: string) => apiGet<SettlementSummary>(`/settle/${date}`),
};
