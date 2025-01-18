"use client"

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

export function ReviewList({ product_id }: any) {
 
  const [reviews, setReviews] = useState<any>(null)

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
    } else{
      console.log(error)
    }
  }


  useEffect(() => {
    if (isSignedIn && isLoaded) {
      getProductReviews();
    }
  }, [isSignedIn, isLoaded]);

  if (reviews) {
    return (
      <div className="py-6 grid grid-cols-2 gap-4 items-center">
        {reviews.map((review: any) => (
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
            </Card>
          </Link>
        ))}
      </div>
    );
  }else{
    <div>Loading...</div>
  }
  
}

export default ReviewList;