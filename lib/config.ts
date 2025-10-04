// Razorpay Configuration
export const RAZORPAY_CONFIG = {
  KEY_ID: "rzp_test_mhBjQFvKP3noff",
  KEY_SECRET: "BQeampTmQOwRTXkZwXZrN6Ze",
} as const;

// Environment configuration
export const ENV_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || "development",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
} as const;
