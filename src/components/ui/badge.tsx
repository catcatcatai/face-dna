import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border border-transparent px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-[var(--cat-accent)] text-[var(--bg)] [a&]:hover:opacity-80",
        secondary:
          "bg-[var(--surface-2)] text-[var(--text-dim)] border-[var(--cat-border)] [a&]:hover:bg-[var(--surface)]",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90",
        outline:
          "border-[var(--cat-border)] text-[var(--text)] [a&]:hover:bg-[rgba(0,0,0,0.06)]",
        ghost: "[a&]:hover:bg-[rgba(0,0,0,0.06)] [a&]:hover:text-[var(--text)]",
        link: "text-[var(--text)] underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
