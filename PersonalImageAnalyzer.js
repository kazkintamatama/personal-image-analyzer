import React, { useState } from 'react';

const PersonalImageAnalyzer = () => {
  // 状態管理
  const [photoUploaded, setPhotoUploaded] = useState(false);
  const [height, setHeight] = useState(160);
  const [gender, setGender] = useState('female');
  const [shoulderWidth, setShoulderWidth] = useState('normal');
  const [imageScale, setImageScale] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // イメージスケールのデータ
  const imageScaleCategories = {
    'WARM_SOFT': {
      keywords: ['プリティー', '可愛い', '甘い', 'キュートな', 'ロマンチック', 'メルヘンな'],
      description: '優しく温かみのある印象で、親しみやすく柔らかな雰囲気を持ちます。',
      fashion: '丸みのあるシルエット、パステルカラー、ふんわりとした素材が似合います。'
    },
    'WARM_HARD': {
      keywords: ['アクティブ', 'ゴージャス', 'セクシー', 'ダイナミック'],
      description: '力強く情熱的な印象で、積極的でエネルギッシュな雰囲気を持ちます。',
      fashion: '鮮やかな暖色系や大胆なデザイン、立体的なシルエットが似合います。'
    },
    'COOL_SOFT': {
      keywords: ['クリア', 'さっぱりした', '清々しい', 'シンプルな', 'カジュアル'],
      description: '清潔感があり爽やかな印象で、洗練された柔らかな雰囲気を持ちます。',
      fashion: '淡い寒色系や白、シンプルで軽やかなデザインが似合います。'
    },
    'COOL_HARD': {
      keywords: ['クールカジュアル', '洗練された', 'シャープな', 'モダンな', '知的な'],
      description: '知的でクールな印象で、洗練された都会的な雰囲気を持ちます。',
      fashion: '鮮明なコントラスト、モノトーン、直線的なラインが似合います。'
    }
  };
  
  // 身体特性による分析ロジック
  const analyzeBodyType = () => {
    // 初期値
    let warmCoolPoints = 0;
    let softHardPoints = 0;
    
    // 身長による WARM-COOL 評価
    if (gender === 'male') {
      // 男性の身長評価
      if (height < 160) warmCoolPoints -= 3;
      else if (height < 165) warmCoolPoints -= 2;
      else if (height < 170) warmCoolPoints -= 1;
      else if (height < 175) warmCoolPoints += 0;
      else if (height < 180) warmCoolPoints += 1;
      else if (height < 185) warmCoolPoints += 2;
      else warmCoolPoints += 3;
    } else {
      // 女性の身長評価
      if (height < 150) warmCoolPoints -= 3;
      else if (height < 155) warmCoolPoints -= 2;
      else if (height < 158) warmCoolPoints -= 1;
      else if (height < 163) warmCoolPoints += 0;
      else if (height < 168) warmCoolPoints += 1;
      else if (height < 173) warmCoolPoints += 2;
      else warmCoolPoints += 3;
    }
    
    // 肩幅による SOFT-HARD 評価
    if (shoulderWidth === 'narrow') {
      softHardPoints += 1; // 狭い = SOFT寄り
    } else if (shoulderWidth === 'wide') {
      softHardPoints -= 1; // 広い = HARD寄り
    }
    
    // ポイントから座標値への変換 (-1〜1の範囲)
    const warmCoolValue = Math.max(-1, Math.min(1, warmCoolPoints / 3));
    const softHardValue = Math.max(-1, Math.min(1, softHardPoints));
    
    // カテゴリー判定
    let category;
    if (warmCoolValue < 0) {
      category = softHardValue > 0 ? 'WARM_SOFT' : 'WARM_HARD';
    } else {
      category = softHardValue > 0 ? 'COOL_SOFT' : 'COOL_HARD';
    }
    
    return {
      coordinates: { x: warmCoolValue, y: softHardValue },
      category: category,
      categoryInfo: imageScaleCategories[category],
      warmCoolPoints,
      softHardPoints
    };
  };
  
  // 写真アップロード処理
  const handlePhotoUpload = (e) => {
    // 実際のアプリケーションでは画像処理ロジックが入ります
    setPhotoUploaded(true);
  };
  
  // 分析実行
  const runAnalysis = () => {
    const result = analyzeBodyType();
    setImageScale(result);
    setAnalysisResult(result);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="w-full mb-6">
        <h2 className="text-xl font-bold text-center">パーソナルイメージスケール分析</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">1. 写真をアップロード</h3>
          <div className="flex items-center justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
            {!photoUploaded ? (
              <div className="text-center">
                <p className="text-sm text-gray-500">クリックして写真をアップロード</p>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handlePhotoUpload}
                />
              </div>
            ) : (
              <div className="text-center text-green-600">
                <p>写真アップロード完了</p>
              </div>
            )}
          </div>
        </div>
          
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">2. 身体情報を入力</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">性別</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="mr-2"
                  />
                  女性
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="mr-2"
                  />
                  男性
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">身長 (cm)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                min="140"
                max="200"
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">肩幅の印象</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shoulderWidth"
                    value="narrow"
                    checked={shoulderWidth === 'narrow'}
                    onChange={() => setShoulderWidth('narrow')}
                    className="mr-2"
                  />
                  狭い
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shoulderWidth"
                    value="normal"
                    checked={shoulderWidth === 'normal'}
                    onChange={() => setShoulderWidth('normal')}
                    className="mr-2"
                  />
                  普通
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="shoulderWidth"
                    value="wide"
                    checked={shoulderWidth === 'wide'}
                    onChange={() => setShoulderWidth('wide')}
                    className="mr-2"
                  />
                  広い
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">※普段周りから言われる印象や自己認識に基づいて選択してください</p>
            </div>
          </div>
        </div>
          
        <button
          onClick={runAnalysis}
          disabled={!photoUploaded}
          className="w-full p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          分析を実行
        </button>
      </div>
      
      {analysisResult && (
        <div className="w-full">
          <h3 className="text-xl font-bold text-center">分析結果</h3>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">イメージスケール位置</h3>
            <div className="relative w-full h-64 border rounded-lg p-2 mb-4">
              {/* イメージスケールの背景 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-10">
                <div className="w-full h-px bg-black"></div>
                <div className="h-full w-px bg-black"></div>
              </div>
              
              {/* 軸ラベル */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-sm">SOFT</div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-sm">HARD</div>
              <div className="absolute left-1 top-1/2 transform -translate-y-1/2 text-sm">WARM</div>
              <div className="absolute right-1 top-1/2 transform -translate-y-1/2 text-sm">COOL</div>
              
              {/* ユーザーの位置 */}
              <div 
                className="absolute w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(imageScale.coordinates.x + 1) * 50}%`,
                  top: `${(1 - imageScale.coordinates.y) * 50}%`
                }}
              ></div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">あなたの印象タイプ: {analysisResult.category.replace('_', '-')}</h3>
            <p className="mb-2">{analysisResult.categoryInfo.description}</p>
            <div className="bg-gray-100 p-3 rounded mb-3">
              <p className="font-medium mb-1">スコア詳細:</p>
              <p>WARM-COOL: {analysisResult.warmCoolPoints > 0 ? `COOL +${analysisResult.warmCoolPoints}` : `WARM ${analysisResult.warmCoolPoints}`}</p>
              <p>SOFT-HARD: {analysisResult.softHardPoints > 0 ? `SOFT +${analysisResult.softHardPoints}` : `HARD ${analysisResult.softHardPoints}`}</p>
            </div>
            <p className="mb-2">
              <span className="font-medium">キーワード: </span>
              {analysisResult.categoryInfo.keywords.join('、')}
            </p>
            <p>
              <span className="font-medium">おすすめファッション: </span>
              {analysisResult.categoryInfo.fashion}
            </p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">距離別印象分析</h3>
            <div className="space-y-2">
              <p>
                <span className="font-medium">遠距離印象 (10m以上): </span>
                シルエットが主体となり、{analysisResult.category.includes('WARM') ? '温かみのある' : 'クールな'}印象を与えます。
              </p>
              <p>
                <span className="font-m
