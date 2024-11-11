// api/csrf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { csrf } from "@/lib/csrf";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
export async function GET(request: NextRequest) {
  try {
    // Get or generate a session ID from cookies
    const cookieStore = cookies();
    let sessionId = cookieStore.get("sessionId")?.value;

    if (!sessionId) {
      sessionId = randomBytes(16).toString("hex");
      // Set session cookie
      cookieStore.set("sessionId", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 , // 1 hours
      });
    }

    const token = await csrf.getToken(sessionId);
    // console.log(
    //   "CSRF token generated in route:",
    //   token.substring(0, 10) + "..."
    // );
    return NextResponse.json({ csrfToken: token });
  } catch (error) {
    //console.error("Error in CSRF token generation route:", error);
    return NextResponse.json(
      { error: "Failed to generate CSRF token" },
      { status: 500 }
    );
  }
}
