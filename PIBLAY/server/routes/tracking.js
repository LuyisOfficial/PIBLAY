export default async function (app, { db, io }) {

  // IMPRESSION
  app.post("/track/impression", async (req, reply) => {

    const { campaign_id } = req.body;

    await db.query(
      `UPDATE analytics SET impressions = impressions + 1 WHERE campaign_id=$1`,
      [campaign_id]
    );

    const data = await db.query(
      `SELECT * FROM analytics WHERE campaign_id=$1`,
      [campaign_id]
    );

    io.emit("live-data", data.rows[0]);

    return { ok: true };
  });

  // CLICK
  app.post("/track/click", async (req, reply) => {

    const { campaign_id } = req.body;

    await db.query(
      `UPDATE analytics SET clicks = clicks + 1 WHERE campaign_id=$1`,
      [campaign_id]
    );

    const data = await db.query(
      `SELECT * FROM analytics WHERE campaign_id=$1`,
      [campaign_id]
    );

    io.emit("live-data", data.rows[0]);

    return { ok: true };
  });

}