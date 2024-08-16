import { sql } from "@vercel/postgres";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { menu_name, menu_price, menu_category, user_pk } = await req.json();
    const number_pk = parseInt(user_pk, 10);
    const number_price = parseInt(menu_price, 10);

    if (isNaN(number_price)) {
      return NextResponse.json(
        { error: "유효하지 않은 가격입니다." },
        { status: 400 }
      );
    }

    await sql`INSERT INTO menu (menu_name, menu_price,menu_category, user_pk) VALUES (${menu_name}, ${number_price}, ${menu_category}, ${number_pk})`;
    return NextResponse.json({ message: "메뉴 추가 성공" }, { status: 200 });
  } catch (error) {
    console.log("에러 발생:", error);
    return NextResponse.json(
      { error: "서버에서 오류가 발생하였습니다." },
      { status: 500 }
    );
  }
}
