import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TargetSummaryProps {
  sentences: Array<{
    opinions: Array<{
      target: {
        text: string;
        sentiment: string;
        confidenceScores: {
          positive: number;
          negative: number;
        };
      };
    }>;
  }>;
}

export default function TargetSummary({ sentences }: TargetSummaryProps) {
  console.log(sentences);
  const targets = sentences.flatMap((sentence) => sentence.opinions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Target Summary</CardTitle>
        <CardDescription>
          Summary of sentiment targets in the document
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target</TableHead>
              <TableHead>Sentiment</TableHead>
              <TableHead>Positive Score</TableHead>
              <TableHead>Negative Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {targets.map((target, index) => (
              <TableRow key={index}>
                <TableCell>{target.target.text}</TableCell>
                <TableCell>{target.target.sentiment}</TableCell>
                <TableCell>
                  {(target.target.confidenceScores.positive * 100).toFixed(1)}%
                </TableCell>
                <TableCell>
                  {(target.target.confidenceScores.negative * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
