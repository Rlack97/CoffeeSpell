import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const today = new Date().toLocaleDateString();
    const { income, user_pk } = await req.json();
    const incomeNumber = parseInt(income, 10);
    const number_pk = parseInt(user_pk, 10);

    await sql`INSERT INTO daily_income (date, daily_income, user_id) VALUES (${today}, ${incomeNumber}, ${number_pk})`;
    return NextResponse.json({ message: "기록되었습니다." }, { status: 200 });
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
