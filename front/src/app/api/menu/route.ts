import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { rows } = await sql`SELECT * FROM menu`;

    // 메뉴가 존재하지 않는 경우에도 그냥 빈 값을 전달
    // const menu = rows ?? [];

    return NextResponse.json({ message: rows }, { status: 200 });
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
