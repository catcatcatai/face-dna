import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-[var(--text-dim)] selection:bg-primary selection:text-primary-foreground border-[var(--cat-border)] bg-[var(--surface-2)] text-[var(--text)] h-9 w-full min-w-0 rounded-lg border px-3 py-1 text-base transition-[color,border-color] duration-[200ms] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 md:text-sm",
        "focus-visible:border-[var(--text-dim)]",
        "aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  )
}

export { Input }
