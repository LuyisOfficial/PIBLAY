export default async function (app, { db }) {

  // CREER CAMPAGNE
  app.post("/campaign/create", { preHandler: [app.authenticate] }, async (req, reply) => {

    const { name, client_id, budget } = req.body;
    const agency_id = req.user.id;

    const result = await db.query(
      `INSERT INTO campaigns (name, client_id, agency_id, budget)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, client_id, agency_id, budget]
    );

    // créer analytics auto
    await db.query(
      `INSERT INTO analytics (campaign_id) VALUES ($1)`,
      [result.rows[0].id]
    );

    return result.rows[0];
  });

  // LISTE CAMPAGNES AGENCE
  app.get("/campaign/my", { preHandler: [app.authenticate] }, async (req, reply) => {

    const campaigns = await db.query(
      `SELECT * FROM campaigns WHERE agency_id=$1`,
      [req.user.id]
    );

    return campaigns.rows;
  });

}
