import { useEffect, useRef } from 'react'

/**
 * Custom hook to ensure a fetch operation only runs once per unique identifier
 * Prevents duplicate API calls on component re-renders
 */
export function useFetchOnce<T>(
  fetchFn: () => Promise<T>,
  identifier: string | null | undefined,
  dependencies: any[] = []
) {
  const fetchedIds = useRef<Set<string>>(new Set())
  const isFetchingRef = useRef(false)

  useEffect(() => {
    if (!identifier || fetchedIds.current.has(identifier) || isFetchingRef.current) {
      return
    }

    isFetchingRef.current = true
    fetchedIds.current.add(identifier)

    fetchFn()
      .catch((error) => {
        // Remove from fetched set on error so it can be retried
        fetchedIds.current.delete(identifier)
        console.error('Fetch error:', error)
      })
      .finally(() => {
        isFetchingRef.current = false
      })
  }, [identifier, ...dependencies])

  // Cleanup function to reset state
  const reset = () => {
    fetchedIds.current.clear()
    isFetchingRef.current = false
  }

  return { reset }
}
