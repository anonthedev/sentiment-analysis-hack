'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OverallSentiment from '@/components/Sentiments/OverallSentiment'
import SentimentBreakdown from '@/components/Sentiments/SentimentBreakdown'
import SentenceAnalysis from '@/components/Sentiments/SentenceAnalysis'
import TargetSummary from '@/components/Sentiments/TargetSummary'
import axios from "axios"
import { useEffect, useState } from "react"

// const sampleData = {
//   documentText: "The food and service were unacceptable. The concierge was nice, however.",
//   overallSentiment: "mixed",
//   sentimentConfidenceScores: { positive: 0.3, neutral: 0.17, negative: 0.52 },
//   sentences: [
//     {
//       sentiment: "negative",
//       confidenceScores: { positive: 0, neutral: 0, negative: 1 },
//       minedOpinions: [
//         {
//           targetText: "food",
//           targetSentiment: "negative",
//           targetConfidenceScores: { positive: 0.01, negative: 0.99 },
//           targetAssessments: [{ text: "unacceptable", sentiment: "negative" }]
//         },
//         {
//           targetText: "service",
//           targetSentiment: "negative",
//           targetConfidenceScores: { positive: 0.01, negative: 0.99 },
//           targetAssessments: [{ text: "unacceptable", sentiment: "negative" }]
//         }
//       ]
//     },
//     {
//       sentiment: "positive",
//       confidenceScores: { positive: 0.61, neutral: 0.35, negative: 0.05 },
//       minedOpinions: [
//         {
//           targetText: "concierge",
//           targetSentiment: "positive",
//           targetConfidenceScores: { positive: 1, negative: 0 },
//           targetAssessments: [{ text: "nice", sentiment: "positive" }]
//         }
//       ]
//     }
//   ]
// }

export default function Dashboard({ params }: { params: { id: string } }) {
  const [sentiments, setSentiments] = useState<any>()
  const reviewData = JSON.parse(window.localStorage.getItem("reviews")!);
  const {id} = params
  const review  = reviewData[0].objects.find((review: any) => review.review_id === id);
  // console.log(reviewData[0].objects)

  console.log(review)

  async function getSentiments(){
   const sentiments = await axios.post(`/api/sentiment`, [{text: review.review, id: review.review_id, language:"en"}])
   console.log(sentiments.data.sentiment[0])
   setSentiments(sentiments.data.sentiment[0])
  }

  useEffect(()=>{
    getSentiments()
  }, [])

  if (sentiments) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">Sentiment Analysis Dashboard</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Review</CardTitle>
              <p className="max-h-[100px] overflow-y-auto">{review.review}</p>
            </CardHeader>
            <CardContent>
              <p>{sentiments.text}</p>
            </CardContent>
          </Card>
          <OverallSentiment 
            sentiment={sentiments.sentiment} 
            scores={sentiments.confidenceScores} 
          />
        </div>
        <Tabs defaultValue="breakdown" className="mt-6">
          <TabsList>
            <TabsTrigger value="breakdown">Sentiment Breakdown</TabsTrigger>
            <TabsTrigger value="sentences">Sentence Analysis</TabsTrigger>
            <TabsTrigger value="targets">Target Summary</TabsTrigger>
          </TabsList>
          <TabsContent value="breakdown">
            <SentimentBreakdown scores={sentiments.confidenceScores} />
          </TabsContent>
          <TabsContent value="sentences">
            <SentenceAnalysis sentences={sentiments.sentences} />
          </TabsContent>
          <TabsContent value="targets">
            <TargetSummary sentences={sentiments.sentences} />
          </TabsContent>
        </Tabs>
      </main>
    )
  }
  
  return(
    <div>Loading...</div>
  )
}

