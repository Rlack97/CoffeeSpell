import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const today = new Date().toISOString().split("T")[0];
    const { income, userId } = await req.json();
    const userQuery =
      await sql`SELECT user_pk FROM users WHERE user_id = ${userId}`;
    const userPk = userQuery.rows[0].user_pk;

    console.log(today);
    console.log(income);
    console.log(userPk);

    await sql`INSERT INTO daily_income (date, income, user_id) VALUES (${today}, ${income}, ${userPk})`;
    return NextResponse.json({ message: "기록되었습니다." }, { status: 200 });
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
