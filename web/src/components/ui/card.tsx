import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  children: ReactNode;
}

function Card({ hoverable = false, children, className = "", ...props }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-[0_0_0_1px_rgba(10,10,10,0.08)] ${hoverable ? "transition-shadow duration-150 hover:shadow-[0_0_0_1px_rgba(10,10,10,0.12),0_2px_8px_rgba(10,10,10,0.06)]" : ""} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 pt-5 pb-3 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardBody({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`px-5 pb-5 ${className}`} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ children, className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-5 py-3 border-t border-border ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export { Card, CardHeader, CardBody, CardFooter };
export type { CardProps };
