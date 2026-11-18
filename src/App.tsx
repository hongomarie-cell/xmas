import { useState, useEffect } from 'react';
import './App.css';

interface FortuneItem {
  level: string;
  color: string;
  message: string;
}

interface SweetItem {
  name: string;
  emoji: string;
}

const FORTUNES: FortuneItem[] = [
  { level: '大吉', color: '#d32f2f', message: 'サンタさんも驚く最高のハッピーデー！願い事が叶う予感✨' },
  { level: '中吉', color: '#e65100', message: 'ワクワクする素敵な出来事が舞い込みそう！笑顔で過ごそう🎄' },
  { level: '小吉', color: '#2e7d32', message: 'ほっこり温かい幸せが見つかる日。周りの人に優しくすると吉🎁' },
  { level: '吉', color: '#1565c0', message: 'いつもの日常に小さなラッキーが隠れています。おやつタイムを大切に☕' },
  { level: '末吉', color: '#6a1b9a', message: '焦らずゆっくり進もう！温かい飲み物でリラックスすると運気アップ🔔' },
];

const SWEETS: SweetItem[] = [
  { name: 'チョコレート', emoji: '🍫' },
  { name: 'プレッツェル', emoji: '🥨' },
  { name: 'クッキー', emoji: '🍪' },
  { name: 'キャンディ', emoji: '🍬' },
  { name: 'ドーナツ', emoji: '🍩' },
  { name: 'アイス', emoji: '🍨' },
  { name: 'プリン', emoji: '🍮' },
];

export default function App() {
  const [daysUntilXmas, setDaysUntilXmas] = useState<number>(0);
  const [isChristmasDay, setIsChristmasDay] = useState<boolean>(false);
  const [testChristmasMode, setTestChristmasMode] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [currentFortune, setCurrentFortune] = useState<FortuneItem>(FORTUNES[0]);
  const [currentSweet, setCurrentSweet] = useState<SweetItem>(SWEETS[0]);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();

      if (month === 12 && date === 25) {
        setIsChristmasDay(true);
        setDaysUntilXmas(0);
        return;
      }

      setIsChristmasDay(false);
      let targetYear = currentYear;
      if (month === 12 && date > 25) {
        targetYear = currentYear + 1;
      }

      const todayMidnight = new Date(currentYear, now.getMonth(), date);
      const xmasMidnight = new Date(targetYear, 11, 25);
      const diffTime = xmasMidnight.getTime() - todayMidnight.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysUntilXmas(diffDays);
    };

    calculateCountdown();
  }, []);

  const activeChristmas = isChristmasDay || testChristmasMode;

  const handleDraw = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    setHasDrawn(true);

    let count = 0;
    const maxTicks = 15;
    const interval = setInterval(() => {
      const randFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
      const randSweet = SWEETS[Math.floor(Math.random() * SWEETS.length)];
      setCurrentFortune(randFortune);
      setCurrentSweet(randSweet);
      count++;

      if (count >= maxTicks) {
        clearInterval(interval);
        if (activeChristmas) {
          setCurrentFortune({
            level: '大吉',
            color: '#d32f2f',
            message: 'メリークリスマス！最高に素敵な聖夜になりますように🎅✨',
          });
          setCurrentSweet({
            name: 'ケーキ',
            emoji: '🎂',
          });
        } else {
          const finalFortune = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
          const finalSweet = SWEETS[Math.floor(Math.random() * SWEETS.length)];
          setCurrentFortune(finalFortune);
          setCurrentSweet(finalSweet);
        }
        setIsSpinning(false);
      }
    }, 70);
  };

  const toggleTestChristmas = () => {
    const nextMode = !testChristmasMode;
    setTestChristmasMode(nextMode);
    if (nextMode && hasDrawn) {
      setCurrentFortune({
        level: '大吉',
        color: '#d32f2f',
        message: 'メリークリスマス！最高に素敵な聖夜になりますように🎅✨',
      });
      setCurrentSweet({
        name: 'ケーキ',
        emoji: '🎂',
      });
    }
  };

  return (
    <div className="gingham-bg">
      <div className="card-wrapper">
        <div className="advent-card">
          <div className="badge-header">🎄 ADVENT OMIKUJI 🎄</div>

          <div className="countdown-box">
            {activeChristmas ? (
              <h1 className="merry-xmas-title">🎅 メリークリスマス！ 🎄</h1>
            ) : (
              <p className="countdown-text">
                クリスマスまであと <span className="countdown-days">{daysUntilXmas}</span> 日！
              </p>
            )}
          </div>

          <div className="result-window">
            {!hasDrawn ? (
              <div className="initial-door">
                <div className="gift-icon">🎁</div>
                <p className="door-main-text">小窓を開けて今日の運試し！</p>
                <p className="door-sub-text">運勢とラッキースイーツが飛び出すよ✨</p>
              </div>
            ) : (
              <div className={`result-content ${isSpinning ? 'spinning' : 'pop-in'}`}>
                <div className="fortune-section">
                  <span className="section-label">今日の運勢</span>
                  <div
                    className="fortune-level"
                    style={{ color: currentFortune.color }}
                  >
                    {currentFortune.level}
                  </div>
                  {!isSpinning && (
                    <p className="fortune-message">{currentFortune.message}</p>
                  )}
                </div>

                <div className="divider" />

                <div className="sweet-section">
                  <span className="section-label">ラッキーお菓子</span>
                  <div className="sweet-emoji">{currentSweet.emoji}</div>
                  <div className="sweet-name">{currentSweet.name}</div>
                </div>
              </div>
            )}
          </div>

          <button
            className="draw-button"
            onClick={handleDraw}
            disabled={isSpinning}
          >
            {isSpinning
              ? 'ルーレット回転中...🎲'
              : hasDrawn
              ? 'もう一回扉を開ける！🎁'
              : '🚪 扉を開けて運勢を占う！'}
          </button>
        </div>

        {/* カード枠線のすぐ下・中央に配置した設定エリア */}
        <div className="bottom-config-area">
          <button
            className="gear-btn-center"
            onClick={() => setShowConfig(!showConfig)}
            title="設定"
          >
            ⚙️
          </button>

          {showConfig && (
            <div className="test-mode-area pop-in">
              <button className="test-toggle-btn" onClick={toggleTestChristmas}>
                {testChristmasMode
                  ? '🔄 通常の日付表示に戻す'
                  : '🎂 クリスマス当日(12/25)の表示をテストする'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}