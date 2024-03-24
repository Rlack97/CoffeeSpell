import sqlite3 from "sqlite3";
import { open } from "sqlite";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // SQLite3 데이터베이스 연결
    const db = await open({
      filename: "./db.sqlite",
      driver: sqlite3.Database,
    });

    const query = "SELECT * FROM menu";
    const menu = await db.all(query);

    // 메뉴가 존재하지 않는 경우에도 그냥 빈 값을 전달
    return NextResponse.json({ menu }, { status: 200 });
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
