export default async function (app, { db }) {

  // GET PROFILE
  app.get("/me", { preHandler: [app.authenticate] }, async (req, reply) => {

    const user = await db.query(
      `SELECT id,name,email,role,active FROM users WHERE id=$1`,
      [req.user.id]
    );

    return user.rows[0];
  });

}
