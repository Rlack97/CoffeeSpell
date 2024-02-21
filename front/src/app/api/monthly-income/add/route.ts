import { sqlite3 } from "sqlite3";
import { open } from "sqlite";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return NextResponse.json({ message: "hellow" }, { status: 200 });
}
