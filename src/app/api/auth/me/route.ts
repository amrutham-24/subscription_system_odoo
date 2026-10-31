import { NextResponse } from "next/server";
import { getCurrentAuth, destroySession } from "@/lib/auth";

export async function GET() {
  const auth = await getCurrentAuth();
  if (!auth) {
    return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true, ...auth });
}

export async function POST() {
  await destroySession();
  return NextResponse.json({ success: true, message: "Logged out" });
}
