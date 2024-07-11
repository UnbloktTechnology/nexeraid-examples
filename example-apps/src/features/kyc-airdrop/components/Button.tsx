import { forwardRef } from "react";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const Button: React.FC<IButton> = forwardRef<HTMLButtonElement, IButton>(
  ({ isLoading, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="submit"
        {...props}
        className={`ounded-full cursor-pointer bg-white px-4 py-2 font-medium text-black shadow hover:bg-gray-100 ${className} ${isLoading ? "cursor-not-allowed opacity-50" : ""}`}
        disabled={isLoading ?? props.disabled}
      >
        {isLoading ? "Loading..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
