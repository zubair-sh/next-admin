import { ROUTES } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { type NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get("origin");
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/${ROUTES.DASHBOARD}`,
      },
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!dbUser) {
      await prisma.user.create({
        data: {
          id: data?.user?.id,
          email: data?.user?.email,
          role: Role.STUDENT,
        },
      });
    }

    return NextResponse.json({ user: dbUser }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
