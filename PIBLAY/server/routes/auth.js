import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export default async function (app, { db }) {

  // REGISTER
  app.post("/register", async (req, reply) => {
    const { name, email, password, role } = req.body;

    const hashed = await bcrypt.hash(password, 12);

    const id = "PB-" + uuidv4();

    await db.query(
      `INSERT INTO users (id,name,email,password,role)
       VALUES ($1,$2,$3,$4,$5)`,
      [id, name, email, hashed, role]
    );

    return { success: true };
  });

  // LOGIN
  app.post("/login", async (req, reply) => {
    const { email, password } = req.body;

    const result = await db.query(
      `SELECT * FROM users WHERE email=$1`,
      [email]
    );

    const user = result.rows[0];
    if (!user) return reply.code(404).send("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return reply.code(401).send("Wrong password");

    const token = app.jwt.sign({
      id: user.id,
      role: user.role
    });

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: false // true en production
    });

    return { role: user.role };
  });

}
