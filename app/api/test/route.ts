import { NextResponse,NextRequest } from "next/server";

const whitelist = ["client1", "client2", "client3", "client4"]; // Replace with your actual appIds
const blacklist = ["client5", "client6"]; // Replace with your actual blacklisted appIds

export async function GET(request: NextRequest) {
    const appId= request.nextUrl.searchParams.get("appId");
    if (blacklist.includes(appId || "")) {
        return NextResponse.json({ error: "AppId is blacklisted" }, { status: 400 });
    }
    if (!whitelist.includes(appId || "")) {
        return NextResponse.json({ error: "Invalid appId" }, { status: 400 });
    }
  return NextResponse.json({ authorized: "true", defaultConcurrency:200 });
}


