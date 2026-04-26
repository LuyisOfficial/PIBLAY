import fetch from "node-fetch";

const CLIENT_ID = "AZOGWj2PpwXjsung8boLnKMrjD_wCOjU6d6Wo8m7ZEoU33ycX96BFe2MFXrt1f3Rqws753Z8hBRLjJcP";
const SECRET = "EMwd04SGSvcIjO8aUZvLYteWuYdcteauBwdy4MSBO-O5x_cwABXVvp-IH_JhdXb3dLQydZVhfap-dQ-n";

async function getAccessToken() {
  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization": "Basic " + Buffer.from(CLIENT_ID + ":" + SECRET).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: "grant_type=client_credentials"
  });

  const data = await res.json();
  return data.access_token;
}

export default async function (app, db) {

  app.post("/paypal/create-order", async (req, reply) => {

    const { plan, userId, type } = req.body;

    let price = 0;

    if (type === "client") {
      if (plan === "basic") price = "30.00";
      if (plan === "pro") price = "57.00";
      if (plan === "premium") price = "85.00";
    }

    if (type === "agency") {
      price = "10.00";
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
        purchase_units: [{
          amount: { currency_code: "USD", value: price }
        }],
        application_context: {
          return_url: `http://localhost:5500/success.html?user=${userId}`,
          cancel_url: `http://localhost:5500/cancel.html`
        }
      })
    });

    const data = await res.json();

    return { id: data.id };
  });

}



app.post("/paypal/capture-order", async (req, reply) => {

  const { orderID, userId } = req.body;

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

  // ACTIVER COMPTE
  await db.query(
    `UPDATE users SET active=true WHERE id=$1`,
    [userId]
  );

  return data;
});

