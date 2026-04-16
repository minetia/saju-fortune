// ============================================================
// Divination Functions (I Ching, Tarot, Dream, Zodiac)
// ============================================================
import { JIJI, SIPSUNG_NAMES, SHIP2_TABLE } from '../data/pillarData.js';
import { HEXAGRAM_DATA } from '../data/hexagramData.js';
import { TAROT_CARDS } from '../data/tarotData.js';
import { DREAM_DB } from '../data/dreamData.js';
import { getSipsung } from './calculator.js';

// ============================================================
// 주역점(周易占) - 64괘 점치기
// ============================================================
export function castIching(question) {
  // 6효 생성 (동전 점 방식)
  const lines = [];
  for (let i = 0; i < 6; i++) {
    const val = Math.floor(Math.random() * 4) + 6; // 6,7,8,9
    lines.push(val);
  }

  // 하괘(하위 3효) + 상괘(상위 3효)로 괘 결정
  const lower = lines.slice(0, 3).map(l => l % 2); // 0=음, 1=양
  const upper = lines.slice(3, 6).map(l => l % 2);

  const trigramIdx = (upper[2]*4 + upper[1]*2 + upper[0]) * 8 + (lower[2]*4 + lower[1]*2 + lower[0]);
  const hexIdx = trigramIdx % 64;
  const hexagram = HEXAGRAM_DATA[hexIdx];

  // 변효 (6 또는 9인 효)
  const changingLines = lines.map((l, i) => (l === 6 || l === 9) ? i : -1).filter(i => i >= 0);

  return {
    hexagram,
    lines,
    changingLines,
    question: question || '',
    lineSymbols: lines.map(l => l % 2 === 1 ? '⚊' : '⚋'),
    timestamp: new Date().toLocaleString('ko-KR')
  };
}

// ============================================================
// 원카드 타로
// ============================================================
export function drawTarotCard() {
  const card = TAROT_CARDS[Math.floor(Math.random() * TAROT_CARDS.length)];
  const isReversed = Math.random() < 0.3; // 30% 확률로 역방향
  return { ...card, isReversed, timestamp: new Date().toLocaleString('ko-KR') };
}

// ============================================================
// 꿈해몽
// ============================================================
export function interpretDream(keyword) {
  if (!keyword) return null;
  const key = keyword.trim();

  // 정확한 매칭
  if (DREAM_DB[key]) {
    return { keyword: key, ...DREAM_DB[key], matched: true };
  }

  // 부분 매칭
  const partial = Object.entries(DREAM_DB).find(([k]) => key.includes(k) || k.includes(key));
  if (partial) {
    return { keyword: partial[0], ...partial[1], matched: true, originalKeyword: key };
  }

  // 매칭 안 됨 - 일반적 해석
  const randomNums = Array.from({length:4}, () => Math.floor(Math.random()*45)+1);
  return {
    keyword: key, matched: false,
    meaning: `"${key}"에 대한 구체적인 해몽 데이터가 없지만, 꿈은 무의식의 메시지입니다. 이 꿈이 반복된다면 현재 마음 상태를 돌아보세요.`,
    luck: '보통', numbers: randomNums, category: '기타'
  };
}

// ============================================================
// 띠별 운세 (12간지)
// ============================================================
export function getZodiacFortune(year) {
  const currentYear = new Date().getFullYear();
  const cyStem = ((currentYear - 4) % 10 + 10) % 10;
  const cyBranch = ((currentYear - 4) % 12 + 12) % 12;

  const fortunes = [];
  for (let i = 0; i < 12; i++) {
    const sipsung = getSipsung(i * 2 % 10, cyStem);
    const ship2 = SHIP2_TABLE[i % 10][cyBranch];

    let score = {0:65,1:50,2:80,3:60,4:75,5:80,6:45,7:78,8:62,9:82}[sipsung] || 60;
    score += {0:10,1:0,2:8,3:12,4:15,5:-2,6:-5,7:-8,8:-3,9:-10,10:3,11:5}[ship2] || 0;
    score = Math.max(35, Math.min(95, score));

    const ZODIAC_FORTUNE_TEXT = [
      {money:'저축에 유리한 해', love:'새로운 인연 기대', career:'안정적 발전', health:'수면 관리 필요'},
      {money:'부동산 관련 운 상승', love:'신뢰가 깊어짐', career:'꾸준한 성장', health:'소화기 주의'},
      {money:'투자 기회 포착', love:'열정적 만남', career:'승진 기회', health:'간 건강 주의'},
      {money:'부수입 기대', love:'로맨틱한 시기', career:'창의적 성과', health:'알레르기 주의'},
      {money:'큰 재물 운', love:'운명적 만남', career:'리더십 발휘', health:'근골격 주의'},
      {money:'지혜로운 투자', love:'지적 교류', career:'전문성 인정', health:'피부 관리'},
      {money:'활동적 수입', love:'활발한 사교', career:'이직/변화 기회', health:'심장 주의'},
      {money:'안정적 수입', love:'가정적 행복', career:'협업이 열쇠', health:'위장 관리'},
      {money:'사업 확장 유리', love:'매력 발산', career:'네트워킹 중요', health:'호흡기 주의'},
      {money:'기술로 수입', love:'세련된 만남', career:'디테일이 성공', health:'폐 건강 주의'},
      {money:'충성에 보상', love:'의리 있는 관계', career:'안정 속 발전', health:'관절 주의'},
      {money:'예상외 횡재', love:'깊은 인연', career:'새로운 시작', health:'비뇨기 주의'}
    ];

    fortunes.push({
      branch: i,
      animal: JIJI[i].animal,
      hanja: JIJI[i].hanja,
      score,
      ...ZODIAC_FORTUNE_TEXT[i],
      sipsung,
      keyword: SIPSUNG_NAMES[sipsung]
    });
  }
  return { year: currentYear, stem: cyStem, branch: cyBranch, fortunes };
}
