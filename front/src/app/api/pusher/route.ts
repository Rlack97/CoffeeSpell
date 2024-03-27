import Pusher from "pusher";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method === "POST") {
    const body = await req.json();
    const message = body;

    const pusher = new Pusher({
      appId: "1777997",
      key: "f7a5e3a12d42b498143b",
      secret: "f844c04f3c979f0d9046",
      cluster: "ap3",
      useTLS: true,
    });

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
