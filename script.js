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

    // ハウスメーカーのデータと特徴（タグ）【全34社対応版】
    const makers = [
        // 大手・有名メーカー
        { name: "セキスイハイム", tags: ["safety", "comfort", "luxury", "suburb", "cost_high", "two_family"], url: "https://www.sekisuiheim.com/", description: "ユニット工法による高い耐震性と品質。快適な室内環境と省エネ性能を両立します。" },
        { name: "大和ハウス工業", tags: ["design", "safety", "luxury", "suburb", "couple", "cost_high", "two_family"], url: "https://www.daiwahouse.co.jp/jutaku/", description: "自由な設計と高い技術力が強み。環境性能にも優れ、幅広いニーズに対応可能です。" },
        { name: "パナソニックホームズ", tags: ["safety", "luxury", "urban", "comfort", "cost_premium", "modern"], url: "https://homes.panasonic.com/", description: "鉄骨構造による強靭な耐震性が特徴。上質で洗練されたデザインを得意とします。" },
        { name: "三井ホーム", tags: ["design", "luxury", "comfort", "couple", "cost_premium", "modern", "natural"], url: "https://www.mitsuihome.co.jp/", description: "プレミアム・モノコック構法による高い性能と、洗練されたデザイン性が魅力のメーカーです。" },
        { name: "住友林業", tags: ["natural", "luxury", "design", "suburb", "cost_premium", "comfort"], url: "https://sfc.jp/", description: "「木の家」のリーディングカンパニー。国産材を活かした質の高いデザインと快適な空間を提案します。" },
        { name: "積水ハウス", tags: ["safety", "design", "luxury", "suburb", "cost_premium", "couple", "two_family"], url: "https://www.sekisuihouse.co.jp/", description: "業界トップクラスの実績と信頼。設計の自由度と先進技術で多様な暮らしを実現します。" },
        { name: "ヘーベルハウス(旭化成ホームズ)", tags: ["safety", "urban", "luxury", "cost_premium", "comfort", "two_family"], url: "https://www.asahi-kasei.co.jp/hebel/", description: "ALCコンクリート「ヘーベル」による高い耐震・耐火性能。都市型住宅の先駆者です。" },
        { name: "トヨタホーム東京", tags: ["safety", "comfort", "suburb", "cost_high", "family"], url: "https://www.toyotahome.co.jp/", description: "自動車で培った技術を活かした鉄骨ラーメン構造。60年長期保証で安心が続きます。" },
        
        // コストパフォーマンス・Z空調など
        { name: "ヒノキヤグループ", tags: ["cost_performance", "urban", "comfort", "family", "cost_mid", "modern"], url: "https://www.hinokiya.jp/", description: "Z空調による快適な全館空調と高いコストパフォーマンスで人気。狭小地での建築も得意です。" },
        { name: "ヤマト住建", tags: ["cost_performance", "comfort", "family", "suburb", "cost_low", "safety"], url: "https://www.yamatojk.co.jp/", description: "高い断熱・気密性能を手頃な価格で実現。ZEH基準の省エネ住宅が標準仕様です。" },
        { name: "アイ工務店", tags: ["cost_performance", "design", "family", "suburb", "cost_mid", "modern"], url: "https://www.ai-koumuten.co.jp/", description: "適正価格で実現する1mm単位の自由設計が魅力。高い住宅性能とデザイン性を両立。" },
        { name: "アキュラホーム", tags: ["cost_performance", "design", "family", "suburb", "cost_mid", "safety"], url: "https://www.aqura.co.jp/", description: "完全自由設計と適正価格を追求。職人品質の家づくりと長期優良住宅基準の性能が特徴。" },

        // 自然素材・デザイン性
        { name: "高砂建設", tags: ["natural", "comfort", "family", "suburb", "cost_mid"], url: "https://www.takasago-kensetsu.co.jp/", description: "国産の西川材を使用した自然素材の家づくりが特徴。健康で快適な暮らしを提案します。" },
        { name: "ナイス株式会社", tags: ["natural", "cost_performance", "safety", "family", "cost_mid"], url: "https://www.nice.co.jp/house/", description: "国産材の活用にこだわり、ウッドデザイン賞も受賞。環境性能と快適性を追求します。" },
        { name: "住友不動産", tags: ["design", "modern", "luxury", "urban", "cost_high"], url: "https://www.j-urban.jp/", description: "ウッドパネル工法と2×4工法を融合。高級感あふれるマンションライクなデザインが人気。" },
        { name: "三菱地所ホーム", tags: ["design", "luxury", "comfort", "urban", "cost_premium", "modern", "two_family"], url: "https://www.mitsubishi-home.com/", description: "フルオーダーメイドの自由設計と、全館空調「エアロテック」による快適性が魅力です。" },
        { name: "スウェーデンハウス", tags: ["comfort", "natural", "design", "suburb", "cost_high", "family"], url: "https://www.swedenhouse.co.jp/", description: "北欧デザインと木製サッシ3層ガラス窓によるトップクラスの断熱・気密性能が特徴。" },

        // 3階建て・都市型住宅
        { name: "オープンハウス・アーキテクト", tags: ["urban", "cost_performance", "family", "cost_mid", "design", "modern"], url: "https://oha.openhouse-group.com/", description: "都心部の狭小地・変形地での建築に強み。コストを抑えながら理想の住まいを実現します。" },
        { name: "株式会社レスコハウス", tags: ["urban", "safety", "cost_mid", "modern", "three_story"], url: "https://www.rescohouse.co.jp/", description: "コンクリート住宅専門メーカー。災害に強く、3階建てや狭小地での建築を得意とします。" },
        { name: "アイダ設計", tags: ["cost_performance", "urban", "family", "cost_low", "modern"], url: "https://www.aidagroup.co.jp/", description: "低価格ながら自由設計に対応。コストを重視しつつ、こだわりも実現したい方におすすめ。" },
        
        // その他、特徴的な工務店・メーカー
        { name: "タマホーム", tags: ["cost_performance", "family", "cost_low", "suburb", "natural"], url: "https://www.tamahome.jp/", description: "「より良いものをより安く」をコンセプトに、良質かつ低価格な住宅を提供。豊富な商品ラインナップも魅力。" },
        { name: "一条工務店", tags: ["comfort", "safety", "family", "cost_high", "suburb"], url: "https://www.ichijo.co.jp/", description: "「家は、性能。」を掲げ、業界最高レベルの断熱性・気密性・耐震性を追求。" },
        { name: "ユニバーサルホーム", tags: ["comfort", "safety", "cost_mid", "family", "natural"], url: "https://www.universalhome.co.jp/", description: "地熱床システムとALC外壁材が標準仕様。災害に強く、一年中快適な室内環境を実現。" },
        { name: "ウィザースホーム", tags: ["design", "comfort", "cost_mid", "family", "suburb"], url: "https://with-e-home.com/", description: "外壁タイルと超・高断熱仕様で、美しさと性能が長持ちする住まいを提供します。" },
        { name: "ミサワホーム", tags: ["design", "safety", "comfort", "family", "cost_high"], url: "https://www.misawa.co.jp/", description: "「蔵のある家」で知られる収納力と、南極基地で培われた高い技術力が特徴です。" },
        { name: "桧家住宅", tags: ["comfort", "cost_performance", "family", "cost_mid", "modern"], url: "https://www.hinokiya.jp/", description: "全館空調『Z空調』を搭載した、経済的で快適な住まいを提案するメーカーです。" },
        { name: "アエラホーム", tags: ["comfort", "cost_mid", "family", "suburb"], url: "https://aerahome.com/", description: "アルミ箔で家を包む外張り断熱工法で、夏も冬も快適な室内環境を実現します。" },
        { name: "富士住建", tags: ["cost_performance", "family", "cost_mid", "suburb"], url: "https://www.fujijuken.co.jp/", description: "高品質な設備が標準仕様の「完全フル装備の家」。コストパフォーマンスに優れます。" },
        { name: "ヤマダホームズ", tags: ["cost_performance", "comfort", "family", "cost_mid"], url: "https://yamadahomes.jp/", description: "家電や家具、インテリアまでトータルで提案。スマートハウスにも強みを持ちます。" },
        { name: "クレバリーホーム", tags: ["design", "safety", "cost_mid", "family"], url: "https://www.cleverlyhome.com/", description: "外壁タイルが標準仕様で、メンテナンス性に優れた美しい住まいを提供します。" },
        { name: "木下工務店", tags: ["design", "urban", "luxury", "cost_high"], url: "https://www.kinoshita-koumuten.co.jp/", description: "完全自由設計で、施主のこだわりを形にする都心での実績豊富な工務店です。" },
        { name: "ポウハウス", tags: ["design", "natural", "cost_mid", "family"], url: "https://www.pohaus.jp/", description: "和の心をデザインに取り入れた、日本らしい感性を大切にする住まいづくりが特徴です。" },
        { name: "ダイワハウス", tags: ["design", "safety", "luxury", "suburb", "cost_high"], url: "https://www.daiwahouse.co.jp/jutaku/", description: "xevoΣ（ジーヴォシグマ）など、耐震性と大空間を両立する技術力が魅力。幅広い提案が可能です。" },
        { name: "トヨタウッドユーホーム", tags: ["natural", "safety", "cost_mid", "family"], url: "https://www.toyota-woodyou.co.jp/", description: "トヨタグループの技術を活かした木造住宅。安心と信頼の住まいを提供します。" }
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
                    // 基本スコア
                    let point = 1;
                    // 「最も重視するポイント」で回答されたタグはスコアを2倍にする
                    if (tag === userAnswers[1]) {
                        point = 2;
                    }
                    scores[maker.name] += point;
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
