import WebSocket, { WebSocketServer } from "ws";

const port = 3000;

const wss = new WebSocketServer({
  host: "0.0.0.0",
  port,
});

wss.on("connection", (ws) => {
  console.log("Client terhubung");

  // Kirim nilai counter saat client baru masuk
  ws.send(
    JSON.stringify({
      type: "count",
      value: 0,
    }),
  );

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());

      if (data.type === "increment") {
        const message = JSON.stringify({
          type: "count",
          value: data.value,
        });

        for (const client of wss.clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        }
      }
    } catch (error) {
      console.error("Pesan tidak valid");
    }
  });

  ws.on("close", () => {
    console.log("Client terputus");
  });
});

console.log(`WebSocket berjalan di port ${port}`);
