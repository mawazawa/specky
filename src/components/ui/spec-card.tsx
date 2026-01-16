import * as React from "react"
import { cn } from "@/lib/utils"

const SpecCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border border-white/5 bg-card text-card-foreground shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-[0_0_30px_-10px_rgba(var(--color-primary),0.2)]",
      className
    )}
    {...props}
  />
))
SpecCard.displayName = "SpecCard"

const SpecCardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
SpecCardHeader.displayName = "SpecCardHeader"

const SpecCardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight text-xl bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent", className)}
    {...props}
  />
))
SpecCardTitle.displayName = "SpecCardTitle"

const SpecCardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SpecCardDescription.displayName = "SpecCardDescription"

const SpecCardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
SpecCardContent.displayName = "SpecCardContent"

const SpecCardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
SpecCardFooter.displayName = "SpecCardFooter"

export { SpecCard, SpecCardHeader, SpecCardFooter, SpecCardTitle, SpecCardDescription, SpecCardContent }
