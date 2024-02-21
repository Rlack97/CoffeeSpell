import sqlite3 from "sqlite3";
import { open } from "sqlite";

import type { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, password } = body;

  // SQLite3 데이터베이스 연결
  const db = await open({
    filename: "./db.sqlite",
    driver: sqlite3.Database,
  });

  // 사용자 검증
  const query = "SELECT * FROM user WHERE user_id = ? AND user_password = ?";
  const user = await db.get(query, [userId, password]);

  if (user) {
    // 로그인 성공
    return NextResponse.json({ message: "로그인 성공" }, { status: 200 });
  } else {
    // 로그인 실패 - 에러 처리
    return NextResponse.json(
      { error: "아이디 또는 비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  }
}
