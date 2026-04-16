// ============================================================
// Fortune Calculation Functions
// ============================================================
import { CHEONGAN, JIJI, JIJANGGAN, SIPSUNG_NAMES, SHIP2_NAMES, SHIP2_TABLE } from '../data/pillarData.js';
import { YUKHAP } from '../data/relationsData.js';
import { TOJEONG_TEXTS } from '../data/fortuneData.js';
import { getSipsung, getDayPillar, getMonthPillar } from './calculator.js';

// ============================================================
// 오늘의 운세 계산
// ============================================================
export function getTodayFortune(dayStem) {
  const today = new Date();
  const todayPillar = getDayPillar(today.getFullYear(), today.getMonth()+1, today.getDate());
  const todaySipsung = getSipsung(dayStem, todayPillar.stem);
  const todayShip2 = SHIP2_TABLE[dayStem][todayPillar.branch];

  // 점수 계산
  let score = 60;
  const sipsungScores = { 0:70, 1:55, 2:85, 3:65, 4:75, 5:80, 6:50, 7:78, 8:68, 9:82 };
  score = sipsungScores[todaySipsung] || 60;
  const ship2Bonus = { 0:10, 1:0, 2:8, 3:12, 4:15, 5:-2, 6:-5, 7:-8, 8:-3, 9:-10, 10:3, 11:5 };
  score += (ship2Bonus[todayShip2] || 0);
  score = Math.max(30, Math.min(98, score));

  // 행운 색상
  const dayElement = CHEONGAN[dayStem].element;
  const luckyColors = { '목': '초록색, 연두색', '화': '빨간색, 보라색', '토': '노란색, 갈색', '금': '흰색, 은색', '수': '검정색, 파란색' };
  const luckyDir = { '목': '동쪽', '화': '남쪽', '토': '중앙', '금': '서쪽', '수': '북쪽' };
  const luckyNum = { '목': '3, 8', '화': '2, 7', '토': '5, 10', '금': '4, 9', '수': '1, 6' };

  const SAENG = { '목':'화', '화':'토', '토':'금', '금':'수', '수':'목' };
  const yongEl = SAENG[dayElement];

  return {
    todayStem: todayPillar.stem,
    todayBranch: todayPillar.branch,
    sipsung: todaySipsung,
    ship2: todayShip2,
    score,
    luckyColor: luckyColors[yongEl] || '노란색',
    luckyDirection: luckyDir[yongEl] || '중앙',
    luckyNumber: luckyNum[yongEl] || '5, 10',
    todayDesc: generateTodayDesc(todaySipsung, todayShip2, score)
  };
}

export function generateTodayDesc(sipsung, ship2, score) {
  const good = [];
  const caution = [];

  if (sipsung === 2 || sipsung === 5 || sipsung === 9) {
    good.push('전반적으로 순탄한 흐름입니다.');
  }
  if (sipsung === 2) good.push('먹을 복이 있는 날, 맛있는 식사를 즐기세요.');
  if (sipsung === 5) good.push('재물 운이 좋은 날입니다. 계획적인 소비가 길합니다.');
  if (sipsung === 9) good.push('학업이나 자격 관련 일이 잘 풀리는 날입니다.');
  if (sipsung === 7) good.push('사회적 인정을 받기 좋은 날입니다.');
  if (sipsung === 4) good.push('사업이나 투자에 좋은 기회가 있을 수 있습니다.');
  if (sipsung === 0) good.push('동료나 친구와의 협력이 도움이 됩니다.');

  if (sipsung === 1) caution.push('경쟁이나 경합 상황에서 신중하세요.');
  if (sipsung === 3) caution.push('말실수에 주의하고 감정적 표현을 자제하세요.');
  if (sipsung === 6) caution.push('윗사람과의 관계에서 갈등이 있을 수 있습니다.');
  if (sipsung === 8) caution.push('과도한 생각보다 행동이 필요한 날입니다.');

  if (ship2 === 4) good.push('에너지가 정점에 달하는 날, 중요한 일을 추진하세요.');
  if (ship2 === 0) good.push('새로운 시작에 좋은 날입니다.');
  if (ship2 === 3) good.push('실력이 인정받는 날입니다.');
  if (ship2 === 7 || ship2 === 9) caution.push('무리한 계획보다는 정리와 마무리에 집중하세요.');

  if (good.length === 0) good.push('평범하지만 안정적인 하루가 될 것입니다.');
  if (caution.length === 0) caution.push('특별한 주의사항은 없습니다. 평소대로 행동하세요.');

  return { good, caution };
}

