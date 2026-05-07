export const SiteConfig = {
  // 全域設定
  global: {
    password: "1234", // 進入網站的專屬密碼 (若留空字串 "" 則無密碼鎖)
  },

  // 基本設定
  girlfriendName: "親愛的 伴侶名字", // 您可以在這裡替換成女友的暱稱或本名

  // Section 1: 神秘入口
  hook: {
    message: "給 [伴侶名字] 的一份小驚喜...", // 您也可以在這裡直接換掉 [名字]
    envelopeText: "✉️ 點擊解鎖"
  },

  // Section 2: 驚喜破題
  reveal: {
    title: "Happy Birthday!",
    subtitle: "這是我們一起度過的第 [數字] 個專屬日子!!"
  },

  // Section 3: 回憶長廊 (未來新增照片只要在這裡加一行即可)
  // 圖片請統一放在 src/assets/images/ 目錄下
  memoryLane: [
    { imagePath: "sample.jpg", caption: "還記得我們第一次去海邊玩嗎？" },
    { imagePath: "sample.jpg", caption: "那天我們笑得好開心！" },
    { imagePath: "sample.jpg", caption: "這是我最喜歡的一張合照！" },
    { imagePath: "sample.jpg", caption: "未來的日子也要一起走下去喔～" }
  ],

  // Section 4: 告白信 (每一行是一個段落)
  message: {
    paragraphs: [
      "很高興能夠認識你，並且跟你一起走到今天。",
      "這份小小的數位禮物，是我偷偷準備了很久的驚喜。",
      "希望你在看到的時候，能感受到滿滿的誠意與溫暖。",
      "不管未來遇到什麼困難，",
      "我都會像是這些文字一樣，",
      "一個字一個字、踏踏實實地陪伴在你身邊。",
      "祝你生日快樂，每天都要開開心心的喔！"
    ],
    signature: "— 最愛你的 [你的名字] ❤️" // 手寫簽名，打字機結束後淡入
  },

  // Section 5: 結尾 — 拍立得尋寶線索
  climax: {
    buttonText: "🌟 妳的專屬生日禮物藏在... 🌟",
    polaroidImage: "sample.jpg", // 請替換為藏禮物地點的暗示照片
    polaroidCaption: "快去沙發底下找找吧!!"
  },

  // 全域設定: 背景音樂
  music: {
    bgmPath: "lofi-bgm.mp3", // 預設放於 src/assets/audio/ 目錄下 (請確保已放入無版權音樂或專屬音樂)
    volume: 0.4 // 音量預設大小 (0.0 到 1.0 之間)。備註：iOS 手機原生限制會無視此設定
  }
};
