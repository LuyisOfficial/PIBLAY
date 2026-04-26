import adminOnly from "../middleware/admin.js";

export default async function (app, { db }) {

  // TOUS LES USERS
  app.get("/admin/users",
    { preHandler: [app.authenticate, adminOnly] },
    async () => {

      const users = await db.query(`SELECT id,name,email,role,active FROM users`);
      return users.rows;
    }
  );

  // SUPPRIMER USER
  app.delete("/admin/user/:id",
    { preHandler: [app.authenticate, adminOnly] },
    async (req) => {

      await db.query(`DELETE FROM users WHERE id=$1`, [req.params.id]);
      return { success: true };
    }
  );

  // ACTIVER / DESACTIVER
  app.put("/admin/user/:id/toggle",
    { preHandler: [app.authenticate, adminOnly] },
    async (req) => {

      await db.query(
        `UPDATE users SET active = NOT active WHERE id=$1`,
        [req.params.id]
      );

      return { success: true };
    }
  );

  // VOIR CAMPAGNES
  app.get("/admin/campaigns",
    { preHandler: [app.authenticate, adminOnly] },
    async () => {

      const campaigns = await db.query(`SELECT * FROM campaigns`);
      return campaigns.rows;
    }
  );

}