// ============================================================
// 오늘의 일진 계산
// ============================================================
export function getTodayIljin() {
  const today = new Date();
  const dp = getDayPillar(today.getFullYear(), today.getMonth()+1, today.getDate());
  return dp;
}

// ============================================================
// 월운 계산
// ============================================================
export function getMonthlyFortune(dayStem, year) {
  const months = [];
  for (let m = 1; m <= 12; m++) {
    const mp = getMonthPillar(year, m, 15);
    const sipsung = getSipsung(dayStem, mp.stem);
    const ship2 = SHIP2_TABLE[dayStem][mp.branch];

    let score = 60;
    const ss = { 0:65, 1:50, 2:80, 3:60, 4:72, 5:78, 6:45, 7:75, 8:62, 9:82 };
    score = ss[sipsung] || 60;
    const s2 = { 0:8, 1:0, 2:6, 3:10, 4:12, 5:-3, 6:-5, 7:-8, 8:-2, 9:-10, 10:2, 11:4 };
    score += (s2[ship2] || 0);
    score = Math.max(30, Math.min(95, score));

    months.push({
      month: m,
      stem: mp.stem,
      branch: mp.branch,
      sipsung,
      ship2,
      score
    });
  }
  return months;
}

// ============================================================
// 토정비결
// ============================================================
export function getTojeongBigyeol(yearStem, yearBranch, monthStem, monthBranch, dayStem, dayBranch) {
  const sangGwae = (yearStem + yearBranch) % 8;
  const jungGwae = (monthStem + monthBranch) % 8;
  const haGwae = (dayStem + dayBranch) % 8;
  const totalGwae = (sangGwae * 64 + jungGwae * 8 + haGwae) % TOJEONG_TEXTS.length;

  const monthlyTexts = [];
  for (let m = 1; m <= 12; m++) {
    const idx = (totalGwae + m * 3 + dayStem) % TOJEONG_TEXTS.length;
    monthlyTexts.push({ month: m, text: TOJEONG_TEXTS[idx] });
  }

  return {
    sangGwae, jungGwae, haGwae,
    mainText: TOJEONG_TEXTS[totalGwae],
    monthlyTexts
  };
}

