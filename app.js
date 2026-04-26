import Fastify from "fastify";
import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";

import { db } from "./db.js";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import campaignRoutes from "./routes/campaign.js";
import trackingRoutes from "./routes/tracking.js";
import adminRoutes from "./routes/admin.js";

const app = Fastify();

// ================= PLUGINS =================
app.register(cors, {
  origin: true,
  credentials: true
});

app.register(cookie);

app.register(jwt, {
  secret: process.env.JWT_SECRET || "CHANGE_ME"
});

// ================= AUTH MIDDLEWARE =================
app.decorate("authenticate", async (req, reply) => {
  try {
    await req.jwtVerify();
  } catch {
    return reply.code(401).send({ error: "Unauthorized" });
  }
});

// ================= ROUTES =================
app.register(authRoutes, { db });
app.register(userRoutes, { db });
app.register(campaignRoutes, { db });
app.register(trackingRoutes, { db });
app.register(adminRoutes, { db });

// ================= START =================
app.listen({ port: process.env.PORT || 3000, host: "0.0.0.0" })
  .then(() => console.log("🚀 PIBLAY API running"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
  