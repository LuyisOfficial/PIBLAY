import fetch from "node-fetch";

// 🔐 utilise des variables d'environnement (OBLIGATOIRE)
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

// 🔥 URL dynamique (prod ou local)
const BASE_URL = process.env.BASE_URL || "https://www.piblay.com";

// ================= TOKEN =================
async function getAccessToken() {
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(`${CLIENT_ID}:${SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await res.json();
  return data.access_token;
}

// ================= EXPORT MODULE =================
export default async function (app, db) {

  // ================= CREATE ORDER =================
  app.post("/paypal/create-order", async (req, reply) => {

    try {
      const { plan, userId, type } = req.body;

      let price = "0.00";

      if (type === "client") {
        if (plan === "basic") price = "30.00";
        else if (plan === "pro") price = "57.00";
        else if (plan === "premium") price = "85.00";
      }

      if (type === "agency") {
        price = "10.00";
      }

      if (price === "0.00") {
        return reply.status(400).send({ error: "Plan invalide" });
      }

      const accessToken = await getAccessToken();

      const res = await fetch("https://api-m.sandbox.paypal.com/v2/checkout/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: "USD",
                value: price
              }
            }
          ],
          application_context: {
            return_url: `${BASE_URL}/success.html?user=${userId}`,
            cancel_url: `${BASE_URL}/cancel.html`
          }
        })
      });

      const data = await res.json();

      return reply.send({ id: data.id });

    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erreur création paiement" });
    }
  });

  // ================= CAPTURE ORDER =================
  app.post("/paypal/capture-order", async (req, reply) => {

    try {
      const { orderID, userId } = req.body;

      if (!orderID || !userId) {
        return reply.status(400).send({ error: "Données manquantes" });
      }

      const accessToken = await getAccessToken();

      const res = await fetch(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        }
      );

      const data = await res.json();

      // 🔥 vérifier paiement réussi
      if (data.status === "COMPLETED") {
        await db.query(
          `UPDATE users SET active=true WHERE id=$1`,
          [userId]
        );
      }

      return reply.send(data);

    } catch (err) {
      console.error(err);
      return reply.status(500).send({ error: "Erreur capture paiement" });
    }
  });

};
