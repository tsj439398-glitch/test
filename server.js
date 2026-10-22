import WebSocket, { WebSocketServer } from "ws";
import express from "express";
import cors from "cors";
import { createServer } from "http";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const server = createServer(app);
const wss = new WebSocketServer({ server });

const data = {
  id: 1,
  nama: "Josse Surya Pinem.",
  email: "pinemjosse@gmail.com",
};

app.get("/api/user", (req, res) => {
  res.status(200).json({
    message: "Data user berhasil diambil",
    data,
  });
});

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Selamat Datang di API....",
    data: {},
  });
});

let counter = 0;

wss.on("connection", (ws) => {
  console.log("Client terhubung");

  ws.on("message", (message) => {
    try {
      const payload = JSON.parse(message.toString());

      if (payload.type === "increment") {
        counter++;

        const response = JSON.stringify({
          type: "count",
          value: counter,
        });

        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(response);
          }
        }
      }
    } catch (error) {
      console.error("Pesan tidak valid:", error.message);
    }
  });

  ws.on("close", () => {
    console.log("Client terputus");
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP: http://localhost:${PORT}`);
  console.log(`WebSocket: ws://localhost:${PORT}`);
});
