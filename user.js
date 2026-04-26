export default async function (app, { db }) {

  // ================= GET PROFILE =================
  app.get("/me", { preHandler: [app.authenticate] }, async (req, reply) => {

    try {
      const result = await db.query(
        `SELECT id, name, email, role, active 
         FROM users 
         WHERE id = $1`,
        [req.user.id]
      );

      // 🔥 utilisateur non trouvé
      if (result.rows.length === 0) {
        return reply.status(404).send({
          error: "Utilisateur introuvable"
        });
      }

      return reply.send(result.rows[0]);

    } catch (err) {
      console.error("Erreur /me:", err);

      return reply.status(500).send({
        error: "Erreur serveur"
      });
    }

  });

}