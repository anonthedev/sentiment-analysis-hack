"use client";

import axios from "axios";
import Link from "next/link";
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

export default function Page() {
  const [sentiments, setSentiments] = useState([]);
  const [avgConfidenceScores, setAvgConfidenceScores] = useState({
    averagePositive: 0,
    averageNeutral: 0,
    averageNegative: 0,
  });
  const [reviewData, setReviewData] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

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

  useEffect(() => {
    if (isSignedIn && isLoaded) {
      getReviews();
    }
  }, [isSignedIn, isLoaded]);

  async function getOverallSentiment() {
    const productReviews = reviewData[selectedProduct!];
    const review_f = productReviews.flatMap((review: any) => ({
      id: review.review_id,
      text: review.review,
      language: "en",
    }));

    const resp = await axios.post("/api/sentiment", review_f);
    setSentiments(resp.data);

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
    <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <label
          htmlFor="product-select"
          style={{ fontSize: "16px", marginRight: "10px" }}
        >
          Select Product:
        </label>
        <select
          id="product-select"
          value={selectedProduct || ""}
          onChange={(e) => setSelectedProduct(e.target.value)}
          style={{ fontSize: "16px", padding: "5px" }}
        >
          {Object.keys(reviewData).map((productId) => (
            <option key={productId} value={productId}>
              {reviewData[productId][0].product_name.slice(0,50)}
            </option>
          ))}
        </select>
      </div>
      {selectedProduct && (
        <>
          <Link
            href={`/reviews/${selectedProduct}`}
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              marginBottom: "10px",
              display: "block",
            }}
          >
            Product: {reviewData[selectedProduct][0]?.product_name || "Unknown"}
          </Link>
          <p style={{ marginBottom: "20px", fontSize: "16px", color: "#555" }}>
            Average sentiment analysis scores for customer reviews.
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}
