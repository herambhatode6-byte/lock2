import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    authorized: true,
    defaultConcurrency: 4
  });
}

// import { NextResponse } from 'next/server';

// export async function GET() {
//   return NextResponse.json(true);
// }
