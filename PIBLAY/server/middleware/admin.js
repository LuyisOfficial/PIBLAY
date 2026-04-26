export default async function (req, reply) {
  if (req.user.role !== "admin") {
    return reply.code(403).send("Accès refusé");
  }
}
