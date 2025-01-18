import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SentimentScores } from "./SentimentScores"
export interface Review {
    product_name: string
    review_id: string
    review_by: string
    review: string
    title?: string
  }
  
  export interface SentimentAnalysis {
    id: string
    sentiment: string
    confidenceScores: {
      positive: number
      neutral: number
      negative: number
    }
  }
  
  export interface ReviewWithSentiment extends Review {
    sentiment: SentimentAnalysis
  }
  
  
// import type { ReviewWithSentiment } from "../types/review"

interface ReviewListProps {
  reviews: ReviewWithSentiment[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <Link key={review.review_id} href={`/${review.review_id}`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-semibold">{review.product_name}</CardTitle>
                  <p className="text-sm text-muted-foreground">Reviewed by {review.review_by}</p>
                </div>
                <Badge 
                  variant={review.sentiment.sentiment === "positive" ? "default" : 
                          review.sentiment.sentiment === "negative" ? "destructive" : 
                          "secondary"}
                >
                  {review.sentiment.sentiment}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4">
              <p className="text-sm text-muted-foreground line-clamp-3">{review.review}</p>
              <SentimentScores {...review.sentiment.confidenceScores} />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

