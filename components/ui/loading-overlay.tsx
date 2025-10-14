"use client"

import { useEffect, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"

export type LoadingOverlayProps = {
  visible: boolean
  // 0..100; if undefined, show an indeterminate bar animation
  progress?: number
}

export function LoadingOverlay({ visible, progress }: LoadingOverlayProps) {
  const isDeterminate = typeof progress === "number"

  // Provide a minimal indeterminate animation via CSS if not determinate
  const barClass = useMemo(() => {
    return cn(
      "h-1.5 w-48 rounded-full bg-primary/20 overflow-hidden",
      !isDeterminate && "relative"
    )
  }, [isDeterminate])

  useEffect(() => {
    // no-op placeholder to avoid React complaining about hooks ordering if expanded later
  }, [])

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "pointer-events-none fixed inset-0 z-50 grid place-items-center bg-background/60 backdrop-blur-sm transition-opacity",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="flex w-[16rem] max-w-[80vw] flex-col items-center gap-3 rounded-lg border bg-card p-6 shadow-xl">
        <div className="text-sm text-muted-foreground">Loading…</div>
        {isDeterminate ? (
          <div className="w-full">
            <Progress value={Math.max(0, Math.min(100, progress ?? 0))} />
          </div>
        ) : (
          <div className={barClass}>
            <div className="absolute inset-y-0 left-0 w-1/3 animate-[loadingSweep_1.2s_ease-in-out_infinite] bg-primary" />
            <style jsx global>{`
              @keyframes loadingSweep {
                0% { transform: translateX(-120%); }
                50% { transform: translateX(50%); }
                100% { transform: translateX(120%); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  )
}
