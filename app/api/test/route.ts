import { NextResponse,NextRequest } from "next/server";

const whitelist = ["client1", "client2", "client3", "client4"]; // Replace with your actual appIds


export async function GET(request: NextRequest) {
    const appId= request.nextUrl.searchParams.get("appId");
    if (!whitelist.includes(appId || "")) {
        return NextResponse.json({ error: "Invalid appId" }, { status: 400 });
    }
  return NextResponse.json({ status: "true", defaultConcurrency:200 });
}