import { verifyOtp } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  if (tokenHash && type) {
    try {
      await verifyOtp(type, tokenHash);
      redirect(next);
    } catch (error) {
      redirect(`/error?error=${error instanceof Error ? error.message : ""}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/error?error=No token hash or type`);
}
