import type { ReactNode } from "react";

type ErrorMessageProps = {
  children: ReactNode;
  className?: string;
};

export default function ErrorMessage({ children, className = "" }: ErrorMessageProps) {
  return (
    <div className={`rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ${className}`}>
      {children}
    </div>
  );
}
