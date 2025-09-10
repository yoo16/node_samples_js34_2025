const url = '';
// DOM要素
const chatArea = document.getElementById('chatArea');
const loginArea = document.getElementById('loginArea');
const message = document.getElementById('message');
const myChatList = document.getElementById('myChatList');
const userList = document.getElementById('userList');
const inputName = document.getElementById('inputName');
const iconList = document.getElementById('iconList');
const stampList = document.getElementById('stampList');
const userName = document.querySelectorAll('.userName');

// 定数
const FADE_TIME = 500;
const STAMP_WIDTH = 150;
const IMAGE_WIDTH = 500;

// ユーザ情報
let user = {};
// 接続中のユーザ一覧
let users = {};

// 画像パス
const imagePath = (fileName) => `images/${fileName}`;

// アイコン選択リスト
const createIcons = () => {
    const icons = [...Array(6).keys()].map((i) => `${i + 1}.png`);
    iconList.innerHTML = icons
        .map((icon, index) => {
            const id = `icon_${index + 1}`;
            const checked = index === 0 ? "checked" : "";
            return `
            <label for="${id}" class="inline-flex items-center m-1 cursor-pointer">
                <input type="radio" id="${id}" name="icon" value="${icon}" class="hidden peer" ${checked}>
                <img src="${imagePath(icon)}"
                    class="w-12 h-12 p-1 rounded-full object-cover peer-checked:ring-2 peer-checked:ring-sky-500">
                </label>
            `;
        })
        .join("");
};

// ユーザーリスト更新
const updateUserList = () => {
    if (!users) return;
    // TODO: user.name を表示
    // ユーザを繰り返し処理して、 li 要素を作成
    userList.innerHTML = Object.values(users)
        .map(
            (user) => `
            <li class="flex items-center gap-2 px-2 py-1 border-b border-gray-200">
                <img src="${imagePath(user.icon)}" class="w-8 h-8 rounded-full object-cover">
                <span>${user.name}</span>
            </li>
            `
        )
        .join("");
};

// スタンプリスト
const createStamps = () => {
    const stamps = [...Array(6).keys()].map((i) => `stamp${i + 1}.png`);

    stampList.className = "grid grid-cols-2 id-cols-4 md:grid-cols-6 gap-4 mt-4 hidden";

    stampList.innerHTML = stamps
        .map(
            (stamp, index) => `
            <a class="uploadStamp cursor-pointer block" stamp="stamp_${index + 1}">
            <div class="bg-white">
                <img id="stamp_${index + 1}" src="${imagePath(stamp)}"
                    class="w-24 h-24 object-contain">
            </div>
            </a>
        `
        )
        .join("");
};

// ヘッダー（ユーザー名＋アイコン）
const createHeaderElement = (data, isMyself) => {
    const dateStyle = isMyself
        ? "px-2 text-sky-600 font-semibold"
        : "px-1 text-gray-700";

    const userIcon = data?.user?.icon ? imagePath(data.user.icon) : "images/default.png";
    const userName = data?.user?.name || data?.username || "匿名";

    return `
    <p>
        <small class="${dateStyle}">
            <img src="${userIcon}" class="w-6 h-6 rounded-full inline-block mr-1">
            ${userName}
        </small>
        </p>
    `;
};

// フッター（日付）
const createFooterElement = (data, isMyself) => {
    const date_string = new Date(data.datetime).toLocaleString('ja-JP');
    return `
        <div>
            <small class="text-gray-400 text-xs">${date_string}</small>
        </div>
    `;
};

// メッセージ本体
const createMessageElement = (data, isMyself) => {
    // 改行を <br> に変換
    const message = data.message.replace(/\r?\n/g, "<br>");
    // TODO: message の表示
    if (isMyself) {
        return `
        <div class="inline-block px-3 py-2 max-w-[90%] bg-sky-500 text-white rounded-lg">
            ${message}
        </div>
        `;
    } else {
        return `
        <div class="inline-block px-3 py-2 max-w-[90%] border border-gray-200 text-gray-800 rounded-lg">
            ${message}
        </div>
        `;
    }
};

// メッセージ追加
const createChatMessage = (data) => {
    const isMyself = hasToken(data);
    const headerHTML = createHeaderElement(data, isMyself);
    const messageHTML = createMessageElement(data, isMyself);
    const footerHTML = createFooterElement(data, isMyself);

    const chatHTML = `
    <div class="opacity-0 transition-opacity duration-500">
        ${headerHTML}
        ${messageHTML}
        ${footerHTML}
    </div>
    `;

    // メッセージリストの先頭に追加
    myChatList.insertAdjacentHTML("afterbegin", chatHTML);

    // フェードイン
    setTimeout(() => {
        const firstChild = myChatList.firstElementChild;
        if (firstChild) firstChild.classList.replace("opacity-0", "opacity-100");
    }, 10);
};

