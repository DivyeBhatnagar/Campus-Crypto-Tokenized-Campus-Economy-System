import * as React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success"
  size?: "sm" | "md" | "lg"
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "neumorphic-card inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          {
            "border-transparent bg-primary text-primary-foreground shadow-neumorphic-sm": variant === "default",
            "border-transparent bg-secondary text-secondary-foreground shadow-neumorphic-sm": variant === "secondary", 
            "border-transparent bg-destructive text-destructive-foreground shadow-neumorphic-sm": variant === "destructive",
            "text-foreground shadow-neumorphic-sm": variant === "outline",
            "border-transparent bg-green-500 text-white shadow-neumorphic-sm": variant === "success",
          },
          {
            "h-5 px-2 text-xs": size === "sm",
            "h-6 px-2.5 text-xs": size === "md", 
            "h-7 px-3 text-sm": size === "lg",
          },
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }