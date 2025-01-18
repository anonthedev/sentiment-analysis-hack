'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OverallSentiment from '@/components/Sentiments/OverallSentiment'
import SentimentBreakdown from '@/components/Sentiments/SentimentBreakdown'
import SentenceAnalysis from '@/components/Sentiments/SentenceAnalysis'
import TargetSummary from '@/components/Sentiments/TargetSummary'
import axios from "axios"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function Dashboard({ params }: { params: { id: string } }) {
  const [sentiments, setSentiments] = useState<any>()
  const reviewData = JSON.parse(window.localStorage.getItem("reviews")!);
  const {id} = params
  const pathname = usePathname()
  const reviewOf = reviewData.find((reviewObj: any)=>reviewObj.product_id == pathname.split("/")[2])
  const review  = reviewOf.objects.find((review: any) => review.review_id === id);
  // console.log()
  // console.log(reviewData)

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

