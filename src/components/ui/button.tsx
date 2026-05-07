import Link from "next/link";
import { type AnchorHTMLAttributes, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-lime-300 text-neutral-950 shadow-[0_0_30px_rgba(190,242,100,0.2)] hover:bg-lime-200 focus-visible:outline-lime-200",
  secondary:
    "border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.1] focus-visible:outline-white/40",
  ghost: "text-neutral-300 hover:bg-white/[0.08] hover:text-white focus-visible:outline-white/40",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof variants;
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof variants;
};

export function ButtonLink({
  className,
  variant = "primary",
  href,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
