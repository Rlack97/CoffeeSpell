const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  // 클라이언트에게 고유한 ID 할당
  const clientId = Date.now().toString(); // 현재 시간을 ID로 사용
  clients[clientId] = ws;

  ws.on("message", function incoming(message) {
    // 받은 메시지 처리
    console.log("received: %s", message);
    // 메시지를 보내지 않은 클라이언트에게 전송
    Object.keys(clients).forEach((clientId) => {
      if (
        clients[clientId] !== ws &&
        clients[clientId].readyState === WebSocket.OPEN
      ) {
        clients[clientId].send(message);
      }
    });
  });

  ws.on("close", function () {
    console.log("Client disconnected");
    // 연결이 종료된 클라이언트 제거
    delete clients[clientId];
  });
});
