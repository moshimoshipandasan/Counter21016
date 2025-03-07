document.addEventListener('DOMContentLoaded', () => {
    // 要素の取得
    const decimalValue = document.getElementById('decimal-value');
    const binaryGroupsContainer = document.getElementById('binary-groups');
    const hexDigitsContainer = document.getElementById('hex-digits');
    
    const incrementBtn = document.getElementById('increment');
    const decrementBtn = document.getElementById('decrement');
    const resetBtn = document.getElementById('reset');
    
    const autoCountCheckbox = document.getElementById('auto-count');
    const countSpeedSlider = document.getElementById('count-speed');
    const soundToggle = document.getElementById('sound-toggle');
    
    const countSound = document.getElementById('count-sound');
    const resetSound = document.getElementById('reset-sound');
    
    const showBinaryCalculationBtn = document.getElementById('show-binary-calculation');
    const showHexCalculationBtn = document.getElementById('show-hex-calculation');
    const calculationContent = document.getElementById('calculation-content');
    
    // 変数の初期化
    let count = 0;
    let autoCountInterval = null;
    
    // 表示を更新する関数
    function updateDisplays() {
        // 10進数表示の更新
        decimalValue.textContent = count;
        
        // 2進数と16進数の表示を更新
        const binaryStr = count.toString(2);
        const hexStr = count.toString(16).toUpperCase();
        
        // 2進法と16進法の関係を更新
        updateBinaryHexRelation(binaryStr, hexStr);
        
        // 10進数値のハイライトアニメーション
        addHighlightAnimation(decimalValue);
    }
    
    // 2進法と16進法の関係を視覚的に示す関数
    function updateBinaryHexRelation(binaryStr, hexStr) {
        // コンテナをクリア
        binaryGroupsContainer.innerHTML = '';
        hexDigitsContainer.innerHTML = '';
        
        // 2進数を4桁ごとにグループ化
        // 必要に応じて先頭に0を追加して4の倍数にする
        const paddedBinary = binaryStr.padStart(Math.ceil(binaryStr.length / 4) * 4, '0');
        
        // 各グループとそれに対応する16進数の桁を作成
        for (let i = 0; i < paddedBinary.length; i += 4) {
            const group = paddedBinary.substring(i, i + 4);
            const hexIndex = Math.floor(i / 4);
            const hexDigit = hexStr[hexIndex] || '0';
            
            // 2進法のグループを作成
            const binaryGroup = document.createElement('div');
            binaryGroup.className = 'binary-group';
            binaryGroup.textContent = group;
            binaryGroup.title = `この4桁の2進数は16進数の「${hexDigit}」に対応します`;
            
            // 16進法の桁を作成
            const hexDigitElement = document.createElement('div');
            hexDigitElement.className = 'hex-digit';
            hexDigitElement.textContent = hexDigit;
            hexDigitElement.title = `この16進数は2進数の「${group}」に対応します`;
            
            // 左から右へ追加（最上位桁から最下位桁へ）
            binaryGroupsContainer.appendChild(binaryGroup);
            hexDigitsContainer.appendChild(hexDigitElement);
        }
    }
    
    // ハイライトアニメーションを追加する関数
    function addHighlightAnimation(element) {
        element.classList.add('highlight');
        setTimeout(() => {
            element.classList.remove('highlight');
        }, 500);
    }
    
    // カウントアップ関数
    function increment() {
        count++;
        updateDisplays();
        updateRelationshipComment();
        playCountSound();
    }
    
    // カウントダウン関数
    function decrement() {
        if (count > 0) {
            count--;
            updateDisplays();
            updateRelationshipComment();
            playCountSound();
        }
    }
    
    // リセット関数
    function reset() {
        count = 0;
        updateDisplays();
        updateRelationshipComment();
        playResetSound();
    }
    
    // カウント音を再生する関数
    function playCountSound() {
        if (soundToggle.checked) {
            // 音を最初から再生するためにcurrentTimeをリセット
            countSound.currentTime = 0;
            countSound.play().catch(e => console.error('音声の再生に失敗しました:', e));
        }
    }
    
    // リセット音を再生する関数
    function playResetSound() {
        if (soundToggle.checked) {
            resetSound.currentTime = 0;
            resetSound.play().catch(e => console.error('音声の再生に失敗しました:', e));
        }
    }
    
    // 自動カウントの開始/停止を切り替える関数
    function toggleAutoCount() {
        if (autoCountCheckbox.checked) {
            startAutoCount();
        } else {
            stopAutoCount();
        }
    }
    
    // 自動カウントを開始する関数
    function startAutoCount() {
        if (autoCountInterval) {
            clearInterval(autoCountInterval);
        }
        
        // スライダーの値に基づいて速度を計算（値が大きいほど速い）
        const speed = 1000 / countSpeedSlider.value;
        
        autoCountInterval = setInterval(() => {
            increment();
        }, speed);
    }
    
    // 自動カウントを停止する関数
    function stopAutoCount() {
        if (autoCountInterval) {
            clearInterval(autoCountInterval);
            autoCountInterval = null;
        }
    }
    
    // 数値の関係を視覚的に示すためのコメント表示
    function updateRelationshipComment() {
        const commentElement = document.createElement('div');
        commentElement.className = 'relationship-comment';
        commentElement.textContent = `現在の値: ${count}(10進) = ${count.toString(2)}(2進) = ${count.toString(16).toUpperCase()}(16進)`;
        
        // 既存のコメントを削除
        const existingComment = document.querySelector('.relationship-comment');
        if (existingComment) {
            existingComment.remove();
        }
        
        // 新しいコメントを追加
        document.querySelector('.info-panel').appendChild(commentElement);
    }
    
    // イベントリスナーの設定
    incrementBtn.addEventListener('click', increment);
    decrementBtn.addEventListener('click', decrement);
    resetBtn.addEventListener('click', reset);
    
    autoCountCheckbox.addEventListener('change', toggleAutoCount);
    
    countSpeedSlider.addEventListener('input', () => {
        if (autoCountCheckbox.checked) {
            startAutoCount(); // 速度が変更されたら自動カウントを再開
        }
    });
    
    // 音声ファイルが読み込めない場合のフォールバック
    countSound.addEventListener('error', () => {
        console.warn('カウント音声ファイルの読み込みに失敗しました。代わりにビープ音を使用します。');
        // Web Audio APIを使用してビープ音を生成
        createBeepSound(countSound, 440, 0.1); // 440Hz、0.1秒のビープ音
    });
    
    resetSound.addEventListener('error', () => {
        console.warn('リセット音声ファイルの読み込みに失敗しました。代わりにビープ音を使用します。');
        createBeepSound(resetSound, 330, 0.2); // 330Hz、0.2秒のビープ音
    });
    
    // Web Audio APIを使用してビープ音を生成する関数
    function createBeepSound(audioElement, frequency, duration) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // 音声ファイルの代わりにビープ音を再生する関数を上書き
        audioElement.play = function() {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.value = frequency;
            oscillator.connect(gainNode);
            
            gainNode.connect(audioContext.destination);
            
            // フェードアウト効果
            gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);
            
            return Promise.resolve();
        };
    }
    
    // キーボードショートカットの設定
    document.addEventListener('keydown', (event) => {
        switch(event.key) {
            case 'ArrowUp':
                increment();
                break;
            case 'ArrowDown':
                decrement();
                break;
            case 'r':
            case 'R':
                reset();
                break;
            case ' ':
                autoCountCheckbox.checked = !autoCountCheckbox.checked;
                toggleAutoCount();
                break;
        }
    });
    
    // 10進数から2進数への変換過程を生成する関数
    function generateDecimalToBinaryCalculation(decimal) {
        if (decimal === 0) return "0 → 0";
        
        let result = "";
        let num = decimal;
        let steps = [];
        
        while (num > 0) {
            const remainder = num % 2;
            steps.push({ num, remainder });
            num = Math.floor(num / 2);
        }
        
        // 計算過程の表示形式を整える
        result += `10進数 ${decimal} を2進数に変換:\n\n`;
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const remainderText = step.remainder === 0 ? "... 0" : "... 1";
            result += `2 ) ${step.num.toString().padStart(2, ' ')} ${remainderText}\n`;
        }
        
        result += `     ${Math.floor(steps[steps.length - 1].num / 2)}\n\n`;
        
        // 2進数の結果（下から上へ読む）
        const binaryDigits = steps.map(step => step.remainder).reverse();
        result += `結果: ${binaryDigits.join('')} (2進数)`;
        
        return result;
    }
    
    // 10進数から16進数への変換過程を生成する関数
    function generateDecimalToHexCalculation(decimal) {
        if (decimal === 0) return "0 → 0";
        
        let result = "";
        let num = decimal;
        let steps = [];
        
        while (num > 0) {
            const remainder = num % 16;
            // 10以上の余りをA-Fに変換
            const hexRemainder = remainder < 10 ? remainder.toString() : 
                                String.fromCharCode('A'.charCodeAt(0) + remainder - 10);
            steps.push({ num, remainder, hexRemainder });
            num = Math.floor(num / 16);
        }
        
        // 計算過程の表示形式を整える
        result += `10進数 ${decimal} を16進数に変換:\n\n`;
        
        for (let i = 0; i < steps.length; i++) {
            const step = steps[i];
            const remainderText = `... ${step.hexRemainder}`;
            result += `16 ) ${step.num.toString().padStart(6, ' ')} ${remainderText}\n`;
        }
        
        result += `     ${Math.floor(steps[steps.length - 1].num / 16)}\n\n`;
        
        // 16進数の結果（下から上へ読む）
        const hexDigits = steps.map(step => step.hexRemainder).reverse();
        result += `結果: ${hexDigits.join('')} (16進数)`;
        
        return result;
    }
    
    // 計算過程を表示するボタンのイベントリスナー
    showBinaryCalculationBtn.addEventListener('click', () => {
        const calculation = generateDecimalToBinaryCalculation(count);
        document.querySelector('#calculation-panel h3').textContent = '10進法から2進法への変換過程';
        calculationContent.textContent = calculation;
    });
    
    showHexCalculationBtn.addEventListener('click', () => {
        const calculation = generateDecimalToHexCalculation(count);
        document.querySelector('#calculation-panel h3').textContent = '10進法から16進法への変換過程';
        calculationContent.textContent = calculation;
    });
    
    // 初期表示の更新
    updateDisplays();
    
    // 初期コメントの表示
    updateRelationshipComment();
    
    // QRコードモーダル機能
    const qrCodeImg = document.getElementById('qr-code-img');
    const qrModal = document.getElementById('qr-modal');
    const closeBtn = document.querySelector('.close');
    
    // QRコードをクリックしたときにモーダルを表示
    qrCodeImg.addEventListener('click', () => {
        qrModal.style.display = 'block';
    });
    
    // 閉じるボタンをクリックしたときにモーダルを閉じる
    closeBtn.addEventListener('click', () => {
        qrModal.style.display = 'none';
    });
    
    // モーダルの外側をクリックしたときにモーダルを閉じる
    window.addEventListener('click', (event) => {
        if (event.target === qrModal) {
            qrModal.style.display = 'none';
        }
    });
});
