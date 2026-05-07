import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function VerdictCard({ verdict }: { verdict: string }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="font-semibold text-white">Verdict</h2>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-6 text-neutral-300">{verdict}</p>
      </CardContent>
    </Card>
  );
}
