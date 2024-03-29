import Channels from "pusher";
import { NextResponse } from "next/server";

const { APP_ID, APP_KEY, SECRET, CLUSTER } = process.env;

if (!APP_ID || !APP_KEY || !SECRET || !CLUSTER) {
  throw new Error("환경 변수가 설정되지 않았습니다.");
}

const pusher = new Channels({
  appId: APP_ID,
  key: APP_KEY,
  secret: SECRET,
  cluster: CLUSTER,
});

export async function POST(req: Request) {
  if (req.method === "POST") {
    const body = await req.json();
    const message = body;

    try {
      await pusher.trigger("my-channel", "my-event", { message });
      return NextResponse.json({ message: "전송 성공" }, { status: 200 });
    } catch (error) {
      console.error("Error sending message:", error);
      return NextResponse.json(
        { error: "서버에서 오류가 발생했습니다." },
        { status: 500 }
      );
    }
  } else {
    return NextResponse.json({ success: false, message: "Method Not Allowed" });
  }
}
