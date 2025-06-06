document.addEventListener('DOMContentLoaded', () => {
    // 診断コンテンツを表示するエリア
    const quizArea = document.getElementById('quiz-area');
    
    // 質問データ
    const quizData = [
        {
            question: "ご希望の建築予算はどのくらいですか？",
            answers: [
                { text: "〜4,000万円", value: "cost_low" },
                { text: "4,000万円 〜 6,000万円", value: "cost_mid" },
                { text: "6,000万円 〜 8,000万円", value: "cost_high" },
                { text: "8,000万円以上", value: "cost_premium" }
            ]
        },
        {
            question: "家づくりで最も重視するポイントは何ですか？",
            answers: [
                { text: "耐震性・安全性", value: "safety" },
                { text: "省エネ・快適性", value: "comfort" },
                { text: "デザイン・間取り", value: "design" },
                { text: "コストパフォーマンス", value: "cost_performance" }
            ]
        },
        {
            question: "どのようなエリアに住みたいですか？",
            answers: [
                { text: "都心部・駅近（狭小地・3階建て）", value: "urban" },
                { text: "郊外・自然の多いエリア", value: "suburb" }
            ]
        },
        {
            question: "主にどのようなご家族で暮らしますか？",
            answers: [
                { text: "子育て世代", value: "family" },
                { text: "夫婦2人・DINKs", value: "couple" },
                { text: "二世帯住宅", value: "two_family" }
            ]
        },
        {
            question: "好みのデザインのテイストは？",
            answers: [
                { text: "シンプル・モダン", value: "modern" },
                { text: "ナチュラル・自然素材", value: "natural" },
                { text: "重厚感・ホテルライク", value: "luxury" }
            ]
        }
    ];

    // ハウスメーカーのデータと特徴（タグ）
    const makers = [
        { name: "セキスイハイム", tags: ["safety", "comfort", "luxury", "suburb", "cost_high"], url: "https://www.sekisuiheim.com/", description: "ユニット工法による高い耐震性と品質が魅力。快適な室内環境と省エネ性能を両立します。" },
        { name: "大和ハウス工業", tags: ["design", "safety", "luxury", "suburb", "couple", "cost_high"], url: "https://www.daiwahouse.co.jp/jutaku/", description: "自由な設計と高い技術力が強み。環境性能にも優れ、幅広いニーズに対応可能です。" },
        { name: "パナソニックホームズ", tags: ["safety", "luxury", "urban", "comfort", "cost_premium"], url: "https://homes.panasonic.com/", description: "鉄骨構造による強靭な耐震性が特徴。上質で洗練されたデザインを得意とします。" },
        { name: "ヒノキヤグループ", tags: ["cost_performance", "urban", "comfort", "family", "cost_mid"], url: "https://www.hinokiya.jp/", description: "Z空調による快適な全館空調と高いコストパフォーマンスで人気。狭小地での建築も得意です。" },
        { name: "ヤマト住建", tags: ["cost_performance", "comfort", "family", "suburb", "cost_low"], url: "https://www.yamatojk.co.jp/", description: "高い断熱・気密性能を手頃な価格で実現。ZEH基準の省エネ住宅が標準仕様です。" },
        { name: "高砂建設", tags: ["natural", "comfort", "family", "suburb", "cost_mid"], url: "https://www.takasago-kensetsu.co.jp/", description: "国産の西川材を使用した自然素材の家づくりが特徴。健康で快適な暮らしを提案します。" },
        { name: "三井ホーム", tags: ["design", "luxury", "comfort", "couple", "cost_premium"], url: "https://www.mitsuihome.co.jp/", description: "プレミアム・モノコック構法による高い性能と、洗練されたデザイン性が魅力のメーカーです。" },
        { name: "ナイス株式会社", tags: ["natural", "cost_performance", "safety", "family", "cost_mid"], url: "https://www.nice.co.jp/house/", description: "国産材の活用にこだわり、ウッドデザイン賞も受賞。環境性能と快適性を追求します。" },
    ];

    let currentQuestionIndex = 0;
    const userAnswers = [];

    // スタート画面を表示
    function showStartScreen() {
        quizArea.innerHTML = `
            <p class="question-title">いくつかの簡単な質問に答えるだけで、<br>あなたに最適なハウスメーカーが見つかります。</p>
            <div class="options-grid">
                <button id="start-btn" class="option-btn">診断を始める</button>
            </div>
        `;
        document.getElementById('start-btn').addEventListener('click', startQuiz);
    }

    // クイズを開始
    function startQuiz() {
        currentQuestionIndex = 0;
        userAnswers.length = 0;
        showQuestion();
    }

    // 質問を表示
    function showQuestion() {
        const questionData = quizData[currentQuestionIndex];
        const progress = ((currentQuestionIndex) / quizData.length) * 100;
        
        let optionsHtml = '';
        questionData.answers.forEach(answer => {
            optionsHtml += `<button class="option-btn" data-value="${answer.value}">${answer.text}</button>`;
        });

        quizArea.innerHTML = `
            <div id="progress-bar-container">
                <div id="progress-bar" style="width: ${progress}%"></div>
            </div>
            <p id="progress-text">質問 ${currentQuestionIndex + 1}/${quizData.length}</p>
            <h2 class="question-title">${questionData.question}</h2>
            <div class="options-grid">${optionsHtml}</div>
        `;

        document.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                userAnswers.push(e.target.dataset.value);
                currentQuestionIndex++;
                if (currentQuestionIndex < quizData.length) {
                    showQuestion();
                } else {
                    calculateResults();
                }
            });
        });
    }

    // 結果を計算
    function calculateResults() {
        const scores = {};
        makers.forEach(maker => {
            scores[maker.name] = 0;
            maker.tags.forEach(tag => {
                if (userAnswers.includes(tag)) {
                    scores[maker.name]++;
                }
            });
        });
        
        const sortedMakers = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
        showResults(sortedMakers.slice(0, 3));
    }

    // 結果を表示
    function showResults(resultMakerNames) {
        const topMaker = makers.find(m => m.name === resultMakerNames[0]);
        let summary_text = "";
        if (userAnswers.includes("safety")) summary_text = "災害に強く、家族が安心して暮らせる家";
        else if (userAnswers.includes("design")) summary_text = "デザインや間取りにこだわった理想の家";
        else if (userAnswers.includes("cost_performance")) summary_text = "予算内で実現する、高性能で満足度の高い家";
        else summary_text = "夏は涼しく冬は暖かい、快適で健康的な家";

        let resultsHtml = `
            <h2 class="question-title">診断結果</h2>
            <p>あなたにピッタリなのは...</p>
            <h3>「${summary_text}」です！</h3>
            <p>あなたの希望をかなえる、おすすめのハウスメーカーはこちらです。</p>
            <br>
        `;
        
        resultMakerNames.forEach((name, index) => {
            const maker = makers.find(m => m.name === name);
            resultsHtml += `
                <div class="result-card ${index === 0 ? 'rank-1' : ''}">
                    <h2>${maker.name} <span class="rank-badge">${index + 1}位</span></h2>
                    <p class="reason"><strong>【推薦理由】</strong>${maker.description}</p>
                    <a href="${maker.url}" target="_blank" class="result-link">公式サイトを見る</a>
                </div>
            `;
        });

        resultsHtml += `<button id="restart-btn" class="option-btn">もう一度診断する</button>`;
        quizArea.innerHTML = resultsHtml;
        
        document.getElementById('restart-btn').addEventListener('click', showStartScreen);
    }
    
    // 初期画面を表示
    showStartScreen();
});