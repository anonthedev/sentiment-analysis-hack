"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverallSentiment from "@/components/Sentiments/OverallSentiment";
import SentimentBreakdown from "@/components/Sentiments/SentimentBreakdown";
import SentenceAnalysis from "@/components/Sentiments/SentenceAnalysis";
import TargetSummary from "@/components/Sentiments/TargetSummary";
import axios from "axios";
import { use, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabase";

export default function Dashboard({ params }: { params: Promise<{ id: string }> }) {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [sentiments, setSentiments] = useState<any>();
  const { id } = use(params);
  const [review, setReview] = useState<any>();
  const { getToken, userId, isSignedIn, isLoaded } = useAuth();
  async function getReview() {
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClient(token!);
    const { data: review, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .eq("review_id", id);

    if (review) {
      setReview(review[0]);
    } else {
      console.log(error);
    }
  }
  useEffect(() => {
    if (isSignedIn && isLoaded) {
      getReview();
    }
  }, [isSignedIn, isLoaded]);

  async function getSentiments() {
    const sentiments = await axios.post(`/api/sentiment`, [
      { text: review.review, id: id, language: "en" },
    ]);
    console.log(sentiments.data.sentiment[0]);
    setSentiments(sentiments.data.sentiment[0]);
  }

  useEffect(() => {
    getSentiments();
  }, [review]);

  if (sentiments && review) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">
          Sentiment Analysis Dashboard
        </h1>
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
    );
  }

  return <div>Loading...</div>;
}
