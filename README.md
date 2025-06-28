Project Seeker's Gate: The Digital Epic of TJ YANG
這不僅僅是一個個人作品集網站，而是一個互動式的、以敘事驅動的數位宇宙。專案的核心理念源於一句話：「關鍵在於精神。(The key is the spirit.)」。訪客將化身為一名冒險者，追隨主角 T-J 的星際旅程，從泰拉星（Terra）的啟程 ，到最終在伊克瑞斯（EKERES）開啟傳說中的「探索者之門」。




整個體驗圍繞著 T-J 在冒險中獲得的五枚「精神徽章」展開 ，每一枚徽章都對應著一個核心專案，以及一種核心的人類價值。本專案的目標是透過尖端的網頁技術，將這個充滿情感與哲思的冒險故事，轉化為一場令人沉醉的沉浸式體驗。

核心功能 (Core Features)
互動式 3D 環境: 使用 Three.js 打造的深邃宇宙背景，包含動態的星環、星塵以及可互動的星球。

電影級動畫: 運用 GSAP (GreenSock Animation Platform) 實現所有視圖切換、鏡頭運動和 UI 互動，確保流暢與視覺衝擊力。

單頁應用程式 (SPA) 體驗: 無刷新的三階段式體驗流程 (門戶 -> 星圖 -> 星球)，提供無縫的敘事沉浸感。

無縫國際化 (i18n): 內建繁體中文、英文、日文三語系，所有文本內容皆為動態載入，確保全球訪客的體驗一致性。

動態專案內容: 星球（專案）的詳細資訊從數據結構中動態載入，易於維護與擴展。

技術棧 (Technical Stack)
前端框架: JavaScript (ES6+)

3D 渲染: Three.js (r128)

動畫庫: GSAP (3.11.4)

國際化: i18next (23.7.6)

構建: 無 (直接透過本地伺服器運行)

專案結構 (Project Structure)
/TJ_YANG_PORTFOLIO
|-- index.html              # 應用程式主體 HTML
|-- style.css               # 全局樣式表
|-- main.js                 # 核心 JavaScript 邏輯
|-- README.md               # 本說明文件
|-- /assets                 # 圖片資源
|   |-- terra.jpg
|   |-- cybennah.jpg
|   |-- aquatica.jpg
|   |-- eclipsia.jpg
|   |-- ekeres.jpg
|-- /locales                # i18n 語言包
|   |-- zh-TW.json
|   |-- en.json
|   |-- ja.json
資源需求 (Asset Requirements)
專案需要以下 5 張專案主視覺圖，請將其放置在 /assets 資料夾內。

terra.jpg: 對應「旅途圓 Hanger」專案。

cybennah.jpg: 對應「PAW 跑鞋」專案。

aquatica.jpg: 對應「MANTA 推進器」專案。

eclipsia.jpg: 對應「Eclipse 時鐘」專案。

ekeres.jpg: 對應「GATHER 集結之椅」專案。

建議規格:

尺寸: 1920x1080px 或更高，保持 16:9 長寬比。

格式: JPG, PNG, or WebP。

優化: 請確保圖片在保持高品質的同時，經過壓縮以優化網頁載入速度。

安裝與運行 (Setup and Installation)
由於專案使用 fetch API 載入本地語言檔案，無法直接透過雙擊 index.html 運行。請遵循以下步驟：

克隆或下載專案: 將所有檔案下載到本地。

放置資源: 確保上述 5 張圖片已放置在 /assets 資料夾中。

啟動本地伺服器:

推薦方式 (VS Code): 安裝 Live Server 擴充套件。在 index.html 檔案上點擊右鍵，選擇 Open with Live Server。

Python 方式: 在專案根目錄下打開終端機，執行 python -m http.server。然後在瀏覽器中訪問 http://localhost:8000。

Node.js 方式: 首先，全局安裝 serve (npm install -g serve)。然後在專案根目錄下執行 serve。

敘事與互動流程 (Narrative & Interactive Flow)
應用的體驗流程被設計為三個主要階段：

第一階段：The Gate (探索者之門)
目標: 建立專案的核心世界觀。


畫面: 訪客進入網站後，會看到在浩瀚星空中緩緩旋轉的四個星環，以及核心標語「關鍵在於精神」。

互動: 點擊「開啟旅程」按鈕後，將觸發過渡動畫，進入下一階段。

第二階段：The Star Map (靈魂星圖)
目標: 提供一個非線性的、可自由探索的專案導航。

畫面: 鏡頭穿過星環後，來到一個更廣闊的宇宙空間。五顆代表不同專案的星球懸浮其中。

互動:

移動滑鼠: 鏡頭會輕微跟隨滑鼠移動，創造景深感。

懸停星球: 當滑鼠懸停在某個星球上時，該星球會發光，並在畫面底部顯示其名稱和所代表的精神。

點擊星球: 選擇一顆星球後，鏡頭將平滑地飛向該星球，進入專案詳情頁。

第三階段：The Planet (星球專案頁)
目標: 詳細展示單個專案的敘事與設計細節。

畫面: 介面分為左右兩部分，左側為專案主視覺圖，右側為詳細的文字說明。

內容: 頁面內容根據所選星球動態載入。五個星球及其對應的精神徽章如下：


Terra: 旅途圓 Hanger - 初始之心精神 。


Cybennah: PAW 跑鞋 - 極致運動家精神 。


Aquatica: MANTA 推進器 - 探索者精神 。


Eclipsia: Eclipse 時鐘 - 永恆之愛精神 。


Ekeres: GATHER 集結之椅 - 合作精神 。

互動: 點擊左上角的「返回星圖」按鈕，鏡頭將從當前星球平滑拉遠，回到星圖視圖，讓訪客可以繼續探索其他星球。
