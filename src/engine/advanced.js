// ============================================================
// Advanced Analysis Functions
// ============================================================
import { CHEONGAN, JIJI, JIJANGGAN, SHIP2_TABLE } from '../data/pillarData.js';
import { YUKHAP } from '../data/relationsData.js';
import { getSipsung, getDayPillar, getMonthPillar } from './calculator.js';
import { getDayOfYear } from './calendar.js';

// ============================================================
// 용신(用神) 정밀 분석 알고리즘
// ============================================================
export function analyzeYongsin(pillars, dayStem, detailedElements) {
  const dayElement = CHEONGAN[dayStem].element;
  const totalEl = Object.values(detailedElements).reduce((a, b) => a + b, 0);
  const myStrength = detailedElements[dayElement] || 0;
  const ratio = myStrength / totalEl;

  const SAENG_ME = { '목':'수', '화':'목', '토':'화', '금':'토', '수':'금' };
  const I_SAENG = { '목':'화', '화':'토', '토':'금', '금':'수', '수':'목' };
  const GEUK_ME = { '목':'금', '화':'수', '토':'목', '금':'화', '수':'토' };
  const I_GEUK = { '목':'토', '화':'금', '토':'수', '금':'목', '수':'화' };

  const saengElement = SAENG_ME[dayElement];
  const myForce = (detailedElements[dayElement] || 0) + (detailedElements[saengElement] || 0);
  const otherForce = totalEl - myForce;
  const forceRatio = myForce / totalEl;

  let isStrong = forceRatio > 0.4;

  const monthBranch = pillars[1].branch;
  const monthElement = JIJI[monthBranch].element;
  if (monthElement === dayElement || monthElement === saengElement) {
    isStrong = forceRatio > 0.35;
  } else {
    isStrong = forceRatio > 0.45;
  }

  let rootCount = 0;
  pillars.forEach(p => {
    if (JIJI[p.branch].element === dayElement) rootCount++;
    const jjg = JIJANGGAN[p.branch];
    jjg.forEach(j => {
      if (CHEONGAN[j.s].element === dayElement) rootCount += j.w / 10;
    });
  });
  if (rootCount >= 2) isStrong = true;
  if (rootCount < 0.5) isStrong = false;

  let yongsin, huisin, gisin, gusin;
  const OHENG_KR_HANJA = { '목':'木', '화':'火', '토':'土', '금':'金', '수':'水' };

  if (isStrong) {
    const sikEl = I_SAENG[dayElement];
    const jaeEl = I_GEUK[dayElement];
    const gwanEl = GEUK_ME[dayElement];
    const sikVal = detailedElements[sikEl] || 0;
    const jaeVal = detailedElements[jaeEl] || 0;
    const gwanVal = detailedElements[gwanEl] || 0;

    if (jaeVal <= sikVal && jaeVal <= gwanVal) {
      yongsin = jaeEl;
      huisin = sikEl;
    } else if (sikVal < gwanVal) {
      yongsin = sikEl;
      huisin = jaeEl;
    } else {
      yongsin = gwanEl;
      huisin = jaeEl;
    }
    gisin = dayElement;
    gusin = SAENG_ME[dayElement];
  } else {
    const inEl = SAENG_ME[dayElement];
    const biEl = dayElement;
    const inVal = detailedElements[inEl] || 0;
    const biVal = detailedElements[biEl] || 0;

    if (inVal < biVal) {
      yongsin = inEl;
      huisin = biEl;
    } else {
      yongsin = biEl;
      huisin = inEl;
    }
    gisin = GEUK_ME[dayElement];
    gusin = I_GEUK[dayElement];
  }

  const dirMap = { '목':'동쪽', '화':'남쪽', '토':'중앙', '금':'서쪽', '수':'북쪽' };
  const colorMap = { '목':'초록색, 연두색', '화':'빨간색, 주황색, 보라색', '토':'노란색, 갈색, 베이지색', '금':'흰색, 은색, 금색', '수':'검정색, 파란색, 남색' };
  const numMap = { '목':'3, 8', '화':'2, 7', '토':'5, 10', '금':'4, 9', '수':'1, 6' };
  const seasonMap = { '목':'봄 (2~4월)', '화':'여름 (5~7월)', '토':'환절기 (계절 전환기)', '금':'가을 (8~10월)', '수':'겨울 (11~1월)' };
  const foodMap = { '목':'초록색 채소, 신맛 음식', '화':'붉은색 식품, 쓴맛 음식', '토':'노란색 식품, 단맛 음식', '금':'흰색 식품, 매운맛 음식', '수':'검은색 식품, 짠맛 음식' };
  const jobMap = {
    '목': '교육, 출판, 환경, 의류, 목재, 한의학, 건축설계',
    '화': '방송, 연예, 화학, 전기전자, 요식업, 조명, 석유',
    '토': '부동산, 건설, 농업, 도자기, 창고업, 중개업, 보험',
    '금': '금융, 자동차, 기계, 귀금속, 법조, 군경, 제조업',
    '수': '무역, 해운, 수산업, IT, 물류, 관광, 음료업'
  };

  return {
    isStrong,
    forceRatio,
    rootCount,
    yongsin: { element: yongsin, hanja: OHENG_KR_HANJA[yongsin], direction: dirMap[yongsin], color: colorMap[yongsin], number: numMap[yongsin], season: seasonMap[yongsin], food: foodMap[yongsin], job: jobMap[yongsin] },
    huisin: { element: huisin, hanja: OHENG_KR_HANJA[huisin], desc: '용신을 돕는 오행' },
    gisin: { element: gisin, hanja: OHENG_KR_HANJA[gisin], desc: '일간에 불리한 오행' },
    gusin: { element: gusin, hanja: OHENG_KR_HANJA[gusin], desc: '기신을 돕는 오행' },
    dayElement,
    strengthDesc: isStrong
      ? `일간 ${CHEONGAN[dayStem].name}${dayElement}(${OHENG_KR_HANJA[dayElement]})의 세력이 강한 '신강(身强)' 사주입니다. 에너지가 넘치므로 설기(식상)·재성·관성의 기운으로 에너지를 분산시키는 것이 유리합니다.`
      : `일간 ${CHEONGAN[dayStem].name}${dayElement}(${OHENG_KR_HANJA[dayElement]})의 세력이 약한 '신약(身弱)' 사주입니다. 인성(학문/도움)과 비겁(협력)의 기운으로 일간을 보강하는 것이 유리합니다.`
  };
}

