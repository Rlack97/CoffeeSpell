import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const { menu_id, user_pk } = await req.json();
    const number_id = parseInt(menu_id, 10);
    const number_pk = parseInt(user_pk, 10);

    if (isNaN(number_id)) {
      return NextResponse.json(
        { error: "유효하지 않은 menu_id입니다." },
        { status: 400 }
      );
    }

    await sql`DELETE FROM menu WHERE menu_id = ${number_id} AND user_pk = ${number_pk}`;
    return NextResponse.json({ message: "메뉴 삭제 성공" }, { status: 200 });
  } catch (error) {
    console.error("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생하였습니다." },
      { status: 500 }
    );
  }
}
