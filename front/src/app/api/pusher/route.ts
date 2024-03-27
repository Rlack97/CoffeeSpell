import Channels from "pusher";
import { NextResponse } from "next/server";

const { APP_ID, KEY, SECRET, CLUSTER } = process.env;

if (!APP_ID || !KEY || !SECRET || !CLUSTER) {
  throw new Error("환경 변수가 설정되지 않았습니다.");
}

const pusher = new Channels({
  appId: APP_ID,
  key: KEY,
  secret: SECRET,
  cluster: CLUSTER,
});

export async function POST(req: Request) {
  if (req.method === "POST") {
    const body = await req.json();
    const message = body;

    pusher
      .trigger("my-channel", "my-event", { message })
      .then(() => {
        NextResponse.json({
          success: true,
          message: "Message sent successfully.",
        });
      })
      .catch((error) => {
        console.error("Error sending message:", error);
        NextResponse.json({
          success: false,
          message: "Failed to send message.",
        });
      });
  } else {
    NextResponse.json({ success: false, message: "Method Not Allowed" });
  }
}
