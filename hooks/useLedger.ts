'use client'

import { useState, useEffect, useCallback } from 'react'
import { apiClient } from '@/lib/api-client'
import type { LedgerEntry } from '@/types/api.types'

export function useLedger(orderId: string) {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [isBalanced, setIsBalanced] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLedger = useCallback(async () => {
    try {
      setIsLoading(true)
      const [trail, verify] = await Promise.all([
        apiClient.getLedger(orderId),
        apiClient.verifyLedger(orderId).catch(() => null),
      ])
      setEntries(trail)
      setIsBalanced(verify?.balanced ?? null)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ledger')
    } finally {
      setIsLoading(false)
    }
  }, [orderId])

  useEffect(() => { fetchLedger() }, [fetchLedger])

  return { entries, isBalanced, isLoading, error, refetch: fetchLedger }
}
