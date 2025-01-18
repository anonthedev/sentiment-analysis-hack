import { NextRequest, NextResponse } from "next/server";
import {
  TextAnalysisClient,
  AzureKeyCredential,
} from "@azure/ai-language-text";

export async function POST(req: NextRequest, res: NextResponse) {
  const azure_key = process.env.AZURE_KEY_1;
  const endpoint = process.env.ENDPOINT;
  const body = await req.json();
  // console.log(body)
  // const documents = [
  //   {
  //     text: "The keys aren't exactly like Cherry - there's some feel to them and not clicky, so it's good balance between being tactile and quiet. Neither, but not too much of either. Brightness even at lowest setting is too bright for me. Also the keycaps are transparent, which means if the LEDs go out you're effectively blind. I like to keep the lights off 90% of the time and translucent keycaps help there, but this keyboard doesn't have that option. And there's no memory, so every time you power up the brightness setting has to be tweaked (always down to minimum for me). Hopefully it lasts a bit more than my HP GK100s, both of which died after the warranty period was over. I think they feed that into the keyboard.",
  //     id: "0",
  //     language: "en",
  //   },
  // ];

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
