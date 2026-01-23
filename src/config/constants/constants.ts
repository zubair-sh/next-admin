import { z } from "zod";

// Create a schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_HOST_URL: z.string().min(1, "NEXT_PUBLIC_HOST_URL is required"),
  NEXT_PUBLIC_API_URL: z.string().min(1, "NEXT_PUBLIC_API_URL is required"),
  NEXT_PUBLIC_APP_URL: z.string().min(1, "NEXT_PUBLIC_APP_URL is required"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),

  // Optional/Server-side variables
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  DIRECT_URL: z.string().optional(),
});

// Access process.env explicitly to ensure Next.js inlines them during build
const envVars = {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_HOST_URL: process.env.NEXT_PUBLIC_HOST_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  DATABASE_URL: process.env.DATABASE_URL,
  DIRECT_URL: process.env.DIRECT_URL,
};

// Validate the environment variables
const _env = envSchema.safeParse(envVars);

if (!_env.success) {
  console.error("❌ Invalid environment variables:", _env.error.format());

  // In a strict environment, you might want to throw an error here.
  // For now, we'll log the error.
  if (process.env.NODE_ENV === "production") {
    throw new Error("Invalid environment variables");
  }
}

// Export the validated constants
export const AppConstants = {
  isDev: process.env.NODE_ENV === "development",

  hostUrl: process.env.NEXT_PUBLIC_HOST_URL || "",
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "",
  appUrl: process.env.NEXT_PUBLIC_APP_URL || "",

  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabasePublishableKey:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",

  databaseUrl: process.env.DATABASE_URL || "",
  directUrl: process.env.DIRECT_URL || "",
} as const;

export const AuthKeys = {
  isAuthenticated: "isAuthenticated",
} as const;
