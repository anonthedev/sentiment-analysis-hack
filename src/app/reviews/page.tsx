"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Page() {
  const [sentiments, setSentiments] = useState([]);
  const [avgConfidenceScores, setAvgConfidenceScores] = useState({ averagePositive: 0, averageNeutral: 0, averageNegative: 0 });

  const reviewData = JSON.parse(window.localStorage.getItem("reviews")!);
  console.log(reviewData)

  const review_f = reviewData[0].objects.flatMap((review: any) => ({
    id: review.review_id,
    text: review.review,
    language: "en",
  }));

  useEffect(() => {
    async function getSentiments() {
      const resp = await axios.post("/api/sentiment", review_f);
      console.log(resp.data);
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

      const averagePositive = totalPositive / count;
      const averageNeutral = totalNeutral / count;
      const averageNegative = totalNegative / count;

      setAvgConfidenceScores({ averagePositive, averageNeutral, averageNegative });
    }
    getSentiments();
  }, []);

  const chartData = [
    { name: "Positive", value: avgConfidenceScores.averagePositive },
    { name: "Neutral", value: avgConfidenceScores.averageNeutral },
    { name: "Negative", value: avgConfidenceScores.averageNegative },
  ];

  if (sentiments) {
    return (
      <div style={{ fontFamily: "Arial, sans-serif", padding: "20px" }}>
        <Link href={`/reviews/${reviewData[0].objects[0].review_id}`} style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>
          Product: {reviewData[0].objects[0].product_name}
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
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
