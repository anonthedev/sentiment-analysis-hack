import { supabaseClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  const body = await req.json();
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { error: "No Authorization header provided" },
      { status: 400 }
    );
  }
  const token = authHeader.split(" ")[1];
  const supabase = await supabaseClient(token);

  if (!body) {
    return NextResponse.json({ error: "No body provided" }, { status: 400 });
  }

  console.log(body)

//   const { data, error } = await supabase
//     .from("reviews")
//     .insert([
//         { ...body, user_id: userId }
//     ])
//     .select();

//   if (data) {
//     console.log(data);
//     return NextResponse.json(
//       { message: "Reviews added successfully" },
//       { status: 200 }
//     );
//   } else {
//     console.log(error);
//     return NextResponse.json(
//       { message: "Reviews added failed" },
//       { status: 500 }
//     );
//   }
}
