import { z } from 'zod';

// ---------------------------------------------------------------------------
// Environment variable schema — validated at startup
// ---------------------------------------------------------------------------
const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_API_KEY is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z
    .string()
    .min(1, 'NEXT_PUBLIC_FIREBASE_APP_ID is required'),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url('NEXT_PUBLIC_SITE_URL must be a valid URL'),
  NEXT_PUBLIC_DEFAULT_LOCALE: z.enum(['ar', 'en']).default('ar'),
  NEXT_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
  NEXT_PUBLIC_USE_FIREBASE_EMULATOR: z
    .string()
    .transform((v: string) => v === 'true')
    .default('false'),
});

// Parse on module load — throws at startup if config is invalid
const parsed = envSchema.safeParse({
  NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_DEFAULT_LOCALE: process.env.NEXT_PUBLIC_DEFAULT_LOCALE,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  NEXT_PUBLIC_USE_FIREBASE_EMULATOR:
    process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR,
});

if (!parsed.success) {
  console.error(
    '❌ Invalid environment configuration:',
    parsed.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment configuration. See error above.');
}

export const env = parsed.data;

// Convenience flags
export const isProduction = env.NEXT_PUBLIC_APP_ENV === 'production';
export const isStaging = env.NEXT_PUBLIC_APP_ENV === 'staging';
export const isDevelopment = env.NEXT_PUBLIC_APP_ENV === 'development';
