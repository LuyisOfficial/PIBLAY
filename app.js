// ================= IMPORTS =================
import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";

import { db } from "./db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import campaignRoutes from "./routes/campaign.js";
import trackingRoutes from "./routes/tracking.js";
import adminRoutes from "./routes/admin.js";

// ================= APP =================
const app = Fastify({
  logger: true
});

// ================= SECURITY =================

// Helmet (headers sécurisés)
app.register(helmet);

// Rate limit (anti attaque brute force)
app.register(rateLimit, {
  max: 100,
  timeWindow: "1 minute"
});

// CORS sécurisé (IMPORTANT)
app.register(cors, {
  origin: (origin, cb) => {
    const allowed = [
      "http://localhost:3000",
      "https://piblay.com"
    ];

    if (!origin || allowed.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed"), false);
    }
  },
  credentials: true
});

// Cookies sécurisés
app.register(cookie, {
  secret: process.env.COOKIE_SECRET || "supersecretcookie",
  hook: "onRequest"
});

// JWT sécurisé
app.register(jwt, {
  secret: process.env.JWT_SECRET,
  cookie: {
    cookieName: "token",
    signed: true
  }
});

// ================= AUTH MIDDLEWARE =================
app.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch (err) {
    return reply.code(401).send({
      error: "Unauthorized",
      message: err.message
    });
  }
});

// ================= ROLE MIDDLEWARE =================
app.decorate("adminOnly", async (req, reply) => {
  if (!req.user || req.user.role !== "admin") {
    return reply.code(403).send({
      error: "Access denied"
    });
  }
});

// ================= ROUTES =================
app.register(authRoutes, { prefix: "/api/auth", db });
app.register(userRoutes, { prefix: "/api/user", db });
app.register(campaignRoutes, { prefix: "/api/campaigns", db });
app.register(trackingRoutes, { prefix: "/api/tracking", db });
app.register(adminRoutes, { prefix: "/api/admin", db });

// ================= HEALTH CHECK =================
app.get("/api/health", async () => {
  return { status: "ok", app: "PIBLAY API" };
});

// ================= ERROR HANDLER =================
app.setErrorHandler((err, req, reply) => {
  app.log.error(err);

  reply.status(err.statusCode || 500).send({
    error: "Server error",
    message: err.message
  });
});

// ================= START =================
const start = async () => {
  try {
    await app.listen({
      port: process.env.PORT || 3000,
      host: "0.0.0.0"
    });

    console.log("🚀 PIBLAY SaaS API running");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
