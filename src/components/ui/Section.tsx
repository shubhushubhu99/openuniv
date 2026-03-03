import { type ReactNode } from "react";

export interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export function Section({ children, className, id }: SectionProps) {
  const classes = ["section", className].filter(Boolean).join(" ");
  return <div className={classes} id={id}>{children}</div>;
}
