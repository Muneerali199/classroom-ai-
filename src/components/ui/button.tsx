import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "neumorphic-button text-gray-700 hover:scale-105 active:scale-95",
        destructive: "neumorphic-button text-red-700 hover:scale-105 active:scale-95",
        outline: "neumorphic-sm text-gray-700 hover:neumorphic-sm-inset hover:scale-105 active:scale-95",
        secondary: "neumorphic-sm text-gray-700 hover:neumorphic-sm-inset hover:scale-105 active:scale-95",
        ghost: "neumorphic-badge text-gray-600 hover:text-gray-700 hover:scale-105 active:scale-95",
        link: "text-primary underline-offset-4 hover:underline",
        neumorphic: "neumorphic-button text-gray-700 hover:scale-105 active:scale-95",
        "neumorphic-sm": "neumorphic-sm text-gray-700 hover:neumorphic-sm-inset hover:scale-105 active:scale-95",
        "neumorphic-inset": "neumorphic-sm-inset text-gray-700 hover:neumorphic-sm hover:scale-105 active:scale-95",
      },
      size: {
        default: "h-12 px-6 py-3 rounded-xl",
        sm: "h-10 px-4 py-2 rounded-lg",
        lg: "h-14 px-8 py-4 rounded-2xl text-base",
        icon: "h-12 w-12 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "neumorphic",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
