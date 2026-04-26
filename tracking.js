export default async function (app, { db, io }) {

  // ================= IMPRESSION =================
  app.post("/track/impression", async (req, reply) => {

    try {
      const { campaign_id } = req.body;

      if (!campaign_id) {
        return reply.status(400).send({ error: "campaign_id requis" });
      }

      // 🔥 update + return en 1 seule requête
      const result = await db.query(
        `UPDATE analytics
         SET impressions = impressions + 1
         WHERE campaign_id = $1
         RETURNING *`,
        [campaign_id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: "Campagne introuvable" });
      }

      const data = result.rows[0];

      // 📡 envoyer seulement si socket dispo
      if (io) {
        io.emit("live-data", data);
      }

      return reply.send({ ok: true, data });

    } catch (err) {
      console.error("Erreur impression:", err);
      return reply.status(500).send({ error: "Erreur serveur" });
    }
  });

  // ================= CLICK =================
  app.post("/track/click", async (req, reply) => {

    try {
      const { campaign_id } = req.body;

      if (!campaign_id) {
        return reply.status(400).send({ error: "campaign_id requis" });
      }

      const result = await db.query(
        `UPDATE analytics
         SET clicks = clicks + 1
         WHERE campaign_id = $1
         RETURNING *`,
        [campaign_id]
      );

      if (result.rows.length === 0) {
        return reply.status(404).send({ error: "Campagne introuvable" });
      }

      const data = result.rows[0];

      if (io) {
        io.emit("live-data", data);
      }

      return reply.send({ ok: true, data });

    } catch (err) {
      console.error("Erreur click:", err);
      return reply.status(500).send({ error: "Erreur serveur" });
    }
  });

}