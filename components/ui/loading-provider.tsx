"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { LoadingOverlay } from "@/components/ui/loading-overlay"
import { usePathname, useRouter } from "next/navigation"

export type LoadingContextValue = {
  isVisible: boolean
  progress: number | undefined
  start: (opts?: { determinate?: boolean }) => void
  stop: () => void
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>
}

const LoadingContext = createContext<LoadingContextValue | null>(null)

// A simple fake-progress algorithm for better perceived performance
function useFakeProgress(active: boolean) {
  const [progress, setProgress] = useState<number | undefined>(undefined)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!active) {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
      setProgress(undefined)
      return
    }

    setProgress(10)
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        const current = typeof prev === "number" ? prev : 0
        // Slow down as we approach 90
        const increment = current < 50 ? 10 : current < 80 ? 5 : 2
        const next = Math.min(90, current + increment)
        return next
      })
    }, 300)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [active])

  const complete = useCallback(() => {
    if (!active) return setProgress(undefined)
    setProgress(100)
    // allow users to perceive completion
    const timeout = setTimeout(() => setProgress(undefined), 300)
    return () => clearTimeout(timeout)
  }, [active])

  return { progress, complete }
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [activeCount, setActiveCount] = useState(0)
  const [manualDeterminate, setManualDeterminate] = useState(false)
  const isVisible = activeCount > 0
  const { progress, complete } = useFakeProgress(isVisible && !manualDeterminate)
  const pathname = usePathname()
  const router = useRouter()

  const start = useCallback((opts?: { determinate?: boolean }) => {
    setManualDeterminate(Boolean(opts?.determinate))
    setActiveCount((count) => count + 1)
  }, [])

  const stop = useCallback(() => {
    complete()
    const timeout = setTimeout(() =>
      setActiveCount((count) => Math.max(0, count - 1))
    , 350)
    return () => clearTimeout(timeout)
  }, [complete])

  // Auto-stop when route path changes (navigation completed)
  const lastPathRef = useRef(pathname)
  useEffect(() => {
    if (lastPathRef.current !== pathname) {
      lastPathRef.current = pathname
      stop()
    }
  }, [pathname, stop])

  // Expose helper that wraps any async operation
  const withLoading = useCallback(async <T,>(fn: () => Promise<T>) => {
    start()
    try {
      const result = await fn()
      return result
    } finally {
      stop()
    }
  }, [start, stop])

  const value = useMemo<LoadingContextValue>(() => ({
    isVisible,
    progress: manualDeterminate ? undefined : progress,
    start,
    stop,
    withLoading,
  }), [isVisible, manualDeterminate, progress, start, stop, withLoading])

  // Enable auto instrumentation for fetch
  useFetchInstrumentation(start, stop)

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <LoadingOverlay visible={isVisible} progress={value.progress} />
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const ctx = useContext(LoadingContext)
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider")
  return ctx
}

export function useLoadingOptional() {
  return useContext(LoadingContext)
}

// Instrument global fetch to show the overlay while network requests are in-flight
// Only active while within this provider's lifecycle
function useFetchInstrumentation(start: () => void, stop: () => void) {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.fetch) return
    const originalFetch = window.fetch.bind(window)
    let isUnmounted = false
    let pending = 0

    // Wrap fetch
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wrapped: typeof window.fetch = async (...args: any[]) => {
      pending += 1
      if (pending === 1) start()
      try {
        // @ts-expect-error - spread args passthrough
        return await originalFetch(...args)
      } finally {
        pending -= 1
        if (!isUnmounted && pending === 0) stop()
      }
    }

    // Install wrapper
    const globalObj = window as unknown as { fetch: typeof window.fetch }
    const previous = globalObj.fetch
    globalObj.fetch = wrapped

    return () => {
      isUnmounted = true
      globalObj.fetch = previous
    }
  }, [start, stop])
}
