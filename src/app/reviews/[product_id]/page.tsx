"use client";

import { ReviewList } from "@/components/ReviewList";
import { use } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ product_id: string }>;
}) {
  const { product_id } = use(params);
  // const reviewData = JSON.parse(window.localStorage.getItem("reviews")!);

  return (
    <div className="w-screen py-10 px-10 flex flex-col gap-10 items-center justify-center">
      <h1 className="text-3xl font-bold mb-8">Product Reviews</h1>
      <ReviewList product_id={product_id} />
    </div>
  );
}
