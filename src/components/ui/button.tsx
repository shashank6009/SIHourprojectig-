import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gov-navy text-white hover:bg-gov-blue shadow-sm hover:shadow-md transition-all duration-200",
        secondary: "bg-gov-gray text-gov-text hover:bg-gray-200 shadow-sm",
        outline: "border border-gov-navy text-gov-navy hover:bg-gov-navy hover:text-white shadow-sm hover:shadow-md transition-all duration-200",
        ghost: "hover:bg-gov-gray hover:text-gov-text",
        link: "text-gov-navy underline-offset-4 hover:underline",
        saffron: "bg-gov-saffron text-white hover:bg-secondary-600 shadow-sm hover:shadow-md transition-all duration-200",
        green: "bg-gov-green text-white hover:bg-success-600 shadow-sm hover:shadow-md transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
