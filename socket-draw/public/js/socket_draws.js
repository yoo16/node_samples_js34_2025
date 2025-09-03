// TODO: Socket.IO クライアント初期化
const socket = io();

// Canvas 取得
const canvas = document.getElementById("canvas");
// コンテキスト取得
const ctx = canvas.getContext("2d");

// ドローイング状態
let drawing = false;
// 最後の座標
let lastX = 0, lastY = 0;
// 色の初期値
let color = document.getElementById("colorPicker").value;
// 太さの初期値
let size = document.getElementById("sizePicker").value;

// 線を描く処理
function drawLine(x1, y1, x2, y2, color, size) {
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// クリア処理
function clearCanvas() {
    const toX = canvas.width;
    const toY = canvas.height;
    // TODO: (0, 0) から (toX, toY) をクリア
    ctx.clearRect(0, 0, toX, toY);
}

// ------------------------------
// 🎮 イベントリスナー
// ------------------------------
// 描画開始
canvas.addEventListener("mousedown", (e) => {
    drawing = true;
    // タッチした座標を保存
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

// 描画終了
canvas.addEventListener("mouseup", () => drawing = false);
canvas.addEventListener("mouseout", () => drawing = false);

// マウス移動時
canvas.addEventListener("mousemove", (e) => {
    // ドローイング状態でなければ終了
    if (!drawing) return;

    // 現在の座標取得
    const x = e.offsetX;
    const y = e.offsetY;

    // TODO: 描画: drawLine() を使用
    // データ: lastX, lastY, x, y, color, size
    drawLine(lastX, lastY, x, y, color, size);

    // TODO: サーバ送信信
    // draw のキーワードで、座標と色、太さを送信
    socket.emit("draw", {
        x1: lastX,
        y1: lastY,
        x2: x,
        y2: y,
        color: color,
        size: size
    });

    // 最新の座標を保存
    [lastX, lastY] = [x, y];
});

// 色変更
document.getElementById("colorPicker").addEventListener("input", (e) => {
    // TODO: 色変更
    color = e.target.value;
});

// 太さ変更
document.getElementById("sizePicker").addEventListener("input", (e) => {
    // TODO: 太さ変更
    size = e.target.value;
});

// クリアボタン
document.getElementById("clearBtn").addEventListener("click", () => {
    clearCanvas();
    // TODO: クリアイベント送信
    socket.emit("clear");
});

// ダウンロード処理
document.getElementById("downloadBtn").addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "canvas.png"; // 保存ファイル名
    link.href = canvas.toDataURL("image/png");
    link.click();
});


// ------------------------------
// 🌐 Socket.IO 受信イベント
// ------------------------------
// TODO: 描画イベント受信
// TODO: 受信データで描画
socket.on("draw", (data) => {
    drawLine(data.x1, data.y1, data.x2, data.y2, data.color, data.size);
});

// TODO: クリアイベント受信
// TODO: 画面クリア
socket.on("clear", () => {
    clearCanvas();
});