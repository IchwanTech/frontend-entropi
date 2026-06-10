'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import type { OrderSummary } from '@/types/api.types'

export const useOrders = (page: number, status: string) => {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    apiClient
      .getOrders(page, 20, status || undefined)
      .then(({ orders, total }) => {
        setOrders(orders)
        setTotal(total)
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [page, status])

  return { orders, total, isLoading, error }
}
