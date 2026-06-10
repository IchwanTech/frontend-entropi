"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { apiClient } from "@/lib/api-client";
import type { OrderSummary } from "@/types/api.types";

const TERMINAL_STATES = new Set(["DELIVERED", "REFUNDED", "FAILED"]);
const POLL_INTERVAL = 3000;

export const useOrderPolling = (
  orderId: string,
  initialData?: OrderSummary,
) => {
  const [order, setOrder] = useState<OrderSummary | null>(initialData ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrder = useCallback(async () => {
    try {
      const data = await apiClient.getOrder(orderId);
      setOrder(data);
      setError(null);

      if (TERMINAL_STATES.has(data.status) && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch order");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();

    if (!initialData || !TERMINAL_STATES.has(initialData.status)) {
      intervalRef.current = setInterval(fetchOrder, POLL_INTERVAL);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fetchOrder, initialData]);

  return { order, error, isLoading, refetch: fetchOrder };
};
