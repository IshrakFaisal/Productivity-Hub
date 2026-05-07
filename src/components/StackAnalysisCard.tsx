import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function StackAnalysisCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-semibold text-white">{title}</h3>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
