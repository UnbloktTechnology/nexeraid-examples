import { forwardRef } from "react";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  variant: "primary" | "secondary";
}

export const Button: React.FC<IButton> = forwardRef<HTMLButtonElement, IButton>(
  (
    { isLoading, children, className, variant = "secondary", ...props },
    ref,
  ) => {
    let variantClasses = "";

    if (variant === "primary") {
      variantClasses = "bg-blue-600 text-white hover:bg-blue-700"; // Primary button styles
    } else if (variant === "secondary") {
      variantClasses = "bg-white text-black hover:bg-gray-100"; // Secondary button styles
    }

    return (
      <button
        ref={ref}
        type="submit"
        {...props}
        className={`cursor-pointer rounded-full px-4 py-2 font-medium shadow ${variantClasses} ${className} ${
          isLoading ? "cursor-not-allowed opacity-50" : ""
        }`}
        disabled={isLoading ?? props.disabled}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
