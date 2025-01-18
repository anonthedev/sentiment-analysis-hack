import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface OverallSentimentProps {
  sentiment: string
  scores: {
    positive: number
    neutral: number
    negative: number
  }
}

export default function OverallSentiment({ sentiment, scores }: OverallSentimentProps) {
  const getBadgeVariant = () => {
    switch (sentiment) {
      case 'positive':
        return 'default'
      case 'negative':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overall Sentiment</CardTitle>
        <CardDescription>The overall sentiment of the document</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <Badge variant={getBadgeVariant()} className="text-lg py-1 px-3">
            {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
          </Badge>
          <div className="text-sm">
            <div>Positive: {(scores.positive * 100).toFixed(1)}%</div>
            <div>Neutral: {(scores.neutral * 100).toFixed(1)}%</div>
            <div>Negative: {(scores.negative * 100).toFixed(1)}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

