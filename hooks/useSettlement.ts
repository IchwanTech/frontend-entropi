'use client'

import { useState } from 'react'
import { apiClient } from '@/lib/api-client'
import type { SettlementSummary } from '@/types/api.types'

export const useSettlement = () => {
  const [result, setResult] = useState<SettlementSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isIdempotent, setIsIdempotent] = useState(false)
  const [lastAction, setLastAction] = useState<'run' | 'check' | null>(null)

  const runSettlement = async (date: string) => {
    setIsLoading(true)
    setError(null)
    setLastAction('run')
    try {
      const key = `settle-${date}-${Date.now()}`
      const data = await apiClient.settle(date, key)
      setResult(data)
      setIsIdempotent((data as any).idempotent ?? false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Settlement failed')
    } finally {
      setIsLoading(false)
    }
  }

  const checkSettlement = async (date: string) => {
    setIsLoading(true)
    setError(null)
    setLastAction('check')
    try {
      const data = await apiClient.getSettlement(date)
      setResult(data)
      setIsIdempotent(true)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No settlement found for this date',
      )
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setResult(null)
    setError(null)
    setIsIdempotent(false)
    setLastAction(null)
  }

  return { result, isLoading, error, isIdempotent, lastAction, runSettlement, checkSettlement, reset }
}
