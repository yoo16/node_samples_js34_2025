// Express の初期化
const express = require('express')
const app = express()
const http = require('http').createServer(app)

// UUID の初期化
const uuidv4 = require('uuid').v4

// Socket.IO の初期化
const io = require('socket.io')(http, {
    // 10MB まで許可（デフォルトは 1MB）
    maxHttpBufferSize: 10e6
});

// 環境変数の読み込み
const dotenv = require('dotenv');
dotenv.config();
// ホストとポートの読み込み
const host = process.env.HOST
const port = process.env.PORT

// ユーザ情報を保存する配列
let users = {};

// ejs を view engine に設定
app.use(express.static(__dirname + '/public'))

// TODO: / に アクセスしたら index.ejs をレンダリング
app.get('/', (req, res) => {
    res.render('index.ejs');
});

logout = (socket) => {
    console.log('logout');

    // ユーザ情報取得
    if (!users) return;
    let user = users[socket.id];
    if (!user) return;

    //ユーザ削除
    delete users[socket.id];

    // TODO: 送信元以外全てのクライアントに送信
}

// Socket.IO の接続イベント
io.on('connection', (socket) => {
    // TODO: message の送受信: socket.on('message', (data) => { ... })
    socket.on('message', (data) => {
        // data の内容: { user: { name, icon, token }, message: 'メッセージ内容' }
        // TODO: 日時データを追加
        data.datetime = new Date();
        // TODO: クライアント全員に送信: io.emit('message', data);
        io.emit('message', data);

        console.log('message:', data);
    });

    //ログイン処理
    socket.on('auth', (user) => {
        //トークンがあれば処理しない
        if (user.token) return;

        //トークン発行: ユーザの識別に使用
        user.token = uuidv4();

        //Socket ID をキーに user を配列に追加
        users[socket.id] = user;

        //data の作成
        let data = { user: user, users: users };
        console.log(user);

        // TODO: 送信元のユーザにログイン済みを送信: emit('logined', data); 
        socket.emit('logined', data);

        // TODO: ブロードキャストでユーザログインを送信: emit('user_joined', data)
        socket.broadcast.emit('user_joined', data);
    });

    // TODO: スタンプ送受信: upload_stamp
    // TODO: 日時データを追加
    // TODO: クライアントへ送信: io.emit('upload_stamp', data)
    socket.on('upload_stamp', (data) => {
        data.datetime = new Date();
        io.emit('upload_stamp', data);
        console.log('upload_stamp:', data);
    });

    // TODO: 画像送受信: upload_image
    // TODO: 日時データを追加
    // TODO: クライアントへ送信: io.emit('upload_image', data)

    //ログアウト
    socket.on('logout', () => {
        logout(socket);
    });

    // 切断時の処理
    socket.on('disconnect', () => {
        logout(socket);
    });

})

http.listen(port, host, () => {
    console.log(`listening on http://${host}:${port}`)
})