import pkg from "pg";
const { Pool } = pkg;

// 🔐 variables d'environnement (OBLIGATOIRE)
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,

  // 🔥 SSL obligatoire sur la plupart des hébergeurs (Render, Railway, etc.)
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});