// ============================================================
// 일간 강약 정밀 분석
// ============================================================
export function analyzeDayMasterStrength(pillars, dayStem, detailedElements) {
  const dayElement = CHEONGAN[dayStem].element;
  const SAENG_ME = { '목':'수', '화':'목', '토':'화', '금':'토', '수':'금' };

  const monthBranchEl = JIJI[pillars[1].branch].element;
  const deukryeong = (monthBranchEl === dayElement || monthBranchEl === SAENG_ME[dayElement]);

  let deukji = 0;
  [2, 3].forEach(idx => {
    const brEl = JIJI[pillars[idx].branch].element;
    if (brEl === dayElement || brEl === SAENG_ME[dayElement]) deukji++;
  });

  let deukse = 0;
  [0, 1, 3].forEach(idx => {
    const stEl = CHEONGAN[pillars[idx].stem].element;
    if (stEl === dayElement || stEl === SAENG_ME[dayElement]) deukse++;
  });

  let tonggeun = [];
  const pillarNames = ['년지','월지','일지','시지'];
  pillars.forEach((p, i) => {
    const jjg = JIJANGGAN[p.branch];
    jjg.forEach(j => {
      if (Math.floor(j.s / 2) === Math.floor(dayStem / 2)) {
        tonggeun.push({ pillar: pillarNames[i], stem: CHEONGAN[j.s].name, weight: j.w });
      }
    });
  });

  let strengthScore = 0;
  if (deukryeong) strengthScore += 35;
  strengthScore += deukji * 15;
  strengthScore += deukse * 10;
  strengthScore += tonggeun.reduce((sum, t) => sum + t.weight * 2, 0);

  let level;
  if (strengthScore >= 70) level = '극강(極强)';
  else if (strengthScore >= 50) level = '신강(身强)';
  else if (strengthScore >= 35) level = '중화(中和)';
  else if (strengthScore >= 20) level = '신약(身弱)';
  else level = '극약(極弱)';

  return {
    deukryeong: { result: deukryeong, desc: deukryeong ? `월지 ${JIJI[pillars[1].branch].name}(${monthBranchEl})이 일간을 도와 득령했습니다.` : `월지 ${JIJI[pillars[1].branch].name}(${monthBranchEl})이 일간을 돕지 않아 실령했습니다.` },
    deukji: { count: deukji, desc: deukji > 0 ? `지지 ${deukji}곳에서 일간을 도와 득지했습니다.` : '일지·시지에서 일간을 돕지 않아 실지했습니다.' },
    deukse: { count: deukse, desc: deukse > 0 ? `천간 ${deukse}곳에서 일간을 도와 득세했습니다.` : '다른 천간에서 일간을 돕지 않아 실세했습니다.' },
    tonggeun,
    strengthScore,
    level,
    summary: `이 사주는 ${level} 사주입니다. (강약 점수: ${strengthScore}점)`
  };
}

