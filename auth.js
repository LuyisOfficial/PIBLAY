import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export default async function (app, { db }) {

  // ================= REGISTER =================
  app.post("/register", async (req, reply) => {
    try {
      const { name, email, password, role } = req.body;

      // 🔐 validation
      if (!name || !email || !password || !role) {
        return reply.code(400).send({ error: "Champs manquants" });
      }

      if (password.length < 6) {
        return reply.code(400).send({ error: "Mot de passe trop court" });
      }

      // 🔎 vérifier si email existe
      const existing = await db.query(
        `SELECT id FROM users WHERE email=$1`,
        [email]
      );

      if (existing.rows.length > 0) {
        return reply.code(400).send({ error: "Email déjà utilisé" });
      }

      // 🔐 hash password
      const hashed = await bcrypt.hash(password, 12);

      const id = "PB-" + uuidv4();

      await db.query(
        `INSERT INTO users (id, name, email, password, role)
         VALUES ($1, $2, $3, $4, $5)`,
        [id, name, email, hashed, role]
      );

      return { success: true };

    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

  // ================= LOGIN =================
  app.post("/login", async (req, reply) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return reply.code(400).send({ error: "Champs manquants" });
      }

      const result = await db.query(
        `SELECT * FROM users WHERE email=$1`,
        [email]
      );

      const user = result.rows[0];

      if (!user) {
        return reply.code(404).send({ error: "Utilisateur introuvable" });
      }

      if (user.active === false) {
        return reply.code(403).send({ error: "Compte non activé" });
      }

      const valid = await bcrypt.compare(password, user.password);

      if (!valid) {
        return reply.code(401).send({ error: "Mot de passe incorrect" });
      }

      // 🔐 JWT
      const token = app.jwt.sign({
        id: user.id,
        role: user.role
      }, { expiresIn: "2h" });

      // 🍪 cookie sécurisé
      reply.setCookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // 🔥 important
        sameSite: "strict"
      });

      return {
        success: true,
        role: user.role
      };

    } catch (err) {
      console.error(err);
      return reply.code(500).send({ error: "Erreur serveur" });
    }
  });

}