// ============================================================
// 년운 상세 분석
// ============================================================
export function getDetailedYearlyFortune(dayStem, pillars, year) {
  const yStem = ((year - 4) % 10 + 10) % 10;
  const yBranch = ((year - 4) % 12 + 12) % 12;
  const sipsung = getSipsung(dayStem, yStem);
  const ship2 = SHIP2_TABLE[dayStem][yBranch];
  const dayElement = CHEONGAN[dayStem].element;

  let chunganRel = '';
  const CHUNGAN_HAP_MAP = [[0,5],[1,6],[2,7],[3,8],[4,9]];
  CHUNGAN_HAP_MAP.forEach(([a,b]) => {
    if ((dayStem===a && yStem===b)||(dayStem===b && yStem===a)) chunganRel = '천간합';
  });
  const CHUNGAN_CHUNG_MAP = [[0,6],[1,7],[2,8],[3,9]];
  CHUNGAN_CHUNG_MAP.forEach(([a,b]) => {
    if ((dayStem===a && yStem===b)||(dayStem===b && yStem===a)) chunganRel = '천간충';
  });

  const dayBranch = pillars[2].branch;
  let jijiRel = '';
  if (Math.abs(dayBranch - yBranch) === 6 || (dayBranch + yBranch) === 6 || (dayBranch + yBranch) === 18) {
    if ([0,6].some(v => (dayBranch===v&&yBranch===12-v)||(dayBranch===12-v&&yBranch===v)) ||
        Math.abs(dayBranch - yBranch) === 6) jijiRel = '지지충';
  }
  const YUKHAP_CHECK = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
  YUKHAP_CHECK.forEach(([a,b]) => {
    if ((dayBranch===a && yBranch===b)||(dayBranch===b && yBranch===a)) jijiRel = '지지합';
  });

  const baseScore = {0:65,1:50,2:80,3:60,4:75,5:80,6:45,7:78,8:62,9:82}[sipsung] || 60;
  const ship2B = {0:10,1:0,2:8,3:12,4:15,5:-2,6:-5,7:-8,8:-3,9:-10,10:3,11:5}[ship2] || 0;

  let moneyScore = 55;
  if (sipsung===4||sipsung===5) moneyScore = 82 + ship2B;
  else if (sipsung===2) moneyScore = 72 + ship2B;
  else if (sipsung===6||sipsung===1) moneyScore = 42 + ship2B;
  else moneyScore = 60 + ship2B;
  moneyScore = Math.max(25, Math.min(98, moneyScore));

  let careerScore = 55;
  if (sipsung===7) careerScore = 85 + ship2B;
  else if (sipsung===6) careerScore = 70 + ship2B;
  else if (sipsung===5||sipsung===4) careerScore = 75 + ship2B;
  else if (sipsung===3) careerScore = 50 + ship2B;
  else careerScore = 60 + ship2B;
  careerScore = Math.max(25, Math.min(98, careerScore));

  let healthScore = 65;
  if (ship2===0||ship2===3||ship2===4) healthScore = 80;
  else if (ship2===6||ship2===7) healthScore = 45;
  else if (ship2===5) healthScore = 55;
  else healthScore = 65;
  if (sipsung===6) healthScore -= 8;
  healthScore = Math.max(25, Math.min(98, healthScore));

  let loveScore = 55;
  if (sipsung===5||sipsung===4) loveScore = 78 + ship2B/2;
  else if (sipsung===2||sipsung===9) loveScore = 75 + ship2B/2;
  else if (sipsung===1||sipsung===6) loveScore = 45 + ship2B/2;
  else loveScore = 62 + ship2B/2;
  loveScore = Math.max(25, Math.min(98, Math.round(loveScore)));

  let studyScore = 55;
  if (sipsung===9||sipsung===8) studyScore = 85 + ship2B;
  else if (sipsung===7) studyScore = 78 + ship2B;
  else if (sipsung===2) studyScore = 72 + ship2B;
  else studyScore = 58 + ship2B;
  studyScore = Math.max(25, Math.min(98, studyScore));

  const totalScore = Math.round((baseScore + ship2B + moneyScore + careerScore + healthScore + loveScore + studyScore) / 6);
  const clampedTotal = Math.max(30, Math.min(98, totalScore));

  const SIPSUNG_FORTUNE = {
    0: { money:'동업이나 공동 투자에 기회가 있습니다. 경쟁자도 많으니 차별화 전략이 필요합니다.', career:'독립적인 사업이나 프로젝트를 시작하기 좋습니다. 경쟁 속에서 실력을 발휘하세요.', love:'비슷한 성향의 사람을 만날 수 있습니다. 자기 주장이 강해 갈등에 주의하세요.', health:'과로에 주의하세요. 적절한 휴식과 운동의 균형이 필요합니다.', study:'라이벌 의식이 학업 동기가 됩니다. 스터디 그룹이 도움됩니다.' },
    1: { money:'투기성 지출에 주의하세요. 보증이나 연대보증은 피하는 것이 좋습니다.', career:'직장 내 경쟁이 치열합니다. 팀워크를 중시하되 자기 영역을 확실히 하세요.', love:'감정적 충돌이 있을 수 있습니다. 양보와 타협이 필요한 시기입니다.', health:'스트레스 관리가 중요합니다. 격한 운동보다 명상이나 요가가 좋습니다.', study:'집중력이 흐트러지기 쉽습니다. 조용한 환경에서 혼자 공부하세요.' },
    2: { money:'재능을 활용한 부수입 기회가 있습니다. 먹을 복이 있어 식비 지출이 늘 수 있습니다.', career:'창작이나 기획 관련 업무에서 좋은 성과를 냅니다. 안정적인 발전이 기대됩니다.', love:'자연스럽고 편안한 만남이 이루어집니다. 맛집 데이트가 좋은 결과를 가져옵니다.', health:'식습관 관리에 신경 쓰세요. 과식에 주의하되 영양 균형은 잘 맞습니다.', study:'학습 효율이 높은 해입니다. 자격증이나 기술 습득에 유리합니다.' },
    3: { money:'창의적인 아이디어로 수입을 올릴 수 있습니다. 하지만 충동 구매에 주의하세요.', career:'자유로운 활동이 좋은 결과를 가져옵니다. 규칙적인 조직 생활에는 불만이 있을 수 있습니다.', love:'매력이 빛나는 해이지만 구설이나 오해에 주의하세요. 진심을 전하는 것이 중요합니다.', health:'신경계통과 정신 건강에 신경 쓰세요. 과도한 스트레스를 피하세요.', study:'새로운 분야에 호기심이 생기지만 깊이가 부족할 수 있습니다. 집중이 필요합니다.' },
    4: { money:'사업이나 투자에서 큰 기회가 옵니다. 과감한 결단이 필요하지만 리스크 관리도 중요합니다.', career:'새로운 사업 기회나 부서 이동이 있을 수 있습니다. 인맥을 적극 활용하세요.', love:'사교적인 활동이 활발해집니다. 여러 이성과의 만남이 있지만 진정성이 중요합니다.', health:'활동량이 많아 체력 관리가 필요합니다. 간 건강에 주의하세요.', study:'실용적인 학문이 유리합니다. 현장 경험이 교과서보다 도움이 됩니다.' },
    5: { money:'꾸준한 저축과 안정적 투자가 유리합니다. 예금이나 적금을 시작하기 좋습니다.', career:'성실함이 인정받는 해입니다. 연봉 인상이나 안정적 수입 증가가 기대됩니다.', love:'진실된 만남이 이루어집니다. 결혼을 준비하거나 관계가 깊어지는 해입니다.', health:'규칙적인 생활이 건강의 비결입니다. 특별한 건강 문제는 없습니다.', study:'꾸준한 학습이 좋은 결과를 가져옵니다. 장기 계획에 유리합니다.' },
    6: { money:'예상치 못한 지출에 대비하세요. 보험이나 비상금 확보가 필요합니다.', career:'조직 내 갈등이나 상사와의 마찰에 주의하세요. 인내가 필요한 시기입니다.', love:'관계에 긴장감이 흐를 수 있습니다. 법적 문제나 서류 관련 일에 주의하세요.', health:'스트레스성 질환에 주의하세요. 혈압, 심장 관련 검진을 받아보세요.', study:'압박감 속에서 오히려 집중력이 올라갑니다. 시험이나 면접에 강합니다.' },
    7: { money:'승진이나 직위 상승으로 수입이 늘어날 수 있습니다. 사회적 활동비가 증가합니다.', career:'사회적 인정과 승진의 기회가 있습니다. 리더십을 발휘하기 좋은 해입니다.', love:'격식 있는 만남이 좋은 인연으로 이어집니다. 소개팅이 유리합니다.', health:'전반적으로 양호하지만 과로에 주의하세요. 규칙적인 수면이 중요합니다.', study:'공무원 시험이나 자격증에 유리합니다. 조직적인 학습이 효과적입니다.' },
    8: { money:'독특한 아이디어로 수입을 올릴 수 있습니다. 특허나 저작권 관련 수입이 가능합니다.', career:'연구나 기획 분야에서 두각을 나타냅니다. 전문 분야 깊이를 더하세요.', love:'지적인 교류가 있는 관계가 발전합니다. 같은 취미나 관심사가 인연이 됩니다.', health:'정신적 피로에 주의하세요. 충분한 수면과 명상이 도움이 됩니다.', study:'연구나 논문 작성에 유리합니다. 깊이 있는 학문이 성과를 냅니다.' },
    9: { money:'학문이나 자격을 통한 수입이 기대됩니다. 교육 투자가 미래에 큰 자산이 됩니다.', career:'자격증이나 학위가 커리어에 도움이 됩니다. 어머니나 스승의 도움이 큽니다.', love:'따뜻하고 안정적인 관계가 발전합니다. 가족의 소개가 좋은 인연이 됩니다.', health:'전반적으로 건강이 양호합니다. 문서나 보험 관련 일을 점검하세요.', study:'학업 운이 최고조입니다. 합격, 취득의 기쁨이 있을 수 있습니다.' }
  };

  const advice = SIPSUNG_FORTUNE[sipsung] || SIPSUNG_FORTUNE[0];

  const quarters = [];
  for (let q = 0; q < 4; q++) {
    const qMonth = q * 3 + 2;
    const qmp = getMonthPillar(year, qMonth, 15);
    const qSipsung = getSipsung(dayStem, qmp.stem);
    const qShip2 = SHIP2_TABLE[dayStem][qmp.branch];
    let qScore = {0:65,1:50,2:80,3:60,4:72,5:78,6:45,7:75,8:62,9:82}[qSipsung] || 60;
    qScore += {0:8,1:0,2:6,3:10,4:12,5:-3,6:-5,7:-8,8:-2,9:-10,10:2,11:4}[qShip2] || 0;
    qScore = Math.max(30, Math.min(95, qScore));
    quarters.push({
      label: ['1분기(1~3월)','2분기(4~6월)','3분기(7~9월)','4분기(10~12월)'][q],
      score: qScore,
      sipsung: qSipsung,
      ship2: qShip2,
      trend: qScore >= 75 ? '상승' : qScore >= 55 ? '보통' : '주의'
    });
  }

  return {
    year, stem: yStem, branch: yBranch,
    sipsung, ship2,
    totalScore: clampedTotal,
    categories: {
      money: { score: moneyScore, label: '재물운', icon: '💰', advice: advice.money },
      career: { score: careerScore, label: '직장/사업운', icon: '💼', advice: advice.career },
      love: { score: loveScore, label: '연애/관계운', icon: '❤️', advice: advice.love },
      health: { score: healthScore, label: '건강운', icon: '🏥', advice: advice.health },
      study: { score: studyScore, label: '학업/시험운', icon: '📚', advice: advice.study }
    },
    quarters,
    chunganRel,
    jijiRel,
    animal: JIJI[yBranch].animal
  };
}

