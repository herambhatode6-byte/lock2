import { NextResponse, NextRequest } from 'next/server';


export async function GET() {
  return NextResponse.json({
    authorized: false,
    defaultConcurrency: 0
  });
}




import dbConnect from "@/lib/db"; // Adjust this path based on your folder structure
import User from "@/lib/user"; // Adjust this path based on your folder structure

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
    const newUser = await User.create({ username });

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