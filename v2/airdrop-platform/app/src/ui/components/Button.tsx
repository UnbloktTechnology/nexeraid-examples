import { forwardRef } from "react";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
  variant: "primary" | "secondary" | "transparent";
}

export const Button: React.FC<IButton> = forwardRef<HTMLButtonElement, IButton>(
  (
    { isLoading, children, className, variant = "secondary", ...props },
    ref,
  ) => {
    let variantClasses = "";
    let hoverClasses = "";

    if (variant === "primary") {
      variantClasses = "bg-[#6666FE] text-white";
      hoverClasses = "hover:bg-[#6666FE]/85"; // Primary button hover styles
    } else if (variant === "secondary") {
      variantClasses = "bg-white text-black";
      hoverClasses = "hover:bg-gray-100"; // Secondary button hover styles
    } else if (variant === "transparent") {
      variantClasses = "bg-transparent text-white";
      hoverClasses = "hover:bg-gray-100 hover:text-black"; // Transparent button hover styles
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