// ============================================================
// 진태양시 보정
// ============================================================
export function getTrueSolarTimeCorrection(year, month, day, hour, minute, longitude) {
  const STD_LONGITUDE = 135;
  const localLongitude = longitude || 127;

  const longitudeCorrection = (localLongitude - STD_LONGITUDE) * 4;

  const dayOfYear = getDayOfYear(year, month, day);
  const B = (2 * Math.PI * (dayOfYear - 81)) / 365;
  const equationOfTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  const totalCorrection = Math.round(longitudeCorrection + equationOfTime);

  let totalMinutes = hour * 60 + (minute || 0) + totalCorrection;
  if (totalMinutes < 0) totalMinutes += 1440;
  if (totalMinutes >= 1440) totalMinutes -= 1440;

  const correctedHour = Math.floor(totalMinutes / 60);
  const correctedMinute = totalMinutes % 60;

  return {
    originalTime: `${String(hour).padStart(2,'0')}:${String(minute||0).padStart(2,'0')}`,
    correctedTime: `${String(correctedHour).padStart(2,'0')}:${String(correctedMinute).padStart(2,'0')}`,
    correction: totalCorrection,
    correctedHour,
    correctedMinute,
    desc: `경도 보정(${longitudeCorrection > 0 ? '+' : ''}${Math.round(longitudeCorrection)}분) + 균시차(${equationOfTime > 0 ? '+' : ''}${Math.round(equationOfTime)}분) = 총 ${totalCorrection > 0 ? '+' : ''}${totalCorrection}분`
  };
}

// ============================================================
// 인생 로드맵 분석
// ============================================================
export function getLifeRoadmap(pillars, dayStem, daeun, gender) {
  const stages = [];

  const earlyPillar = pillars[0];
  const earlySipsung = getSipsung(dayStem, earlyPillar.stem);
  stages.push({
    period: '초년운 (0~20세)',
    pillar: '년주·월주 영향',
    desc: getLifeStageDesc('early', earlySipsung, JIJI[earlyPillar.branch].element),
    element: CHEONGAN[earlyPillar.stem].element
  });

  const youthPillar = pillars[1];
  const youthSipsung = getSipsung(dayStem, youthPillar.stem);
  stages.push({
    period: '청년운 (20~40세)',
    pillar: '월주·일주 영향',
    desc: getLifeStageDesc('youth', youthSipsung, JIJI[youthPillar.branch].element),
    element: CHEONGAN[youthPillar.stem].element
  });

  const midPillar = pillars[2];
  const midSipsung = getSipsung(dayStem, midPillar.stem);
  stages.push({
    period: '중년운 (40~60세)',
    pillar: '일주·시주 영향',
    desc: getLifeStageDesc('middle', midSipsung, JIJI[midPillar.branch].element),
    element: CHEONGAN[midPillar.stem].element
  });

  const latePillar = pillars[3];
  const lateSipsung = getSipsung(dayStem, latePillar.stem);
  stages.push({
    period: '말년운 (60세~)',
    pillar: '시주 영향',
    desc: getLifeStageDesc('late', lateSipsung, JIJI[latePillar.branch].element),
    element: CHEONGAN[latePillar.stem].element
  });

  const turningPoints = [];
  if (daeun && daeun.pillars) {
    daeun.pillars.forEach((dp, i) => {
      const dpSipsung = getSipsung(dayStem, dp.stem);
      const dpShip2 = SHIP2_TABLE[dayStem][dp.branch];
      if (dpShip2 === 4) {
        turningPoints.push({ age: dp.startAge, desc: `${dp.startAge}~${dp.endAge}세: 전성기 - 모든 일이 정점에 이르는 시기`, type:'peak' });
      } else if (dpShip2 === 0) {
        turningPoints.push({ age: dp.startAge, desc: `${dp.startAge}~${dp.endAge}세: 새로운 시작 - 제2의 인생이 펼쳐지는 시기`, type:'start' });
      } else if (dpShip2 === 3) {
        turningPoints.push({ age: dp.startAge, desc: `${dp.startAge}~${dp.endAge}세: 안정기 - 사회적 기반이 단단해지는 시기`, type:'stable' });
      } else if (dpSipsung === 4 || dpSipsung === 5) {
        turningPoints.push({ age: dp.startAge, desc: `${dp.startAge}~${dp.endAge}세: 재물운 상승 - 경제적 성장기`, type:'wealth' });
      }
    });
  }

  return { stages, turningPoints };
}

