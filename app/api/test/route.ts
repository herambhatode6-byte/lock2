import { NextResponse, NextRequest } from "next/server";

const whitelist = ["client1", "client2", "client3", "client4"];
const blacklist = ["client5", "client6"];

export async function GET(request: NextRequest) {
    const appId = request.nextUrl.searchParams.get("appId");

    // 1. Handle missing appId immediately
    if (!appId) {
        return NextResponse.json({ authorized: false, error: "Missing appId" }, { status: 400 });
    }

    // 2. Check blacklist
    if (blacklist.includes(appId)) {
        return NextResponse.json({ authorized: false, error: "AppId is blacklisted" }, { status: 403 });
    }

    // 3. Check whitelist
    if (!whitelist.includes(appId)) {
        return NextResponse.json({ authorized: false, error: "Invalid appId" }, { status: 401 });
    }

    // 4. Success - NOTE: authorized is now a boolean true, not a string "true"
    return NextResponse.json({ 
        authorized: true, 
        defaultConcurrency: 200 
    });
}
