import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const hulyButtonVariants = cva(
  "hulyButton inline-flex justify-center items-center flex-shrink-0 gap-1 border border-transparent font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "primary bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-100 focus:ring-gray-500",
        secondary: "secondary bg-white dark:bg-gray-900 text-black dark:text-white border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus:ring-gray-300",
        tertiary: "tertiary bg-transparent text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-300",
        negative: "negative bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        ghost: "ghost bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-black dark:text-white",
      },
      size: {
        large: "large h-10 px-4 text-sm rounded-md",
        medium: "medium h-8 px-3 text-sm rounded-md", 
        small: "small h-7 px-2 text-xs rounded-sm gap-0.5",
        "extra-small": "extra-small h-6 px-2 text-xs rounded-sm gap-0.5",
        min: "min h-5 px-1 text-xs rounded-sm border-0",
      },
      iconOnly: {
        true: "iconOnly p-0",
        false: "",
      },
      round: {
        true: "round",
        false: "",
      },
      loading: {
        true: "loading",
        false: "",
      },
      // Removed disabled from variants to prevent conflict with ButtonHTMLAttributes
    },
    compoundVariants: [
      {
        size: "large",
        iconOnly: true,
        className: "w-10",
      },
      {
        size: "medium", 
        iconOnly: true,
        className: "w-8",
      },
      {
        size: "small",
        iconOnly: true,
        className: "w-7",
      },
      {
        size: "extra-small",
        iconOnly: true,
        className: "w-6",
      },
      {
        size: "min",
        iconOnly: true,
        className: "w-5",
      },
      {
        round: true,
        size: "large",
        className: "rounded-lg",
      },
      {
        round: true,
        size: "medium",
        className: "rounded-lg",
      },
      {
        round: true,
        size: "small",
        className: "rounded-lg",
      },
    ],
    defaultVariants: {
      variant: "secondary",
      size: "medium",
      iconOnly: false,
      round: false,
      loading: false,
    },
  }
)

export interface HulyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof hulyButtonVariants> {
  asChild?: boolean
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const HulyButton = React.forwardRef<HTMLButtonElement, HulyButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    iconOnly, 
    round, 
    loading, 
    disabled = false, 
    asChild = false, 
    icon, 
    rightIcon, 
    children, 
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(hulyButtonVariants({ variant, size, iconOnly, round, loading, className }))}
        ref={ref}
        disabled={Boolean(disabled) || Boolean(loading)}
        {...props}
      >
        {loading && (
          <div className="icon animate-spin">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
        {!loading && icon && <div className="icon flex items-center justify-center min-w-[10px] min-h-[10px]">{icon}</div>}
        {children && !iconOnly && <span className="whitespace-nowrap">{children}</span>}
        {!loading && rightIcon && <div className="icon flex items-center justify-center min-w-[10px] min-h-[10px]">{rightIcon}</div>}
      </Comp>
    )
  }
)
HulyButton.displayName = "HulyButton"

export { HulyButton, hulyButtonVariants }
