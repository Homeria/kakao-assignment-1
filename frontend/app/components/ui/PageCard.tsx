import type { HTMLAttributes, ReactNode } from "react";

type PageCardTone = "default" | "danger";
type PageCardPadding = "default" | "compact";

type PageCardProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  as?: "section" | "header";
  padding?: PageCardPadding;
  tone?: PageCardTone;
};

const toneClasses: Record<PageCardTone, string> = {
  default: "border-slate-200",
  danger: "border-red-200",
};

const paddingClasses: Record<PageCardPadding, string> = {
  default: "p-6",
  compact: "p-3",
};

export default function PageCard({
  children,
  as: Component = "section",
  className = "",
  padding = "default",
  tone = "default",
  ...props
}: PageCardProps) {
  return (
    <Component
      className={`rounded-xl border bg-white shadow-sm ${toneClasses[tone]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
