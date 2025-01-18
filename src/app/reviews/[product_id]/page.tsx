"use client";

import { ReviewList } from "@/components/ReviewList";

export default function page({ params }: { params: { product_id: string } }) {
  const reviewData = JSON.parse(window.localStorage.getItem("reviews")!);
  const filteredReviews = reviewData.filter((review: any) => review.product_id === params.product_id);

  console.log(filteredReviews)

  return (
    <div className="w-screen py-10 px-10 flex flex-col gap-10 items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Product Reviews</h1>
      <ReviewList reviews={filteredReviews} product_id={params.product_id} />
    </div>
  );
}
