"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const ConfidenceBar = ({
  score,
  label,
  color,
}: {
  score: number;
  label: string;
  color: string;
}) => (
  <div className="flex items-center gap-2 text-sm">
    <span className="w-16 text-gray-500">{label}</span>
    <div className="flex-1 bg-gray-200 rounded-full h-2">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${score * 100}%` }}
      />
    </div>
    <span className="w-12 text-right text-gray-500">
      {(score * 100).toFixed(0)}%
    </span>
  </div>
);

export default function Page() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [reviewData, setReviewData] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [targetSummary, setTargetSummary] = useState<any[]>([]);
  const [avgConfidenceScores, setAvgConfidenceScores] = useState({
    averagePositive: 0,
    averageNeutral: 0,
    averageNegative: 0,
  });

  const { getToken, userId, isSignedIn, isLoaded } = useAuth();

  async function getReviews() {
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClient(token!);

    if (userId) {
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId);

      if (reviews) {
        const groupedData = reviews.reduce((acc, row) => {
          const { product_id, ...rest } = row;
          if (!acc[product_id]) acc[product_id] = [];
          acc[product_id].push(rest);
          return acc;
        }, {});

        setReviewData(groupedData);

        const firstProductId = Object.keys(groupedData)[0];
        setSelectedProduct(firstProductId);
      } else {
        console.error("Error fetching reviews:", error);
      }
    }
  }

  async function getOverallSentiment() {
    const productReviews = reviewData[selectedProduct!];
    const review_f = productReviews.flatMap((review: any) => ({
      id: review.review_id,
      text: review.review,
      language: "en",
    }));

    const resp = await axios.post("/api/sentiment", review_f);

    if (resp.data && resp.data.sentiment) {
      const targets: {
        [key: string]: { positive: number; negative: number; total: number };
      } = {};
      resp.data.sentiment.forEach((sentimentItem: any) => {
        sentimentItem.sentences?.forEach((sentence: any) => {
          sentence.opinions?.forEach((opinion: any) => {
            if (opinion.target && opinion.target.text) {
              const target = opinion.target.text.toLowerCase();
              if (!targets[target]) {
                targets[target] = { positive: 0, negative: 0, total: 0 };
              }
              const scores = opinion.target.confidenceScores;
              targets[target].positive += scores.positive;
              targets[target].negative += scores.negative;
              targets[target].total += 1;
            }
          });
        });
      });

      const summaryData = Object.entries(targets).map(([target, scores]) => ({
        target,
        positive: scores.positive / scores.total,
        negative: scores.negative / scores.total,
      }));

      setTargetSummary(summaryData);

      let totalPositive = 0;
      let totalNeutral = 0;
      let totalNegative = 0;

      resp.data.sentiment.forEach((data: any) => {
        totalPositive += data.confidenceScores.positive;
        totalNeutral += data.confidenceScores.neutral;
        totalNegative += data.confidenceScores.negative;
      });

      const count = resp.data.sentiment.length;

      setAvgConfidenceScores({
        averagePositive: totalPositive / count,
        averageNeutral: totalNeutral / count,
        averageNegative: totalNegative / count,
      });
    }
  }

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      getReviews();
    }
  }, [isSignedIn, isLoaded]);

  useEffect(() => {
    if (selectedProduct && reviewData) {
      getOverallSentiment();
    }
  }, [selectedProduct, reviewData]);

  const chartData = [
    { name: "Positive", value: avgConfidenceScores.averagePositive },
    { name: "Neutral", value: avgConfidenceScores.averageNeutral },
    { name: "Negative", value: avgConfidenceScores.averageNegative },
  ];

  if (!reviewData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="font-sans p-6">
      <div className="mb-2">
        <label htmlFor="product-select" className="text-lg font-medium mr-4">
          Select Product:
        </label>
        <select
          id="product-select"
          value={selectedProduct || ""}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="text-lg p-2 border border-gray-300 rounded"
        >
          {Object.keys(reviewData).map((productId) => (
            <option key={productId} value={productId}>
              {reviewData[productId][0].product_name.slice(0, 50)}
            </option>
          ))}
        </select>
      </div>

      {selectedProduct && (
        <section className="flex flex-col gap-3">
          <h2
            // href={`/reviews/${selectedProduct}`}
            className="text-2xl font-bold block"
          >
            {reviewData[selectedProduct][0]?.product_name || "Unknown"}
          </h2>
          <p className="text-lg mb-4 text-gray-700">
            Average sentiment analysis scores for customer reviews.
          </p>
          <Button asChild className="w-fit">
            <Link href={`/reviews/${selectedProduct}`}>Detailed Analysis</Link>
          </Button>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Opinion Targets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {targetSummary.map((item, index) => (
                <div
                  key={index}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-100"
                >
                  <h3 className="text-lg font-bold mb-4 capitalize">
                    {item.target}
                  </h3>
                  <ConfidenceBar
                    score={item.positive}
                    label="Positive"
                    color="bg-green-500"
                  />
                  <ConfidenceBar
                    score={item.negative}
                    label="Negative"
                    color="bg-red-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