// ============================================================
// 월운 상세 분석
// ============================================================
export function getDetailedMonthlyFortune(dayStem, year) {
  const months = [];
  const MONTH_ADVICE = {
    0: {good:'자기 주도적 활동이 유리합니다.', caution:'독단적인 결정은 피하세요.'},
    1: {good:'적극적으로 움직이면 기회를 잡습니다.', caution:'재물 손실에 주의, 보증을 서지 마세요.'},
    2: {good:'재능을 발휘하기 좋은 달입니다. 맛있는 음식이 행운.', caution:'과식이나 낭비에 주의하세요.'},
    3: {good:'창의력이 빛나는 달, 새로운 시도가 좋습니다.', caution:'말실수와 구설에 주의하세요.'},
    4: {good:'사업이나 투자 기회가 옵니다. 인맥 활용이 유리.', caution:'과욕은 금물, 리스크 관리 필수.'},
    5: {good:'꾸준한 노력이 빛을 봅니다. 저축에 좋은 달.', caution:'너무 인색하면 기회를 놓칠 수 있습니다.'},
    6: {good:'위기가 기회가 되는 달. 도전정신이 필요합니다.', caution:'건강과 안전에 각별히 주의하세요.'},
    7: {good:'승진이나 사회적 인정의 기회가 있습니다.', caution:'책임감이 무거울 수 있으니 분배가 필요합니다.'},
    8: {good:'학문이나 자격 관련 활동이 유리합니다.', caution:'생각만 많고 행동이 없으면 안 됩니다.'},
    9: {good:'학업운이 좋고 주변의 도움이 있습니다.', caution:'의존하기보다 자기 역량을 키우세요.'}
  };

  for (let m = 1; m <= 12; m++) {
    const mp = getMonthPillar(year, m, 15);
    const sipsung = getSipsung(dayStem, mp.stem);
    const ship2 = SHIP2_TABLE[dayStem][mp.branch];

    let score = {0:65,1:50,2:80,3:60,4:72,5:78,6:45,7:75,8:62,9:82}[sipsung] || 60;
    score += {0:8,1:0,2:6,3:10,4:12,5:-3,6:-5,7:-8,8:-2,9:-10,10:2,11:4}[ship2] || 0;
    score = Math.max(30, Math.min(95, score));

    const advice = MONTH_ADVICE[sipsung] || MONTH_ADVICE[0];

    let moneyS = sipsung===4||sipsung===5 ? score+8 : sipsung===1 ? score-12 : score;
    let loveS = sipsung===5||sipsung===2 ? score+6 : sipsung===6 ? score-10 : score;
    let healthS = ship2<=4 ? score+5 : ship2>=7 ? score-8 : score;
    moneyS = Math.max(25,Math.min(98,moneyS));
    loveS = Math.max(25,Math.min(98,loveS));
    healthS = Math.max(25,Math.min(98,healthS));

    months.push({
      month: m, stem: mp.stem, branch: mp.branch,
      sipsung, ship2, score,
      moneyScore: moneyS, loveScore: loveS, healthScore: healthS,
      good: advice.good, caution: advice.caution,
      keyword: SIPSUNG_NAMES[sipsung],
      trend: score >= 75 ? '길' : score >= 55 ? '평' : '흉'
    });
  }
  return months;
}

