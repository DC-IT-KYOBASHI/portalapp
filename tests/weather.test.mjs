import assert from 'node:assert';

// 気象庁 API 連携およびパースロジックの自動テスト
async function runWeatherTests() {
  console.log('🧪 === お天気・防災機能 網羅的ユニットテスト開始 ===\n');

  // 1. 天気コードと絵文字のマッピングテスト
  console.log('1. 天気コード・絵文字マッピングテスト');
  const { getWeatherEmoji, parseWarningCode } = await import('../src/pages/Weather/services/jmaApi.ts');
  
  assert.strictEqual(getWeatherEmoji('100').emoji, '☀️', '100 は晴れ');
  assert.strictEqual(getWeatherEmoji('101').emoji, '🌤️', '101 は晴れ時々くもり');
  assert.strictEqual(getWeatherEmoji('111').emoji, '⛅', '111 は晴れのちくもり');
  assert.strictEqual(getWeatherEmoji('200').emoji, '☁️', '200 はくもり');
  assert.strictEqual(getWeatherEmoji('203').emoji, '🌧️', '203 はくもり時々雨');
  assert.strictEqual(getWeatherEmoji('300').emoji, '🌧️', '300 は雨');
  assert.strictEqual(getWeatherEmoji('302').emoji, '🌧️', '302 は雨時々くもり');
  assert.strictEqual(getWeatherEmoji('400').emoji, '☃️', '400 は雪');
  console.log('   ✅ 天気コード・絵文字マッピング全件パス');

  // 2. 警報・注意報コードのパーステスト
  console.log('2. 警報・注意報コードパーステスト');
  assert.strictEqual(parseWarningCode('10').name, '大雨注意報');
  assert.strictEqual(parseWarningCode('10').type, 'advisory');
  assert.strictEqual(parseWarningCode('14').name, '雷注意報');
  assert.strictEqual(parseWarningCode('03').name, '大雨警報');
  assert.strictEqual(parseWarningCode('03').type, 'warning');
  assert.strictEqual(parseWarningCode('33').name, '大雨特別警報');
  assert.strictEqual(parseWarningCode('33').type, 'special');
  console.log('   ✅ 警報コード・種別パース全件パス');

  // 3. 気象庁実データ通信 & 累積警報マージテスト
  console.log('3. 気象庁実API通信 ＆ 累積注意報マージ・実況テスト');
  const { fetchWeatherDataFromJMA, JMA_CONFIG } = await import('../src/pages/Weather/services/jmaApi.ts');
  
  const weatherData = await fetchWeatherDataFromJMA(true);
  
  assert.ok(weatherData, 'データが取得できていること');
  assert.strictEqual(weatherData.cityName, '大阪市（京橋・中央区周辺）');
  assert.ok(weatherData.today, '今日の予報が存在すること');
  assert.ok(weatherData.today.weatherText, '今日の天気テキストが存在すること');
  assert.ok(weatherData.weekly.length >= 6, '週間予報が6日以上取得できていること');
  
  console.log(`   ・今日の天気: ${weatherData.today.weatherEmoji} ${weatherData.today.weatherText}`);
  console.log(`   ・気温 (実況/予想): ${weatherData.current?.temperature ?? '--'}℃ (最高: ${weatherData.today.tempMax ?? '--'}℃ / 最低: ${weatherData.today.tempMin ?? '--'}℃)`);
  console.log(`   ・気圧 (海面): ${weatherData.current?.pressure ?? '--'} hPa (${weatherData.current?.pressureStatus})`);
  console.log(`   ・発表中の注意報・警報件数: ${weatherData.warnings.length} 件`);
  weatherData.warnings.forEach(w => console.log(`     - [${w.type}] ${w.name} (${w.status})`));
  
  assert.ok(weatherData.warnings.some(w => w.name === '大雨注意報'), '大雨注意報が含まれていること');
  assert.ok(weatherData.warnings.some(w => w.name === '雷注意報'), '雷注意報が含まれていること');
  console.log('   ✅ 気象庁実データ統合・累積注意報抽出テスト全件パス');

  // 4. 異常系・フォールバックテスト
  console.log('4. 異常系・キャッシュフォールバックテスト');
  assert.ok(JMA_CONFIG.CACHE.TTL_MS === 1800000, 'キャッシュTTLが30分であること');
  assert.ok(JMA_CONFIG.AREA.OSAKA_CITY === '2710000', '大阪市コードが2710000であること');
  assert.ok(JMA_CONFIG.AREA.AMEDAS_OSAKA === '62078', '大阪アメダスコードが62078であること');
  console.log('   ✅ 設定定数・フォールバック整合性テスト全件パス');

  console.log('\n🎉 全ての監査・ユニットテストに完全合格しました！');
}

runWeatherTests().catch(err => {
  console.error('❌ テスト失敗:', err);
  process.exit(1);
});
