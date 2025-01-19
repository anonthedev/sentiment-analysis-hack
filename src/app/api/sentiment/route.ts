import { NextRequest, NextResponse } from "next/server";
import {
  TextAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-language-text";

export async function POST(req: NextRequest) {
  const azure_key = process.env.AZURE_KEY_1;
  const endpoint = process.env.ENDPOINT;
  const body = await req.json();

  const client = new TextAnalysisClient(
    endpoint!,
    new AzureKeyCredential(azure_key!)
  );
  const results = await client.analyze("SentimentAnalysis", body.slice(0,9), {
    includeOpinionMining: true,
  });

  return NextResponse.json({status: 200, sentiment: results})
  // for (let i = 0; i < results.length; i++) {
  //   const result = results[i];
  //   // console.log(`- Document ${result.id}`);
  //   if (!result.error) {
      
  //     // console.log(`\tDocument text: ${documents[i].text}`);
  //     // console.log(`\tOverall Sentiment: ${result.sentiment}`);
  //     // console.log("\tSentiment confidence scores:", result.confidenceScores);
  //     // console.log("\tSentences");
  //     // for (const {
  //     //   sentiment,
  //     //   confidenceScores,
  //     //   opinions,
  //     // } of result.sentences) {
  //     //   console.log(`\t- Sentence sentiment: ${sentiment}`);
  //     //   console.log("\t  Confidence scores:", confidenceScores);
  //     //   console.log("\t  Mined opinions");
  //     //   for (const { target, assessments } of opinions) {
  //     //     console.log(`\t\t- Target text: ${target.text}`);
  //     //     console.log(`\t\t  Target sentiment: ${target.sentiment}`);
  //     //     console.log(
  //     //       "\t\t  Target confidence scores:",
  //     //       target.confidenceScores
  //     //     );
  //     //     console.log("\t\t  Target assessments");
  //     //     for (const { text, sentiment } of assessments) {
  //     //       console.log(`\t\t\t- Text: ${text}`);
  //     //       console.log(`\t\t\t  Sentiment: ${sentiment}`);
  //     //     }
  //     //   }
  //     // }
  //   } else {
  //     console.error(`\tError: ${result.error}`);
  //     return NextResponse.json({status: 500, message: "Internal Server Error", error: result.error})
  //   }
  // }
}
