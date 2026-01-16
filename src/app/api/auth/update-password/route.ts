import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: "Password is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const {
      error,
      data: { user },
    } = await supabase.auth.updateUser({ password });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user?.email },
    });

    if (!dbUser) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    return NextResponse.json(dbUser, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
