import { sql } from "@vercel/postgres";

export async function GET(req: Request) {
  try {
    const { rows } = await sql`SELECT * FROM menu`;

    // 메뉴가 존재하지 않는 경우에도 그냥 빈 값을 전달
    // const menu = rows ?? [];

    return {
      status: 200,
      body: { message: rows },
    };
  } catch (error) {
    console.error("에러 발생:", error);
    return {
      status: 500,
      body: { error: "서버에서 오류가 발생했습니다." },
    };
  }
}
