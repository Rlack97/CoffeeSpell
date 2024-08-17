import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { rows } = await sql`SELECT * FROM menu ORDER BY menu_id`;
    const response = NextResponse.json({ rows }, { status: 200 });

    return response;
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