// ============================================================
// 일운 7일간 상세 분석
// ============================================================
export function getWeeklyDailyFortune(dayStem, pillars) {
  const today = new Date();
  const days = [];
  const dayNames = ['일','월','화','수','목','금','토'];

  const DAILY_THEMES = {
    0: '자기 주장이 강해지는 날. 독립적 활동이 유리합니다.',
    1: '경쟁 상황이 생길 수 있습니다. 양보가 미덕입니다.',
    2: '맛있는 음식과 함께하는 날. 재능이 빛나는 하루.',
    3: '말과 글에 영감이 넘칩니다. 창작 활동에 좋은 날.',
    4: '재물 거래나 쇼핑에 좋은 날. 인맥 활동도 유리합니다.',
    5: '안정적인 수입과 관련된 좋은 소식이 있을 수 있습니다.',
    6: '긴장감이 있는 날. 안전과 건강에 주의하세요.',
    7: '공적인 자리에서 인정받을 수 있는 날입니다.',
    8: '공부나 독서에 집중하기 좋은 날입니다.',
    9: '어른이나 선생님의 도움이 있는 날. 문서 관련 일이 순조롭습니다.'
  };

  const DAILY_LUCKY = {
    '목': {color:'초록', dir:'동', food:'채소류', activity:'산책·등산'},
    '화': {color:'빨강', dir:'남', food:'매운 음식', activity:'운동·사교'},
    '토': {color:'노랑', dir:'중앙', food:'달콤한 음식', activity:'집안일·정리'},
    '금': {color:'흰색', dir:'서', food:'해산물', activity:'명상·정돈'},
    '수': {color:'파랑', dir:'북', food:'국물류', activity:'독서·공부'}
  };

  for (let i = -1; i <= 5; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dp = getDayPillar(d.getFullYear(), d.getMonth()+1, d.getDate());
    const sipsung = getSipsung(dayStem, dp.stem);
    const ship2 = SHIP2_TABLE[dayStem][dp.branch];

    let score = {0:70,1:55,2:85,3:65,4:75,5:80,6:50,7:78,8:68,9:82}[sipsung] || 60;
    score += {0:10,1:0,2:8,3:12,4:15,5:-2,6:-5,7:-8,8:-3,9:-10,10:3,11:5}[ship2] || 0;
    score = Math.max(30, Math.min(98, score));

    const dayBranch = pillars[2].branch;
    let dayRel = '';
    if (Math.abs(dayBranch - dp.branch) === 6) dayRel = '충일(沖)';
    YUKHAP.forEach(([a,b]) => {
      if ((dayBranch===a && dp.branch===b)||(dayBranch===b && dp.branch===a)) dayRel = '합일(合)';
    });

    const stemEl = CHEONGAN[dp.stem].element;
    const lucky = DAILY_LUCKY[stemEl] || DAILY_LUCKY['토'];

    days.push({
      date: d,
      dateStr: (d.getMonth()+1)+'/'+d.getDate(),
      dayName: dayNames[d.getDay()],
      stem: dp.stem, branch: dp.branch,
      sipsung, ship2, score,
      isToday: i === 0,
      isYesterday: i === -1,
      theme: DAILY_THEMES[sipsung],
      keyword: SIPSUNG_NAMES[sipsung],
      ship2Name: SHIP2_NAMES[ship2],
      dayRel,
      lucky,
      timeSlots: [
        { label: '오전(06-12)', score: Math.max(30, Math.min(98, score + (ship2<=2 ? 5 : -3))) },
        { label: '오후(12-18)', score: Math.max(30, Math.min(98, score + (sipsung%2===0 ? 3 : -2))) },
        { label: '저녁(18-24)', score: Math.max(30, Math.min(98, score + (ship2>=8 ? 5 : ship2>=5 ? -3 : 0))) }
      ]
    });
  }
  return days;
}

