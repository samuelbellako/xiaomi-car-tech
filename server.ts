import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { Resend } from "resend";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;
const ORDERS_FILE = path.join(process.cwd(), "orders.json");

// Parse JSON request bodies
app.use(express.json());

// Load initial orders or set default
let orders: any[] = [];
try {
  if (fs.existsSync(ORDERS_FILE)) {
    const rawData = fs.readFileSync(ORDERS_FILE, "utf-8");
    orders = JSON.parse(rawData);
    console.log(`Loaded ${orders.length} orders from orders.json`);
  } else {
    // Scaffold default mock orders to make the admin panel look immediately professional
    orders = [
      {
        id: "XM-74291",
        customerName: "Carlos Mario Restrepo",
        customerEmail: "carlos.mario@hotmail.com",
        customerPhone: "+57 312 456 7890",
        customerAddress: "Calle 10 #43A-30, El Poblado",
        customerCity: "Medellín",
        paymentMethod: "Nequi",
        paymentDetails: {
          transactionId: "NEQ-99210283",
          extraMessage: "Celular Nequi: 3124567890. Captura de pantalla enviada por WhatsApp."
        },
        amount: 179900,
        status: "APPROVED",
        createdAt: new Date(Date.now() - 3 * 3600_000).toISOString(),
        items: [{ name: "Mi 20W Wireless Car Charger", price: 179900, quantity: 1 }]
      },
      {
        id: "XM-32819",
        customerName: "Andrea Gómez",
        customerEmail: "andrea.gomez.dev@gmail.com",
        customerPhone: "+57 320 889 1234",
        customerAddress: "Avenida 19 #103-45, Apto 502",
        customerCity: "Bogotá",
        paymentMethod: "Wompi",
        paymentDetails: {
          transactionId: "WMP-987152019-B",
          extraMessage: "Transacción aprobada por Wompi PSE."
        },
        amount: 359800,
        status: "PENDING",
        createdAt: new Date(Date.now() - 1 * 3600_000).toISOString(),
        items: [{ name: "Mi 20W Wireless Car Charger", price: 179900, quantity: 2 }]
      }
    ];
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  }
} catch (error) {
  console.error("Error standardizing orders storage:", error);
}

// Save helpers
function saveOrders() {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    console.error("Failed to write orders.json:", error);
  }
}

// Get the Resend API Key securely server-side
const resendApiKey = process.env.RESEND_API_KEY || "";
const resendClient = resendApiKey ? new Resend(resendApiKey) : null;

if (resendClient) {
  console.log("Resend client successfully initialized with provided secret API Key.");
} else {
  console.log("Resend API Key not supplied in environment. Running in SIMULATION mode.");
}

// -------------------------------------------------------------
// API Endpoints
// -------------------------------------------------------------

// Service configuration check
app.get("/api/config", (req, res) => {
  res.json({
    emailConfigurationActive: !!resendApiKey,
    appUrl: process.env.APP_URL || "https://xiaomicartech.com.co",
    adminTargetEmail: "cic.inmuebles@gmail.com"
  });
});

// GET all orders
app.get("/api/orders", (req, res) => {
  // Return descending by date
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  res.json(sortedOrders);
});

