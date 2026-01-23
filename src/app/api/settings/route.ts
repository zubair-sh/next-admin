import { NextResponse } from "next/server";

export async function GET() {
  // Return basic settings
  return NextResponse.json({
    theme: "light",
    language: "en",
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  // In a real app, you would save settings to database
  // For now, just return the settings
  return NextResponse.json(body);
}
