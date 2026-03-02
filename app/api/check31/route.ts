import { NextResponse } from 'next/server';
import dbconnect from '@/lib/db';
import { Data } from '@/lib/data';

export async function POST(request: Request) {
  await dbconnect();

  const { appId } = await request.json();

  const data = await Data.findOne({ appId });
  if (!data) {   
    return NextResponse.json({
    authorized: false,
    defaultConcurrency: 0
  });;
  }
  if (data.remaining <= 0) {
    return NextResponse.json({
    authorized: true,
    defaultConcurrency: 300
  });;
  }
  if (data.remaining > 20) {
    return NextResponse.json({
    authorized: true,
    defaultConcurrency: 300
  });;
  }
  if (data.remaining <= 20 && data.remaining > 0) {
  }
  data.remaining -= 1;
  await data.save();
  return NextResponse.json(true);
}



export async function GET() {
  return NextResponse.json({
    authorized: true,
    defaultConcurrency: 300
  });
}