// 画像やスタンプの表示
const createChatImage = (data, params) => {
    console.log(data, params);
    const isMyself = hasToken(data);
    const headerHTML = createHeaderElement(data, isMyself);
    const footerHTML = createFooterElement(data, isMyself);

    const chatHTML = `
    <div class="opacity-0 transition-opacity duration-500">
        ${headerHTML}
        <div class="text-center">
            <img src="${data.image}" width="${params.width}">
        </div>
        ${footerHTML}
    </div>
    `;

    // メッセージリストの先頭に追加
    myChatList.insertAdjacentHTML("afterbegin", chatHTML);

    // フェードイン
    setTimeout(() => {
        const firstChild = myChatList.firstElementChild;
        if (firstChild) firstChild.classList.replace("opacity-0", "opacity-100");
    }, 10);
};

// Tokenを利用して自分のメッセージか判定
const hasToken = (data) => data.user.token === user.token;

// DOMContentLoaded イベント
document.addEventListener('DOMContentLoaded', () => {
    // アイコン、スタンプリストの作成
    createIcons();
    createStamps();

    // ログイン画面を非表示
    loginArea.style.display = 'none';
    // チャット画面を非表示
    chatArea.style.display = 'none';

    setTimeout(() => (loginArea.style.display = 'block'), FADE_TIME);

    // ソケット接続
    const socket = io.connect(url);

    // ログイン成功の通知
    socket.on('logined', (data) => {
        console.log("logined:", data);
        if (data.user) {
            user = data.user;
            users = data.users;
            // ユーザー名を表示
            document.querySelectorAll('.userName').forEach(el => {
                el.textContent = user.name;
            });
            // userInfo を表示
            // document.getElementById('userInfo').classList.remove('hidden');
            // ユーザリストの更新
            updateUserList();
        }
    });

    // TODO: チャットメッセージの受信(message): 
    // 受信後に createChatMessage(data) を呼び出してメッセージを表示
    socket.on('message', (data) => {
        // チャットメッセージの表示
        createChatMessage(data);
    });

    // ユーザの入室の通知
    socket.on('user_joined', (data) => {
        users = data.users;
        // TODO: 入室メッセージの表示
        // const msg = `${data.user.name} が入室しました`;
        // myChatList.insertAdjacentHTML("afterbegin", `<small class="text-gray-400 block">${msg}</small>`);

        // ユーザリストの更新
        updateUserList();
    });

    // ユーザの退出の通知
    socket.on('user_left', (data) => {
        users = data.users;

        // TODO: 退出メッセージの表示
        // const msg = `${data.username} が退出しました`;
        // myChatList.insertAdjacentHTML("afterbegin", `<small class="text-gray-400 block">${msg}</small>`);

        // ユーザリストの更新
        updateUserList();
    });

    // TODO: サーバにスタンプ受信: 受信後: createChatImage(data, { width: STAMP_WIDTH }) を呼び出し

    // TODO: サーバに画像受信: 受信後: createChatImage(data, { width: IMAGE_WIDTH }) を呼び出し

    // ログインボタンをクリック
    document.getElementById('login').addEventListener('click', () => {
        // ユーザ名、アイコン
        const name = inputName.value;
        const icon = document.querySelector('input[name=icon]:checked')?.value;

        if (name && icon) {
            loginArea.style.display = 'none';
            chatArea.style.display = 'block';

            // TODO: サーバ認証(auth): name, icon を送信
            socket.emit('auth', { name, icon });
        }
    });

    // メッセージ送信
    document.getElementById('send').addEventListener('click', () => {
        // 未ログインまたはメッセージ無しは送信しない
        if (!user.token || !message.value) return;
        // 送信データ
        const data = { message: message.value, user };
        // TODO: サーバにメッセージ送信(message) 
        socket.emit('message', data);

        // 送信後、メッセージ欄をクリア
        message.value = '';
    });

    // スタンプリスト切替
    document.querySelectorAll('.stamp').forEach((el) => {
        el.addEventListener('click', () => {
            // TODO: スタンプリストの表示・非表示
            stampList.classList.toggle("hidden");
        });
    });

    // スタンプ送信
    stampList.addEventListener('click', (event) => {
        if (event.target.tagName === 'IMG') {
            // 送信データ
            const data =  { user, image: event.target.src }
            // TODO: サーバにスタンプ送信(upload_stamp)
            socket.emit('upload_stamp', data);

            // スタンプリストを隠す
            stampList.classList.add("hidden");
        }
    });

    // 画像アップロード
    const uploadInput = document.getElementById('uploadImage');
    uploadInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            // 送信データ
            const data = { user, image: reader.result };
            // TODO: サーバに画像送信(upload_image)
        };
        reader.readAsDataURL(file);

        // 選び直せるようにリセット
        uploadInput.value = '';
    });

    // ログアウト
    document.getElementById('logout').addEventListener('click', () => {
        // TODO: サーバーに通知: socket.emit('logout');

        // ユーザ情報クリア
        user = {};

        // ログアウト時は userInfo を隠す
        chatArea.style.display = 'none';
        loginArea.style.display = 'block';

        // userInfo を非表示
        document.getElementById('userInfo').classList.add('hidden');
    });
});
