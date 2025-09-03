const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Express アプリケーションと HTTP サーバーのセットアップ
const app = express();
const server = http.createServer(app);

// TODO: public フォルダを静的配信
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// TODO: Socket.IO サーバーを初期化
const io = new Server(server);

// Socket.IO の接続イベント
io.on("connection", (socket) => {
    console.log("ユーザー接続:", socket.id);

    // TODO: 描画イベント
    socket.on("draw", (data) => {
        console.log(data);
        // 接続しているユーザーに送信（送信元を除く）
        socket.broadcast.emit("draw", data);
    });

    // TODO: クリアイベント

    // 切断イベント
    socket.on("disconnect", () => {
        console.log("ユーザー切断:", socket.id);
    });
});

server.listen(3000, () => {
    console.log("http://localhost:3000");
});