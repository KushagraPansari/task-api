import dotenv from "dotenv";
dotenv.config();

const config = Object.freeze({
  node_env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    uri: process.env.MONGODB_URI,
  },
  jwt: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessExpiry: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiry: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  },
  cors: {
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:5173"],
  },
});

// Validate critical config at startup
const requiredVars = ["db.uri", "jwt.accessSecret", "jwt.refreshSecret"];
for (const key of requiredVars) {
  const value = key.split(".").reduce((obj, k) => obj?.[k], config);
  if (!value) {
    throw new Error(`Missing required config: ${key}`);
  }
}

export default config;