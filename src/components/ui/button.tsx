import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * --- Devoteam Theme Customization ---
 *
 * This button component has been customized to align with the Devoteam brand identity.
 *
 * Key changes include:
 * - `variant`: Styles are mapped to Devoteam's color palette (Red Poppy, Greys, etc.).
 * - `gradient`: The 'default' and 'destructive' variants now feature a subtle gradient for a professional, artistic finish.
 * - `font`: Uses 'font-semibold' as a base and 'font-bold' for the primary 'default' variant.
 * - `shadows`: Added `shadow-md` and `hover:shadow-lg` to primary and destructive buttons for depth.
 * - `transitions`: Enhanced transitions for a smoother, more interactive feel.
 * - `active state`: Added an `active:scale-[0.98]` transform for a tactile press effect.
 * - `sizing`: Slightly increased button heights and padding for a modern, accessible feel.
 * - `radius`: Changed to `rounded-lg` to match the global 0.5rem radius.
 */
const buttonVariants = cva(
  // Base styles for all buttons, customized for Devoteam
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // Primary Call-to-Action: A Red Poppy gradient, bold, with shadow for prominence.
        default:
          "bg-gradient-to-br from-[#f8485e] to-[#d7374a] text-primary-foreground font-bold shadow-md hover:shadow-lg hover:brightness-110",
        
        // Destructive actions: Also uses the Red Poppy gradient for a consistent, high-visibility style.
        destructive:
          "bg-gradient-to-br from-[#f8485e] to-[#d7374a] text-destructive-foreground font-bold shadow-md hover:shadow-lg hover:brightness-110",
        
        // Outline button: Emphasizes the action without a solid background. Fills on hover for clear feedback.
        outline:
          "border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground",
        
        // Secondary button: Light grey, for less prominent actions like 'Cancel' or secondary choices.
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        
        // Ghost button: Minimalist style, used for actions within a component (e.g., card actions).
        ghost: "text-primary hover:bg-accent",
        
        // Link button: Standard link appearance, but uses the primary brand color.
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Adjusted sizes for a slightly larger, more modern and accessible feel.
        default: "h-10 px-5",
        sm: "h-9 px-3",
        lg: "h-11 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
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
