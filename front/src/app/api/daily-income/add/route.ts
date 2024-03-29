import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { income, userId } = await req.json();
    const incomeNumber = parseInt(income);
    const { rows } =
      await sql`SELECT user_pk FROM users WHERE user_id = ${userId}`;

    if (rows && rows.length > 0) {
      const userPk = rows[0].user_pk;
      await sql`INSERT INTO daily_income (date, daily_income, user_id) VALUES (${today}, ${incomeNumber}, ${userPk})`;
      return NextResponse.json({ message: "기록되었습니다." }, { status: 200 });
    } else {
      // 사용자를 찾을 수 없는 경우에 대한 처리
      console.error("사용자를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
