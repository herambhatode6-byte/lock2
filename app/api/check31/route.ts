
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    authorized: false,
    defaultConcurrency: 1
  });
}