// ============================================================
// 월간 달력 운세
// ============================================================
export function getMonthlyCalendarFortune(dayStem, pillars, year, month) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const today = new Date();
  const todayDate = today.getDate();
  const todayMonth = today.getMonth() + 1;
  const todayYear = today.getFullYear();
  const isCurrentMonth = (year === todayYear && month === todayMonth);

  const dayNames = ['일','월','화','수','목','금','토'];
  const dayBranch = pillars[2].branch;

  const DAILY_THEMES = {
    0: '독립적 활동이 유리한 날',
    1: '경쟁 주의, 양보가 미덕',
    2: '재능이 빛나는 날, 먹을 복',
    3: '창작과 표현에 좋은 날',
    4: '사업·투자 기회의 날',
    5: '안정적 수입, 저축에 좋은 날',
    6: '긴장감 있는 날, 안전 주의',
    7: '사회적 인정의 날',
    8: '공부·독서에 좋은 날',
    9: '어른의 도움, 문서 관련 길일'
  };

  const DAILY_LUCKY = {
    '목': {color:'초록', dir:'동쪽', num:'3,8'},
    '화': {color:'빨강', dir:'남쪽', num:'2,7'},
    '토': {color:'노랑', dir:'중앙', num:'5,10'},
    '금': {color:'흰색', dir:'서쪽', num:'4,9'},
    '수': {color:'파랑', dir:'북쪽', num:'1,6'}
  };

  const cells = [];
  for (let i = 0; i < startWeekday; i++) {
    cells.push(null);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dp = getDayPillar(year, month, d);
    const sipsung = getSipsung(dayStem, dp.stem);
    const ship2 = SHIP2_TABLE[dayStem][dp.branch];

    let score = {0:70,1:55,2:85,3:65,4:75,5:80,6:50,7:78,8:68,9:82}[sipsung] || 60;
    score += {0:10,1:0,2:8,3:12,4:15,5:-2,6:-5,7:-8,8:-3,9:-10,10:3,11:5}[ship2] || 0;
    score = Math.max(30, Math.min(98, score));

    const dateObj = new Date(year, month - 1, d);
    const weekday = dateObj.getDay();

    let dayRel = '';
    if (Math.abs(dayBranch - dp.branch) === 6) dayRel = '충';
    YUKHAP.forEach(([a,b]) => {
      if ((dayBranch===a && dp.branch===b)||(dayBranch===b && dp.branch===a)) dayRel = '합';
    });

    const stemEl = CHEONGAN[dp.stem].element;
    const lucky = DAILY_LUCKY[stemEl] || DAILY_LUCKY['토'];

    const timeSlots = [
      { label: '오전', score: Math.max(30, Math.min(98, score + (ship2<=2 ? 5 : -3))) },
      { label: '오후', score: Math.max(30, Math.min(98, score + (sipsung%2===0 ? 3 : -2))) },
      { label: '저녁', score: Math.max(30, Math.min(98, score + (ship2>=8 ? 5 : ship2>=5 ? -3 : 0))) }
    ];

    cells.push({
      day: d,
      weekday,
      weekdayName: dayNames[weekday],
      stem: dp.stem,
      branch: dp.branch,
      sipsung, ship2, score,
      isToday: isCurrentMonth && d === todayDate,
      isPast: isCurrentMonth && d < todayDate,
      theme: DAILY_THEMES[sipsung],
      keyword: SIPSUNG_NAMES[sipsung],
      ship2Name: SHIP2_NAMES[ship2],
      dayRel,
      lucky,
      timeSlots
    });
  }

  const validCells = cells.filter(c => c !== null);
  const avgScore = Math.round(validCells.reduce((s, c) => s + c.score, 0) / validCells.length);
  const bestDay = validCells.reduce((best, c) => c.score > best.score ? c : best, validCells[0]);
  const worstDay = validCells.reduce((worst, c) => c.score < worst.score ? c : worst, validCells[0]);

  return {
    year, month, daysInMonth, startWeekday,
    cells,
    avgScore,
    bestDay,
    worstDay,
    isCurrentMonth
  };
}

