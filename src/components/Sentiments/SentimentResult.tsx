import { AlertCircle, CheckCircle, MinusCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SentimentResultProps {
  sentiment: {
    score: number
    label: string
  }
}

export default function SentimentResult({ sentiment }: SentimentResultProps) {
  const { score, label } = sentiment

  const getAlertVariant = () => {
    if (label === 'Positive') return 'default'
    if (label === 'Negative') return 'destructive'
    return 'warning'
  }

  const getIcon = () => {
    if (label === 'Positive') return CheckCircle
    if (label === 'Negative') return AlertCircle
    return MinusCircle
  }

  const Icon = getIcon()

  return (
    <Alert variant={getAlertVariant() && 'default'} className="mt-4">
      <Icon className="h-4 w-4" />
      <AlertTitle>Sentiment Analysis Result</AlertTitle>
      <AlertDescription>
        The sentiment is {label} with a score of {score.toFixed(2)}
      </AlertDescription>
    </Alert>
  )
}

