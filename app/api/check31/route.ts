import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
// import User from '@/lib/user';
import mongoose from 'mongoose';


export async function GET() {
  return NextResponse.json({
    authorized: true,
    defaultConcurrency: 140  });
}


// Add this to the bottom of app/api/check31/route.ts

// This handles the hidden "preflight" request the browser sends to check CORS permissions
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*', // Allows requests from ANY website (like localhost:8090)
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}




// ----------------- SCHEMA DEFINITION -----------------
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Check if the model already exists in the cache before compiling it
// This prevents Next.js hot reloads from crashing the app
const hack = mongoose.models.Hack || mongoose.model("Hack", userSchema);
// -----------------------------------------------------


export async function POST(request: NextRequest) {
  try {
    // 1. Establish the database connection using our robust cached function
    await dbConnect();

    // 2. Extract the username from the request body
    const body = await request.json();
    const { username } = body;

    // 3. Validate the input
    if (!username || username.trim() === "") {
      return NextResponse.json(
        { error: "Username is required" }, 
        { status: 400 }
      );
    }

    // 4. Create and save the new user
    // The timestamps (createdAt, updatedAt) are generated automatically by the schema
    const newUser = await hack.create({ username });

    // 5. Return a clean success response
    return NextResponse.json({
      success: true,
      message: "User created successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        createdAt: newUser.createdAt,
      }
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("POST API Error:", error);

    // Cast the error to 'any' so we can safely check for the MongoDB specific 'code' property
    const mongoError = error as any;

    // Handle MongoDB duplicate key error (username already exists)
    if (mongoError?.code === 11000) {
      return NextResponse.json(
        { error: "That username is already taken" }, 
        { status: 409 } 
      );
    }

    // Handle standard Error objects for a better fallback message
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";

    // Handle all other errors
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}
