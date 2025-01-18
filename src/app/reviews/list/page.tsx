"use client"

import { ReviewList } from "@/components/ReviewList";

export default function page() {
  const reviewData = JSON.parse(window.localStorage.getItem("reviews")!);

  
    return (
      <div className="container py-10">
        <h1 className="text-3xl font-bold mb-8">Product Reviews</h1>
        <ReviewList reviews={reviewData} />
      </div>
    )
  
  
  
}
