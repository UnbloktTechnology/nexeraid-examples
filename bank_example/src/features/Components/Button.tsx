import { forwardRef } from "react";
import classNames from "classnames";

interface IButton extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

export const Button: React.FC<IButton> = forwardRef<HTMLButtonElement, IButton>(
    (
        {
            ...props
        }, ref
    ) => {
        return (
            <button
                ref={ref}
                type="submit"
                {...props}
                className={classNames([
                    'cursor-pointer bg-[#DB0011] px-6 py-4 text-white  text-base font-normal',
                    props.className,
                ])}
            >
                {props.children}
            </button>
        );
    })

Button.displayName = 'Button'