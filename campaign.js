export default async function (app, { db }) {

  // ================= CREER CAMPAGNE =================
  app.post("/campaign/create", { preHandler: [app.authenticate] }, async (req, reply) => {

    try {
      const { name, client_id, budget } = req.body;
      const agency_id = req.user.id;

      // 🔐 validation
      if (!name || !client_id || !budget) {
        return reply.status(400).send({ error: "Champs requis manquants" });
      }

      if (isNaN(budget) || Number(budget) <= 0) {
        return reply.status(400).send({ error: "Budget invalide" });
      }

      // 🔥 transaction (IMPORTANT)
      await db.query("BEGIN");

      const result = await db.query(
        `INSERT INTO campaigns (name, client_id, agency_id, budget)
         VALUES ($1,$2,$3,$4)
         RETURNING *`,
        [name, client_id, agency_id, budget]
      );

      const campaign = result.rows[0];

      // 🔥 créer analytics lié
      await db.query(
        `INSERT INTO analytics (campaign_id)
         VALUES ($1)`,
        [campaign.id]
      );

      await db.query("COMMIT");

      return reply.send(campaign);

    } catch (err) {
      await db.query("ROLLBACK");

      console.error("Erreur création campagne:", err);

      return reply.status(500).send({
        error: "Erreur serveur"
      });
    }
  });

  // ================= LISTE CAMPAGNES =================
  app.get("/campaign/my", { preHandler: [app.authenticate] }, async (req, reply) => {

    try {
      const campaigns = await db.query(
        `SELECT c.*, a.impressions, a.clicks, a.conversions
         FROM campaigns c
         LEFT JOIN analytics a ON a.campaign_id = c.id
         WHERE c.agency_id = $1
         ORDER BY c.created_at DESC`,
        [req.user.id]
      );

      return reply.send(campaigns.rows);

    } catch (err) {
      console.error("Erreur campagnes:", err);

      return reply.status(500).send({
        error: "Erreur serveur"
      });
    }
  });

};
