import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface SentenceAnalysisProps {
  sentences: Array<{
    sentiment: string;
    text: string;
    confidenceScores: {
      positive: number;
      neutral: number;
      negative: number;
    };
    opinions: Array<{
      target: {
        text: string;
        sentiment: string;
        confidenceScores: {
          positive: number;
          negative: number;
        };
      };
      assessments: Array<{
        text: string;
        sentiment: string;
      }>;
    }>;
  }>;
}

export default function SentenceAnalysis({ sentences }: SentenceAnalysisProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentence Analysis</CardTitle>
        <CardDescription>
          Detailed analysis of individual sentences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {sentences.map((sentence, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="flex flex-row hover:no-underline">
                <p className="text-wrap w-[30ch]">{sentence.text}</p>
                <Badge
                  variant={
                    sentence.sentiment === "positive"
                      ? "positive"
                      : sentence.sentiment === "negative"
                      ? "destructive"
                      : "secondary"
                  }
                  className="items-center"
                >
                  {sentence.sentiment}
                </Badge>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div>
                    <strong>Confidence Scores:</strong>
                    <ul>
                      <li>
                        Positive:{" "}
                        {(sentence.confidenceScores.positive * 100).toFixed(1)}%
                      </li>
                      <li>
                        Neutral:{" "}
                        {(sentence.confidenceScores.neutral * 100).toFixed(1)}%
                      </li>
                      <li>
                        Negative:{" "}
                        {(sentence.confidenceScores.negative * 100).toFixed(1)}%
                      </li>
                    </ul>
                  </div>
                  {sentence.opinions.length !== 0 && <div>
                    <strong>Mined Opinions:</strong>
                    {sentence.opinions.map((opinion, opinionIndex) => (
                      <div key={opinionIndex} className="ml-4 mt-2">
                        <div>Target: {opinion.target.text}</div>
                        <div>Sentiment: {opinion.target.sentiment}</div>
                        <div>
                          Confidence: Positive{" "}
                          {(
                            opinion.target.confidenceScores.positive * 100
                          ).toFixed(1)}
                          %, Negative{" "}
                          {(
                            opinion.target.confidenceScores.negative * 100
                          ).toFixed(1)}
                          %
                        </div>
                        <div>
                          Assessments:
                          <ul>
                            {opinion.assessments.map(
                              (assessment, assessmentIndex) => (
                                <li key={assessmentIndex}>
                                  {assessment.text} ({assessment.sentiment})
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
