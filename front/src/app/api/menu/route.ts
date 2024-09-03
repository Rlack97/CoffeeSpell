import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

// 캐시 없애는 코드. 대체 이놈때문에 얼마나 진척이 막혔는데!!!
export const dynamic = "force-dynamic";

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
