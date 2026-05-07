import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function BentoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </CardHeader>
      <CardContent className="text-sm leading-6 text-neutral-400">{children}</CardContent>
    </Card>
  );
}
