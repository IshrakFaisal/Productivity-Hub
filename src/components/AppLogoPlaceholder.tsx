import { ToolLogo } from "@/components/ToolLogo";

export function AppLogoPlaceholder({ name, className }: { name: string; className?: string }) {
  return <ToolLogo name={name} className={className} />;
}