// POST to register a new sale / order
app.post("/api/orders", async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerCity,
    paymentMethod,
    paymentDetails = {},
    amount,
    items
  } = req.body;

  if (!customerName || !customerEmail || !customerPhone || !amount || !items || !items.length) {
    return res.status(400).json({ error: "Faltan campos obligatorios para registrar la compra." });
  }

  // Create clean order ID like XM-12345
  const randNum = Math.floor(10000 + Math.random() * 90000);
  const orderId = `XM-${randNum}`;

  const newOrder = {
    id: orderId,
    customerName,
    customerEmail,
    customerPhone,
    customerAddress,
    customerCity,
    paymentMethod,
    paymentDetails,
    amount,
    status: "PENDING", // Defaults to pending until approved by commerce
    createdAt: new Date().toISOString(),
    items
  };

  orders.push(newOrder);
  saveOrders();

  // Create an elegant HTML transaction email
  const itemsHtml = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eeeeee; text-align: right; font-weight: bold;">$${(
        item.price * item.quantity
      ).toLocaleString("es-CO")} COP</td>
    </tr>
  `
    )
    .join("");

  const emailHtmlContent = `
    <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <div style="background-color: #ff6900; padding: 30px; text-align: center;">
        <span style="font-size: 28px; font-weight: 900; color: white; letter-spacing: -1px;">Xiaomi CarTech</span>
        <span style="font-size: 14px; color: white; opacity: 0.9; display: block; margin-top: 5px;">xiaomicartech.com.co - Distribuidor Autorizado</span>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <h2 style="color: #191919; margin-top: 0; font-size: 22px; font-weight: 700;">¡Hola ${customerName}!</h2>
        <p style="color: #666666; font-size: 15px; line-height: 1.5;">Hemos registrado tu pedido con éxito. Aquí tienes el resumen de tu compra en nuestra pasarela de pagos:</p>
        
        <div style="background-color: #fff2e8; border-color: #ffdacc; border-width: 1px; border-style: solid; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; font-size: 14px; color: #1c1b1b;">
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">Pedido ID:</td>
              <td style="text-align: right; font-family: monospace; font-weight: bold; color: #ff6900;">#${orderId}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">Estado inicial:</td>
              <td style="text-align: right; color: #ffa000; font-weight: bold;">PENDIENTE (Validando Pago)</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">Medio de Pago:</td>
              <td style="text-align: right; font-weight: bold; text-transform: uppercase;">${paymentMethod}</td>
            </tr>
            <tr>
              <td style="font-weight: bold; padding: 4px 0;">Fecha:</td>
              <td style="text-align: right;">${new Date().toLocaleDateString("es-CO")}</td>
            </tr>
          </table>
        </div>

        <h3 style="font-size: 16px; font-weight: 600; color: #191919; margin: 25px 0 10px 0; border-bottom: 2px solid #ff6900; padding-bottom: 5px;">Artículos Adquiridos</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
          <thead>
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 10px; font-weight: bold;">Producto</th>
              <th style="padding: 10px; font-weight: bold; text-align: center;">Cant.</th>
              <th style="padding: 10px; font-weight: bold; text-align: right;">Precio</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding: 15px 10px; font-weight: bold; font-size: 16px;">Total a Pagar:</td>
              <td style="padding: 15px 10px; text-align: right; font-weight: 900; font-size: 18px; color: #ff6900;">$${amount.toLocaleString(
                "es-CO"
              )} COP</td>
            </tr>
          </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 14px; border-top: 1px solid #eeeeee; padding-top: 20px;">
          <h4 style="font-size: 14px; font-weight: bold; color: #191919; margin-top: 0; margin-bottom: 5px;">Información de Entrega:</h4>
          <p style="margin: 3px 0; color: #666666;"><strong>Dirección:</strong> ${customerAddress}</p>
          <p style="margin: 3px 0; color: #666666;"><strong>Ciudad:</strong> ${customerCity}</p>
          <p style="margin: 3px 0; color: #666666;"><strong>Teléfono:</strong> ${customerPhone}</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-top: 25px; text-align: center;">
          <p style="font-size: 13px; color: #5a4136; margin: 0;">
            Una vez validado el pago en nuestro sistema por parte del comercio, procederemos inmediatamente con el despacho. Puedes agilizar tu entrega haciendo clic en el siguiente enlace de WhatsApp directo.
          </p>
          <a href="https://wa.me/573000000000?text=Hola%20Xiaomi%20CarTech%2C%20acabo%20de%20completar%20el%20pedido%20%23${orderId}%20de%20un%20Mi%2020W%20Wireless%20Car%20Charger.%20Nombre%3A%20${encodeURIComponent(
            customerName
          )}" style="display: inline-block; background-color: #25D366; color: white; text-decoration: none; padding: 10px 20px; font-weight: bold; border-radius: 30px; margin-top: 12px; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            Relacionar Pedido por WhatsApp
          </a>
        </div>
      </div>
      <div style="background-color: #191919; padding: 20px; text-align: center; font-size: 11px; color: #9a9a9a;">
        <p style="margin: 0;">© 2026 Xiaomi CarTech Colombia. Todos los derechos reservados.</p>
        <p style="margin: 5px 0 0 0;">Esta es una notificación automática de tu compra en xiaomicartech.com.co.</p>
      </div>
    </div>
  `;

  let emailSent = false;
  let emailError = null;

  if (resendClient) {
    try {
      // Dynamic Sender configuration:
      // Once you add your custom domain "xiaomicartech.com.co" to Resend, we send from "notificaciones@xiaomicartech.com.co".
      // Otherwise, during local onboarding/testing, we fallback to Resend's required default "onboarding@resend.dev".
      const senderEmail = resendApiKey.includes("re_") && !resendApiKey.includes("onboarding")
        ? "notificaciones@xiaomicartech.com.co"
        : "onboarding@resend.dev";

      const data = await resendClient.emails.send({
        from: `Xiaomi CarTech <${senderEmail}>`,
        to: [customerEmail],
        cc: ["cic.inmuebles@gmail.com"], // Copy admin
        subject: `Confirmación de Pedido #${orderId} - Xiaomi CarTech`,
        html: emailHtmlContent
      });
      console.log(`E-mail sent via Resend for order ${orderId}:`, data);
      emailSent = true;
    } catch (err: any) {
      console.error("Resend API failed to process e-mail dispatch:", err);
      emailError = err?.message || String(err);
    }
  } else {
    console.log(`[SIMULATION] E-mail captured for ${customerName} (${customerEmail}):`);
    console.log(`CC: cic.inmuebles@gmail.com`);
    console.log(`Subject: Confirmación de Pedido #${orderId}`);
    emailSent = true; // Simulated success
  }

  res.json({
    success: true,
    order: newOrder,
    emailSent,
    emailError,
    simulationMode: !resendApiKey
  });
});

// PUT to approve/decline an order status (Admin panel operation)
app.put("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["PENDING", "APPROVED", "DECLINED"].includes(status)) {
    return res.status(400).json({ error: "Estado no válido para el pedido." });
  }

  const orderIndex = orders.findIndex((o) => o.id === id);
  if (orderIndex === -1) {
    return res.status(404).json({ error: "Pedido no encontrado." });
  }

  orders[orderIndex].status = status;
  saveOrders();

  res.json({ success: true, order: orders[orderIndex] });
});

// DELETE an order
app.delete("/api/orders/:id", (req, res) => {
  const { id } = req.params;
  const orderIndex = orders.findIndex((o) => o.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: "Pedido no encontrado." });
  }

  orders.splice(orderIndex, 1);
  saveOrders();

  res.json({ success: true, deletedId: id });
});

// -------------------------------------------------------------
// Assembly & Routing of Frontend App
// -------------------------------------------------------------

async function start() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted and listening on http://0.0.0.0:${PORT}`);
  });
}

start();
