import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SentimentBreakdownProps {
  scores: {
    positive: number
    neutral: number
    negative: number
  }
}

export default function SentimentBreakdown({ scores }: SentimentBreakdownProps) {
  const data = [
    { name: 'Positive', score: scores.positive },
    { name: 'Neutral', score: scores.neutral },
    { name: 'Negative', score: scores.negative },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sentiment Breakdown</CardTitle>
        <CardDescription>Detailed view of sentiment confidence scores</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

