import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // const { rows } = await sql`SELECT ${req.body.date} FROM daily_income`;

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
