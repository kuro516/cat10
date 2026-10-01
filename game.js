// --- 1. ノーツ生成処理 ---
function generateChart() {
    const chart = [];
    const bpm = 135;
    const beatDuration = 60 / bpm;
    
    const sections = [
        { start: 0,   end: 15,  intervalBeats: 2 },   // イントロ
        { start: 15,  end: 45,  intervalBeats: 1 },   // Aメロ
        { start: 45,  end: 65,  intervalBeats: 1 },   // Bメロ
        { start: 65,  end: 100, intervalBeats: 0.5 }, // サビ
        { start: 100, end: 120, intervalBeats: 0.25 },// ラスサビ
        { start: 120, end: 132, intervalBeats: 1 }    // アウトロ
    ];

    let currentLane = 0;

    sections.forEach(sec => {
        let currentTime = sec.start;
        const interval = beatDuration * sec.intervalBeats;

        while (currentTime < sec.end) {
            currentLane = (currentLane + Math.floor(Math.random() * 3) + 1) % 4;

            chart.push({
                time: parseFloat(currentTime.toFixed(2)),
                lane: currentLane,
                spawned: false // 画面に生成されたかの判定フラグを追加
            });

            currentTime += interval;
        }
    });

    return chart;
}

// --- 2. 変数の準備 ---
const chartData = generateChart(); // ゲーム開始時に譜面を即時生成
let startTime = 0;
let isPlaying = false;

// --- 3. ゲームスタート関数 ---
function startGame() {
    startTime = Date.now();
    isPlaying = true;
    
    // 音楽再生処理があればここで実行
    // const bgm = new Audio('usagi_rocket.mp3');
    // bgm.play();

    requestAnimationFrame(updateGame);
}

// --- 4. ゲームループ（毎フレーム実行） ---
function updateGame() {
    if (!isPlaying) return;

    // ゲーム開始からの経過時間（秒）
    const elapsedTime = (Date.now() - startTime) / 1000;

    // まだ描画/判定されていないノーツをチェック
    chartData.forEach(note => {
        // ノーツのタイミングの少し前（例: 2秒前）になったら画面に出現させる
        if (!note.spawned && elapsedTime >= note.time - 2.0) {
            spawnNoteUI(note); // 画面上にノーツ要素を作成する関数（お手持ちの描画処理）
            note.spawned = true;
        }
    });

    requestAnimationFrame(updateGame);
}