export function getLifeStageDesc(stage, sipsung, element) {
  const stageDescs = {
    early: {
      0: '독립심이 강하고 자기 주관이 뚜렷한 어린 시절입니다. 또래보다 성숙한 면이 있습니다.',
      1: '형제자매나 친구와의 경쟁이 있지만, 이를 통해 강인함을 기릅니다.',
      2: '먹을 복이 있고 재능이 다양하게 발현되는 유년기입니다. 밝고 건강합니다.',
      3: '표현력과 창의력이 뛰어나지만, 규칙에 반항하는 면이 있습니다.',
      4: '가정환경의 변동이 있을 수 있으나, 이를 통해 적응력을 기릅니다.',
      5: '비교적 안정적인 가정환경에서 성장하며, 물질적 부족함이 적습니다.',
      6: '엄격한 교육환경에서 자라며, 규율과 질서를 일찍 배웁니다.',
      7: '가문의 기대를 받으며 자라고, 명예를 중시하는 가치관이 형성됩니다.',
      8: '학문적 재능이 일찍 나타나며, 독서를 좋아하는 어린 시절입니다.',
      9: '부모의 사랑을 받으며 자라고, 학업에서 두각을 나타냅니다.'
    },
    youth: {
      0: '자기 사업이나 독립적인 활동을 시작하는 시기입니다.',
      1: '경쟁이 치열하지만 이를 통해 실력을 갈고닦습니다.',
      2: '재능이 꽃피는 시기로, 직업적 기반을 다집니다.',
      3: '창의적인 분야에서 두각을 나타내며, 자유로운 활동을 합니다.',
      4: '사업이나 투자의 기회가 찾아오는 시기입니다.',
      5: '안정적인 직장생활이나 꾸준한 수입이 시작됩니다.',
      6: '사회적 도전과 시련을 통해 성장하는 시기입니다.',
      7: '사회적 인정을 받고 지위가 올라가는 시기입니다.',
      8: '학문이나 기술을 연마하여 전문가로 성장합니다.',
      9: '자격증이나 학위를 취득하여 경력의 기반을 세웁니다.'
    },
    middle: {
      0: '독립적 사업이나 프로젝트로 성과를 내는 시기입니다.',
      1: '치열한 경쟁 속에서 자리를 잡아가는 시기입니다.',
      2: '축적된 재능으로 안정적인 수입과 명성을 얻습니다.',
      3: '창작활동이나 자유업으로 큰 성과를 거둡니다.',
      4: '재물 운이 좋아 자산이 늘어나는 시기입니다.',
      5: '꾸준한 노력의 결실을 맺어 경제적 안정을 이룹니다.',
      6: '큰 도전과 변화가 있지만, 이를 통해 한 단계 도약합니다.',
      7: '사회적 지위가 정점에 이르며 존경을 받습니다.',
      8: '깊은 지혜와 통찰력으로 주변의 신뢰를 얻습니다.',
      9: '학문적 성취가 사회적 인정으로 이어집니다.'
    },
    late: {
      0: '건강하고 활동적인 노후를 보내며, 취미활동을 즐깁니다.',
      1: '자녀나 후배들과의 관계에서 활력을 얻습니다.',
      2: '먹을 복이 있어 건강하고 여유로운 노후입니다.',
      3: '예술이나 창작활동으로 풍요로운 노후를 보냅니다.',
      4: '재물이 풍족하여 넉넉한 노후를 보냅니다.',
      5: '안정적인 자산으로 편안한 노후를 보냅니다.',
      6: '건강에 주의가 필요하지만, 정신적으로는 강합니다.',
      7: '존경받는 원로로서 사회에 기여합니다.',
      8: '영적·학문적 활동으로 깊은 만족을 느낍니다.',
      9: '자녀의 효도를 받으며 평안한 노후를 보냅니다.'
    }
  };

  return (stageDescs[stage] && stageDescs[stage][sipsung]) || '운세의 흐름이 자연스럽게 펼쳐집니다.';
}

