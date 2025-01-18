import { Progress } from "@/components/ui/progress"

interface SentimentScoresProps {
  positive: number
  neutral: number
  negative: number
}

export function SentimentScores({ positive, neutral, negative }: SentimentScoresProps) {
  return (
    <div className="space-y-2 w-full max-w-[200px]">
      <div className="flex justify-between text-sm">
        <span>Positive</span>
        <span>{Math.round(positive * 100)}%</span>
      </div>
      <Progress value={positive * 100} className="bg-muted" />
      
      <div className="flex justify-between text-sm">
        <span>Neutral</span>
        <span>{Math.round(neutral * 100)}%</span>
      </div>
      <Progress value={neutral * 100} className="bg-muted" />
      
      <div className="flex justify-between text-sm">
        <span>Negative</span>
        <span>{Math.round(negative * 100)}%</span>
      </div>
      <Progress value={negative * 100} className="bg-muted" />
    </div>
  )
}