// ============================================================
// 세운 10년 흐름 분석
// ============================================================
export function getDecadeFortuneFlow(dayStem, startYear) {
  const currentYear = startYear || new Date().getFullYear();
  const years = [];

  for (let i = -2; i <= 7; i++) {
    const y = currentYear + i;
    const seunStem = ((y - 4) % 10 + 10) % 10;
    const seunBranch = ((y - 4) % 12 + 12) % 12;
    const sipsung = getSipsung(dayStem, seunStem);
    const ship2 = SHIP2_TABLE[dayStem][seunBranch];

    let score = 60;
    const ssScores = {0:65,1:50,2:80,3:60,4:72,5:78,6:45,7:75,8:62,9:82};
    score = ssScores[sipsung] || 60;
    const s2Bonus = {0:10,1:0,2:8,3:12,4:15,5:-2,6:-5,7:-8,8:-3,9:-10,10:3,11:5};
    score += (s2Bonus[ship2] || 0);
    score = Math.max(30, Math.min(98, score));

    const keywords = [];
    if (sipsung === 2 || sipsung === 5) keywords.push('재물운 상승');
    if (sipsung === 7 || sipsung === 9) keywords.push('명예·학업 유리');
    if (sipsung === 4) keywords.push('투자·사업 기회');
    if (sipsung === 6) keywords.push('변동·도전의 해');
    if (sipsung === 1) keywords.push('경쟁·분쟁 주의');
    if (sipsung === 3) keywords.push('표현·창작 유리');
    if (ship2 === 4) keywords.push('전성기');
    if (ship2 === 0) keywords.push('새로운 시작');
    if (ship2 === 7 || ship2 === 9) keywords.push('정리·전환기');

    years.push({
      year: y,
      stem: seunStem,
      branch: seunBranch,
      sipsung,
      ship2,
      score,
      keywords,
      isCurrent: y === new Date().getFullYear(),
      animal: JIJI[seunBranch].animal
    });
  }

  return years;
}