// ============================================================
// 삼합 반합 감지
// ============================================================
export function detectPartialCombinations(pillars) {
  const branches = pillars.map(p => p.branch);
  const results = [];

  const samhapSets = [
    { full: [2,6,10], element: '화', name: '인오술' },
    { full: [11,3,7], element: '목', name: '해묘미' },
    { full: [8,0,4], element: '수', name: '신자진' },
    { full: [5,9,1], element: '금', name: '사유축' }
  ];

  samhapSets.forEach(sh => {
    const found = [];
    branches.forEach((b, idx) => {
      if (sh.full.includes(b)) found.push({ branch: b, idx });
    });

    if (found.length === 3) {
      results.push({
        type: '삼합',
        name: `${sh.name} 삼합${sh.element}국`,
        desc: `완전한 삼합이 형성되어 ${sh.element}의 기운이 매우 강력합니다.`,
        element: sh.element,
        strength: 'full'
      });
    } else if (found.length === 2) {
      const wangji = sh.full[1];
      const hasWangji = found.some(f => f.branch === wangji);

      if (hasWangji) {
        const otherBranch = found.find(f => f.branch !== wangji);
        if (!otherBranch) return;
        const isSheng = sh.full[0] === otherBranch.branch;
        results.push({
          type: '반합',
          name: `${JIJI[found[0].branch].name}${JIJI[found[1].branch].name} 반합`,
          desc: `${sh.element}의 기운을 향한 반합(半合)이 형성됩니다. ${isSheng ? '생지와 왕지의 반합으로 기운이 점점 강해지는 형국입니다.' : '왕지와 묘지의 반합으로 기운이 저장되는 형국입니다.'}`,
          element: sh.element,
          strength: 'half'
        });
      }
    }
  });

  return results;
}

