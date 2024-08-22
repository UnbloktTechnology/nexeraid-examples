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
    let hoverClasses = "";

    if (variant === "primary") {
      variantClasses = "bg-blue-600 text-white";
      hoverClasses = "hover:bg-blue-700"; // Primary button hover styles
    } else if (variant === "secondary") {
      variantClasses = "bg-white text-black";
      hoverClasses = "hover:bg-gray-100"; // Secondary button hover styles
    }

    return (
      <button
        ref={ref}
        type="submit"
        {...props}
        className={`rounded-full px-4 py-2 font-medium shadow ${variantClasses} ${className} ${
          (props.disabled ?? isLoading)
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer"
        } ${(props.disabled ?? isLoading) ? "" : hoverClasses}`}
        disabled={props.disabled ?? isLoading}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
