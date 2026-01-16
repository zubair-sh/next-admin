import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
  }

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );
}
