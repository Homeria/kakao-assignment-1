import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#672be0] text-white hover:bg-[#5622be]",
  secondary: "border border-slate-300 text-slate-700 hover:bg-slate-100",
  danger: "border border-red-200 text-red-600 hover:bg-red-50",
};

export default function Button({
  variant = "primary",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`rounded-lg px-4 py-3 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${buttonVariantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
