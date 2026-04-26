export default async function (req, reply) {
  try {
    // 🔐 vérifier utilisateur authentifié
    if (!req.user) {
      return reply.code(401).send({ error: "Non authentifié" });
    }

    // 🔐 vérifier rôle admin
    if (req.user.role !== "admin") {
      return reply.code(403).send({ error: "Accès refusé" });
    }

  } catch (err) {
    console.error("Admin middleware error:", err);
    return reply.code(500).send({ error: "Erreur serveur" });
  }
}