// ============================================================
// 나와 맞는/안맞는 띠 & 오행 분석
// ============================================================
export function analyzeMyCompatibility(dayStem, dayBranch, yearBranch) {
  const dayElement = CHEONGAN[dayStem].element;
  const SAENG = {'목':'화','화':'토','토':'금','금':'수','수':'목'};
  const SAENG_ME = {'목':'수','화':'목','토':'화','금':'토','수':'금'};
  const GEUK = {'목':'토','화':'금','토':'수','금':'목','수':'화'};
  const GEUK_ME = {'목':'금','화':'수','토':'목','금':'화','수':'토'};

  const YUKHAP_PAIRS = {0:1,1:0, 2:11,11:2, 3:10,10:3, 4:9,9:4, 5:8,8:5, 6:7,7:6};
  const SAMHAP_GROUPS = [[2,6,10],[5,9,1],[8,0,4],[11,3,7]];
  const CHUNG_PAIRS = {0:6,6:0, 1:7,7:1, 2:8,8:2, 3:9,9:3, 4:10,10:4, 5:11,11:5};
  const HYUNG_MAP = {2:[5,8],5:[2,8],8:[2,5], 1:[10,7],10:[1,7],7:[1,10], 0:[3],3:[0]};
  const HAE_PAIRS = {0:7,7:0, 1:6,6:1, 2:5,5:2, 3:4,4:3, 8:11,11:8, 9:10,10:9};
  const WONJIN_PAIRS = {0:7,1:6,2:5,3:4,4:3,5:2,6:1,7:0,8:11,9:10,10:9,11:8};

  const myBranch = dayBranch;
  const animals = ['쥐','소','호랑이','토끼','용','뱀','말','양','원숭이','닭','개','돼지'];
  const emojis = ['🐭','🐂','🐯','🐰','🐲','🐍','🐴','🐑','🐵','🐔','🐶','🐷'];

  const zodiacCompat = [];
  for (let i = 0; i < 12; i++) {
    if (i === myBranch) continue;
    let score = 50;
    let relations = [];

    if (YUKHAP_PAIRS[myBranch] === i) { score += 30; relations.push({type:'육합',desc:'서로 끌리는 최고의 궁합',color:'#4ade80'}); }
    const mySamhap = SAMHAP_GROUPS.find(g => g.includes(myBranch));
    if (mySamhap && mySamhap.includes(i)) { score += 18; relations.push({type:'삼합',desc:'함께하면 큰 힘이 되는 관계',color:'#22d3ee'}); }
    if (CHUNG_PAIRS[myBranch] === i) { score -= 25; relations.push({type:'충',desc:'갈등이 많지만 자극이 되는 관계',color:'#f87171'}); }
    if (HYUNG_MAP[myBranch] && HYUNG_MAP[myBranch].includes(i)) { score -= 15; relations.push({type:'형',desc:'긴장과 시련이 있는 관계',color:'#fb923c'}); }
    if (HAE_PAIRS[myBranch] === i) { score -= 12; relations.push({type:'해',desc:'은밀한 방해가 있을 수 있는 관계',color:'#a78bfa'}); }
    if (WONJIN_PAIRS[myBranch] === i) { score -= 10; relations.push({type:'원진',desc:'만나면 반갑지만 오래 있으면 피곤한 관계',color:'#f59e0b'}); }
    if (JIJI[myBranch].element === JIJI[i].element) { score += 8; relations.push({type:'동오행',desc:'비슷한 성향으로 이해가 쉬움',color:'#60a5fa'}); }

    score = Math.max(15, Math.min(98, score));

    let grade;
    if (score >= 80) grade = '최고';
    else if (score >= 65) grade = '좋음';
    else if (score >= 45) grade = '보통';
    else if (score >= 30) grade = '주의';
    else grade = '상극';

    zodiacCompat.push({
      branch: i, animal: animals[i], emoji: emojis[i],
      hanja: JIJI[i].hanja, element: JIJI[i].element,
      score, grade, relations
    });
  }

  zodiacCompat.sort((a, b) => b.score - a.score);
  const bestZodiac = zodiacCompat.slice(0, 3);
  const worstZodiac = zodiacCompat.slice(-3).reverse();

  const ohengCompat = [];
  const ohengNames = ['목','화','토','금','수'];
  const ohengHanja = ['木','火','土','金','水'];
  const ohengEmoji = ['🌳','🔥','⛰️','⚔️','💧'];

  ohengNames.forEach((el, i) => {
    let score = 50;
    let relation = '';
    let relType = '';

    if (el === dayElement) {
      score = 65; relation = '같은 오행으로 서로 이해하고 공감합니다. 동료·친구 관계에 좋습니다.'; relType = '비화(比和)';
    } else if (SAENG[dayElement] === el) {
      score = 60; relation = '내가 생해주는 오행입니다. 내 에너지를 쏟지만 보람이 있습니다.'; relType = '내가 생(生)';
    } else if (SAENG_ME[dayElement] === el) {
      score = 85; relation = '나를 생해주는 오행입니다! 나에게 힘과 도움을 줍니다.'; relType = '나를 생(生)';
    } else if (GEUK[dayElement] === el) {
      score = 55; relation = '내가 극하는 오행입니다. 내가 통제하지만 에너지 소모가 있습니다.'; relType = '내가 극(剋)';
    } else if (GEUK_ME[dayElement] === el) {
      score = 30; relation = '나를 극하는 오행입니다. 압박과 시련을 주지만 성장의 기회도 됩니다.'; relType = '나를 극(剋)';
    }

    ohengCompat.push({
      element: el, hanja: ohengHanja[i], emoji: ohengEmoji[i],
      score, relation, relType,
      isMe: el === dayElement,
      color: getElementColor(el)
    });
  });

  ohengCompat.sort((a, b) => b.score - a.score);
  const bestElement = ohengCompat[0];
  const worstElement = ohengCompat[ohengCompat.length - 1];

  return {
    myAnimal: animals[myBranch],
    myEmoji: emojis[myBranch],
    myElement: dayElement,
    myBranch,
    zodiacCompat,
    bestZodiac,
    worstZodiac,
    ohengCompat,
    bestElement,
    worstElement
  };
}

