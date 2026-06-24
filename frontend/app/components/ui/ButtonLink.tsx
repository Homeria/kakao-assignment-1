import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type ButtonLinkVariant = "primary" | "secondary";

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: ButtonLinkVariant;
};

const buttonLinkVariantClasses: Record<ButtonLinkVariant, string> = {
  primary: "bg-[#672be0] text-white hover:bg-[#5622be]",
  secondary: "border border-slate-300 text-slate-700 hover:bg-slate-100",
};

export default function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex rounded-lg px-4 py-3 text-sm font-bold transition ${buttonLinkVariantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}
