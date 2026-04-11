import { NextResponse, NextRequest } from "next/server";

const whitelist = ["client1", "client2", "client3", "client4", "client5", "deepakpatna", "shivamaiowithdrawl","spinmatchreset"];
const blacklist = ["client7", "client6"];
const greylist = ["deepak", "client9"];

export async function GET(request: NextRequest) {
    const appId = request.nextUrl.searchParams.get("appId");

    // 1. Handle missing appId immediately
    if (!appId) {
        return NextResponse.json({ authorized: false, error: "Missing appId" }, { status: 400 });
    }

    // 2. Check blacklist first (Hard block)
    if (blacklist.includes(appId)) {
        return NextResponse.json({ 
            authorized: false, 
            error: "AppId is blacklisted" 
        }, { status: 403 });
    }

    // 3. Check greylist (Partial authorization)
    if (greylist.includes(appId)) {
        return NextResponse.json({ 
            authorized: true, 
            defaultConcurrency: 2, 
        }, { status: 200 });
    }

    // 4. Check whitelist (Full authorization)
    if (whitelist.includes(appId)) {
    return NextResponse.json({ 
        authorized: true, 
        defaultConcurrency: appId === 'spinmatchreset' ? 500 : 350 
    }, { status: 200 });
    }

    // 5. Catch-all: If it's not in the whitelist or greylist, reject it
    return NextResponse.json({ authorized: false, error: "Invalid appId" }, { status: 401 });
}