// Helper used by analyzeMyCompatibility
function getElementColor(el) {
  const colors = { '목':'#4ade80', '화':'#f87171', '토':'#fbbf24', '금':'#e5e7eb', '수':'#60a5fa' };
  return colors[el] || '#888';
}

// ============================================================
// 택일(擇日)
// ============================================================
export function getAuspiciousDates(dayStem, pillars, year, month, purpose) {
  const purposes = {
    'wedding': { name:'결혼', icon:'💍', good:[5,9,2], bad:[6,1], desc:'결혼·약혼에 좋은 날' },
    'moving': { name:'이사', icon:'🏠', good:[7,5,0], bad:[6,3], desc:'이사·입주에 좋은 날' },
    'business': { name:'개업', icon:'🏪', good:[4,5,7], bad:[6,1], desc:'개업·사업 시작에 좋은 날' },
    'interview': { name:'면접', icon:'💼', good:[7,9,2], bad:[6,1], desc:'면접·시험에 좋은 날' },
    'travel': { name:'여행', icon:'✈️', good:[2,4,0], bad:[6,8], desc:'여행·출장에 좋은 날' },
    'hospital': { name:'수술', icon:'🏥', good:[9,7,5], bad:[1,3], desc:'수술·치료에 좋은 날' },
    'contract': { name:'계약', icon:'📝', good:[5,7,4], bad:[1,6], desc:'계약·서류에 좋은 날' },
    'propose': { name:'고백', icon:'❤️', good:[5,2,9], bad:[6,3], desc:'고백·프로포즈에 좋은 날' }
  };

  const p = purposes[purpose] || purposes['wedding'];
  const dayBranch = pillars[2].branch;
  const daysInMonth = new Date(year, month, 0).getDate();
  const results = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const dp = getDayPillar(year, month, d);
    const sipsung = getSipsung(dayStem, dp.stem);
    const ship2 = SHIP2_TABLE[dayStem][dp.branch];
    const dateObj = new Date(year, month - 1, d);
    if (dateObj < new Date()) continue;

    let score = 50;
    if (p.good.includes(sipsung)) score += 20;
    if (p.bad.includes(sipsung)) score -= 15;
    if ([0,3,4].includes(ship2)) score += 10;
    if ([7,9].includes(ship2)) score -= 10;

    let hasHap = false, hasChung = false;
    YUKHAP.forEach(([a,b]) => { if ((dayBranch===a&&dp.branch===b)||(dayBranch===b&&dp.branch===a)) hasHap = true; });
    if (Math.abs(dayBranch - dp.branch) === 6) hasChung = true;
    if (hasHap) score += 12;
    if (hasChung) score -= 12;

    score = Math.max(20, Math.min(98, score));

    if (score >= 65) {
      results.push({
        day: d, weekday: ['일','월','화','수','목','금','토'][dateObj.getDay()],
        stem: dp.stem, branch: dp.branch, sipsung, ship2, score,
        hasHap, hasChung,
        grade: score >= 85 ? '대길' : score >= 75 ? '길' : '소길'
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return { purpose: p, results: results.slice(0, 10), year, month };
}
