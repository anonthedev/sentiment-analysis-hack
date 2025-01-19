"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { User } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import axios from "axios";

const ConfidenceBar = ({ score, label, color }:{ score: number, label: string, color: string }) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="w-16 text-muted-foreground">{label}</span>
    <div className="flex-1 bg-gray-200 rounded-full h-2">
      <div 
        className={`h-full rounded-full ${color}`}
        style={{ width: `${score * 100}%` }}
      />
    </div>
    <span className="w-12 text-right text-muted-foreground">
      {(score * 100).toFixed(0)}%
    </span>
  </div>
);

export function ReviewList({ product_id }: any) {
  const [reviews, setReviews] = useState<any>(null)
  const [sentiments, setSentiments] = useState<any>(null)
  const { getToken, userId, isSignedIn, isLoaded } = useAuth();

  async function getProductReviews() {
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClient(token!);
    const { data: reviews, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", product_id);
    if (reviews) {
      console.log(reviews)
      setReviews(reviews)
    } else {
      console.log(error)
    }
  }

  async function getReviewSentiments(){
    const review_f = reviews.flatMap((review: any) => ({text: review.review, id: review.review_id, language: "en"}));
    const resp = await axios.post(`/api/sentiment`, review_f.slice(0,9))
    setSentiments(resp.data)
  }

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      getProductReviews();
    }
  }, [isSignedIn, isLoaded]);

  useEffect(()=>{
    if (reviews) {
      getReviewSentiments()
    }
  }, [reviews])

  if (!reviews || !sentiments) {
    return <div>Loading...</div>
  }

  return (
    <div className="py-6 grid grid-cols-2 gap-4 items-center">
      {reviews.map((review: any) => {
        const reviewSentiment = sentiments.sentiment.find((s: any) => s.id === review.review_id);
        const confidenceScores = reviewSentiment?.confidenceScores || { positive: 0, neutral: 0, negative: 0 };
        
        return (
          <Link
            className="max-w-prose transition-transform duration-200 hover:scale-102"
            key={review.review_id}
            href={`/reviews/${product_id}/${review.review_id}`}
          >
            <Card className="hover:shadow-lg transition-all duration-200 hover:bg-muted/50 border-2">
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-4">
                  <div className="space-y-4">
                    <p
                      className="text-lg font-medium leading-relaxed text-foreground/90 line-clamp-3"
                      title={review.review}
                    >
                      {review.review}
                    </p>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <p className="text-sm font-medium">
                        {review.review_by}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm font-medium mb-2">
                  Sentiment: {reviewSentiment?.sentiment || 'No sentiment available'}
                </div>
                <ConfidenceBar 
                  score={confidenceScores.positive}
                  label="Positive"
                  color="bg-green-500"
                />
                <ConfidenceBar 
                  score={confidenceScores.neutral}
                  label="Neutral"
                  color="bg-gray-500"
                />
                <ConfidenceBar 
                  score={confidenceScores.negative}
                  label="Negative"
                  color="bg-red-500"
                />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default ReviewList;