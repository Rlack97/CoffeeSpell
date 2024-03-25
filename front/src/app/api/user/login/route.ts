import { sql } from "@vercel/postgres";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, password } = body;

  // 사용자 검증
  const user =
    await sql`SELECT * FROM users WHERE user_id = ${userId} AND user_password = ${password}`;

  if (user) {
    // 로그인 성공
    return NextResponse.json(
      { message: "로그인 성공", user_id: userId },
      { status: 200 }
    );
  } else {
    // 로그인 실패 - 에러 처리
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  }
}
