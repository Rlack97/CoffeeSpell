import { sql } from "@vercel/postgres";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId, password } = body;

  // 사용자 검증

  try {
    const { rows } =
      await sql`SELECT * FROM users WHERE user_id = ${userId} AND user_password = ${password} LIMIT 1`;

    if (rows.length > 0) {
      // 로그인 성공
      return {
        status: 200,
        body: { message: "로그인 성공", user_id: userId },
      };
    } else {
      // 로그인 실패 - 에러 처리
      return {
        status: 401,
        body: { error: "아이디 또는 비밀번호가 일치하지 않습니다." },
      };
    }
  } catch (error) {
    console.error("로그인 중 오류 발생:", error);
    return {
      status: 500,
      body: { error: "로그인 중 오류가 발생했습니다." },
    };
  }
}
