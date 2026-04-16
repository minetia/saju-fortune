// ============================================================
// Analysis Functions (Relations, Gyeokguk, Gongmang, Napeum, Compatibility, Interpretation)
// ============================================================
import { CHEONGAN, JIJI, JIJANGGAN, OHENG_ORDER } from '../data/pillarData.js';
import {
  YUKHAP, YUKHAP_RESULT, SAMHAP, BANGHAP,
  JIJI_CHUNG, JIJI_HYUNG, JIJI_PA, JIJI_HAE,
  CHUNGAN_HAP, CHUNGAN_CHUNG
} from '../data/relationsData.js';
import {
  GYEOKGUK_DESC, NAPEUM_DATA, NAPEUM_DESC,
  ILGAN_PERSONALITY, SIPSUNG_DESC, SHIP2_DESC
} from '../data/interpretationData.js';
import { getSipsung } from './calculator.js';

// ============================================================
// 합충형파해(合沖刑破害) 분석
// ============================================================
export function analyzeRelations(pillars) {
  const relations = [];
  const pillarNames = ['년주','월주','일주','시주'];
  const stems = pillars.map(p => p.stem);
  const branches = pillars.map(p => p.branch);

  // 천간합 분석
  for (let i = 0; i < 4; i++) {
    for (let j = i+1; j < 4; j++) {
      CHUNGAN_HAP.forEach(h => {
        if ((stems[i] === h.pair[0] && stems[j] === h.pair[1]) ||
            (stems[i] === h.pair[1] && stems[j] === h.pair[0])) {
          relations.push({
            type: '천간합', color: '#4ade80',
            from: i, to: j, pos: 'stem',
            name: h.name,
            desc: `${pillarNames[i]}와 ${pillarNames[j]}의 천간이 합(${h.name})을 이룹니다. 두 기운이 조화롭게 결합하여 ${h.result}의 기운이 생겨납니다.`
          });
        }
      });
      // 천간충
      CHUNGAN_CHUNG.forEach(([a,b]) => {
        if ((stems[i] === a && stems[j] === b) || (stems[i] === b && stems[j] === a)) {
          relations.push({
            type: '천간충', color: '#f87171',
            from: i, to: j, pos: 'stem',
            name: `${CHEONGAN[stems[i]].name}${CHEONGAN[stems[j]].name}충`,
            desc: `${pillarNames[i]}와 ${pillarNames[j]}의 천간이 충(沖)합니다. 갈등과 변화의 기운이 있으나, 이를 통해 발전할 수 있습니다.`
          });
        }
      });
    }
  }

  // 지지 육합
  for (let i = 0; i < 4; i++) {
    for (let j = i+1; j < 4; j++) {
      YUKHAP.forEach(([a,b], idx) => {
        if ((branches[i] === a && branches[j] === b) || (branches[i] === b && branches[j] === a)) {
          relations.push({
            type: '육합', color: '#4ade80',
            from: i, to: j, pos: 'branch',
            name: `${JIJI[branches[i]].name}${JIJI[branches[j]].name} 육합`,
            desc: `${pillarNames[i]}와 ${pillarNames[j]}의 지지가 육합(六合)입니다. 서로 끌리는 조화로운 관계로 좋은 인연을 의미합니다.`
          });
        }
      });
      // 지지 충
      JIJI_CHUNG.forEach(([a,b]) => {
        if ((branches[i] === a && branches[j] === b) || (branches[i] === b && branches[j] === a)) {
          relations.push({
            type: '충', color: '#f87171',
            from: i, to: j, pos: 'branch',
            name: `${JIJI[branches[i]].name}${JIJI[branches[j]].name}충`,
            desc: `${pillarNames[i]}와 ${pillarNames[j]}의 지지가 충(沖)합니다. 변동과 갈등이 있을 수 있으나, 활동적 에너지로 활용 가능합니다.`
          });
        }
      });
      // 지지 파
      JIJI_PA.forEach(([a,b]) => {
        if ((branches[i] === a && branches[j] === b) || (branches[i] === b && branches[j] === a)) {
          relations.push({
            type: '파', color: '#a78bfa',
            from: i, to: j, pos: 'branch',
            name: `${JIJI[branches[i]].name}${JIJI[branches[j]].name}파`,
            desc: `${pillarNames[i]}와 ${pillarNames[j]}의 지지가 파(破)입니다. 기존 관계나 상황에 균열이 생길 수 있습니다.`
          });
        }
      });
      // 지지 해
      JIJI_HAE.forEach(([a,b]) => {
        if ((branches[i] === a && branches[j] === b) || (branches[i] === b && branches[j] === a)) {
          relations.push({
            type: '해', color: '#fb923c',
            from: i, to: j, pos: 'branch',
            name: `${JIJI[branches[i]].name}${JIJI[branches[j]].name}해`,
            desc: `${pillarNames[i]}와 ${pillarNames[j]}의 지지가 해(害)입니다. 은밀한 방해나 시기가 있을 수 있으니 대인관계에 주의하세요.`
          });
        }
      });
    }
  }

  // 지지 형 - 무례지형 (자묘)
  for (let i = 0; i < 4; i++) {
    for (let j = i+1; j < 4; j++) {
      JIJI_HYUNG.murye.forEach(([a,b]) => {
        if ((branches[i] === a && branches[j] === b) || (branches[i] === b && branches[j] === a)) {
          relations.push({
            type: '형', color: '#f59e0b',
            from: i, to: j, pos: 'branch',
            name: '자묘형(무례지형)',
            desc: `${pillarNames[i]}와 ${pillarNames[j]}의 지지가 형(刑)입니다. 예의와 관계에서 갈등이 생길 수 있으나 자기 성찰의 기회가 됩니다.`
          });
        }
      });
    }
  }

  // 삼합 체크
  SAMHAP.forEach(sh => {
    const found = [];
    branches.forEach((b, idx) => { if (sh.branches.includes(b)) found.push(idx); });
    if (found.length >= 3) {
      relations.push({
        type: '삼합', color: '#22d3ee',
        from: found[0], to: found[found.length-1], pos: 'branch',
        name: sh.name,
        desc: `사주에 ${sh.name}이 형성되었습니다. ${sh.element}의 기운이 강력하게 뭉쳐 큰 힘을 발휘합니다.`
      });
    }
  });

  // 방합 체크
  BANGHAP.forEach(bh => {
    const found = [];
    branches.forEach((b, idx) => { if (bh.branches.includes(b)) found.push(idx); });
    if (found.length >= 3) {
      relations.push({
        type: '방합', color: '#06b6d4',
        from: found[0], to: found[found.length-1], pos: 'branch',
        name: bh.name,
        desc: `사주에 ${bh.name}이 형성되었습니다. ${bh.element}의 계절적 기운이 한 방향으로 강하게 모입니다.`
      });
    }
  });

  return relations;
}

// ============================================================
// 격국(格局) 판별
// ============================================================
export function determineGyeokguk(pillars, dayStem) {
  const monthBranch = pillars[1].branch;
  const jjg = JIJANGGAN[monthBranch];
  const dayElement = Math.floor(dayStem / 2);

  // 월지 장간 중 가장 비중 높은 것의 십성으로 격국 판단
  let mainJjg = jjg[jjg.length - 1]; // 본기(가장 마지막)
  const mainSipsung = getSipsung(dayStem, mainJjg.s);

  // 건록격 체크: 월지가 일간의 건록지인 경우
  const geonrokBranch = [2,3,5,6,4,5,8,9,11,0]; // 갑→인, 을→묘, ...
  if (monthBranch === geonrokBranch[dayStem]) {
    return { name: '건록격', ...GYEOKGUK_DESC['건록격'] };
  }

  // 양인격 체크: 월지가 일간의 양인지인 경우
  const yanginBranch = [3,2,6,5,6,5,9,8,0,11]; // 갑→묘, 을→인, ...
  if (monthBranch === yanginBranch[dayStem] && dayStem % 2 === 0) {
    return { name: '양인격', ...GYEOKGUK_DESC['양인격'] };
  }

  // 정격 8격
  const gyeokNames = ['비견','겁재','식신격','상관격','편재격','정재격','편관격','정관격','편인격','정인격'];
  const ssName = gyeokNames[mainSipsung];

  if (ssName && GYEOKGUK_DESC[ssName]) {
    return { name: ssName, ...GYEOKGUK_DESC[ssName] };
  }

  // 기본 격국
  const defaultNames = {
    0: '비견격', 1: '겁재격', 2: '식신격', 3: '상관격', 4: '편재격',
    5: '정재격', 6: '편관격', 7: '정관격', 8: '편인격', 9: '정인격'
  };
  const defaultName = defaultNames[mainSipsung] || '정관격';
  return { name: defaultName, ...(GYEOKGUK_DESC[defaultName] || GYEOKGUK_DESC['정관격']) };
}

// ============================================================
// 공망(空亡) 계산
// ============================================================
export function calculateGongmang(dayStem, dayBranch) {
  const sexagenaryCycle = (dayStem + (dayBranch - dayStem + 120) % 12) % 60;
  const stemInCycle = dayStem;
  const startBranch = (dayBranch - stemInCycle + 12) % 12;

  const gongmangMap = {
    0: [10,11],  // 갑자순 → 술해 공망
    10: [8,9],   // 갑술순 → 신유 공망
    8: [6,7],    // 갑신순 → 오미 공망
    6: [4,5],    // 갑오순 → 진사 공망
    4: [2,3],    // 갑진순 → 인묘 공망
    2: [0,1]     // 갑인순 → 자축 공망
  };

  return gongmangMap[startBranch] || [10,11];
}

export function getGongmangDesc(gongmangBranches, pillars) {
  const results = [];
  const pillarNames = ['년지','월지','일지','시지'];

  pillars.forEach((p, i) => {
    if (gongmangBranches.includes(p.branch)) {
      results.push({
        pillar: pillarNames[i],
        branch: JIJI[p.branch].name,
        desc: getGongmangMeaning(i)
      });
    }
  });

  return results;
}

export function getGongmangMeaning(pillarIdx) {
  const meanings = [
    '년지 공망: 조상이나 윗사람의 도움이 약할 수 있으나, 자수성가의 기운이 있습니다. 어린 시절 독립심이 강합니다.',
    '월지 공망: 부모나 형제의 인연이 다소 약할 수 있습니다. 하지만 사회에서 독자적으로 성취하는 힘이 있습니다.',
    '일지 공망: 배우자궁에 공망이 있어 배우자와의 인연에 변화가 있을 수 있습니다. 정신적 성장에 유리합니다.',
    '시지 공망: 자녀나 말년과 관련된 부분에서 예상과 다른 전개가 있을 수 있습니다. 정신적 풍요로움을 추구합니다.'
  ];
  return meanings[pillarIdx] || '';
}

// ============================================================
// 납음오행(納音五行)
// ============================================================
export function getNapeum(stem, branch) {
  const idx = (stem % 10) + (branch % 12);
  // 60갑자 인덱스 계산
  const sexagenary = ((stem % 10) * 6 + Math.floor(((branch - stem) % 12 + 12) % 12 / 2)) % 30;
  const napIdx = (stem + branch * 5) % 30;
  // 간단한 매핑: 천간지지 조합으로 60갑자 순서 계산
  const ganjiIdx = getSexagenaryIdx(stem, branch);
  if (ganjiIdx >= 0 && ganjiIdx < 60) {
    return NAPEUM_DATA[ganjiIdx];
  }
  return NAPEUM_DATA[0];
}

export function getSexagenaryIdx(stem, branch) {
  // 60갑자 인덱스: stem과 branch의 조합
  for (let i = 0; i < 60; i++) {
    if (i % 10 === stem && i % 12 === branch) return i;
  }
  return 0;
}

// ============================================================
// 궁합 분석
// ============================================================
export function analyzeCompatibility(saju1, saju2) {
  let score = 50;
  const analysis = [];

  // 일간 궁합 (오행 상생/상극)
  const el1 = CHEONGAN[saju1.dayStem].element;
  const el2 = CHEONGAN[saju2.dayStem].element;
  const SAENG = { '목': '화', '화': '토', '토': '금', '금': '수', '수': '목' };
  const GEUK = { '목': '토', '화': '금', '토': '수', '금': '목', '수': '화' };

  if (SAENG[el1] === el2 || SAENG[el2] === el1) {
    score += 15;
    analysis.push('두 분의 일간이 상생(相生) 관계로, 서로에게 긍정적 에너지를 줍니다.');
  } else if (GEUK[el1] === el2 || GEUK[el2] === el1) {
    score -= 10;
    analysis.push('두 분의 일간이 상극(相剋) 관계이지만, 이는 서로를 단련시키는 관계가 될 수 있습니다.');
  } else if (el1 === el2) {
    score += 5;
    analysis.push('두 분의 일간이 같은 오행으로, 비슷한 성향을 가져 이해가 쉽습니다.');
  }

  // 지지 합충
  const branches1 = saju1.pillars.map(p => p.branch);
  const branches2 = saju2.pillars.map(p => p.branch);

  // 육합 체크
  const yukHap = [[0,1],[2,11],[3,10],[4,9],[5,8],[6,7]];
  let hapCount = 0;
  branches1.forEach(b1 => {
    branches2.forEach(b2 => {
      if (yukHap.some(([a, c]) => (a === b1 && c === b2) || (a === b2 && c === b1))) {
        hapCount++;
      }
    });
  });
  if (hapCount > 0) {
    score += hapCount * 8;
    analysis.push(`지지에서 ${hapCount}개의 육합(六合)이 발견됩니다. 서로 끌리는 인연이 강합니다.`);
  }

  // 충 체크
  let chungCount = 0;
  branches1.forEach(b1 => {
    branches2.forEach(b2 => {
      if (Math.abs(b1 - b2) === 6 || Math.abs(b1 - b2) === 6) {
        chungCount++;
      }
    });
  });
  if (chungCount > 0) {
    score -= chungCount * 5;
    analysis.push(`지지에서 ${chungCount}개의 충(沖)이 발견됩니다. 갈등이 있을 수 있으나 서로 이해하려는 노력이 중요합니다.`);
  }

  // 오행 보완
  const el1Arr = Object.entries(saju1.detailedElements);
  const el2Arr = Object.entries(saju2.detailedElements);
  let complement = 0;
  el1Arr.forEach(([el, val]) => {
    const other = saju2.detailedElements[el];
    if ((val < 1 && other > 2) || (val > 3 && other < 1)) complement++;
  });
  if (complement > 0) {
    score += complement * 5;
    analysis.push('서로의 부족한 오행을 보완해주는 좋은 조합입니다.');
  }

  score = Math.max(20, Math.min(98, score));

  let grade;
  if (score >= 85) grade = '천생연분';
  else if (score >= 70) grade = '좋은 인연';
  else if (score >= 55) grade = '보통';
  else if (score >= 40) grade = '노력 필요';
  else grade = '주의 필요';

  return { score, grade, analysis };
}

// ============================================================
// 종합 해석 생성
// ============================================================
export function generateInterpretation(result) {
  const dayStem = result.dayStem;
  const personality = ILGAN_PERSONALITY[dayStem];
  const elements = result.detailedElements;

  // 강약 판단
  const dayElement = CHEONGAN[dayStem].element;
  let myStrength = elements[dayElement];
  let totalEl = Object.values(elements).reduce((a, b) => a + b, 0);
  const ratio = myStrength / totalEl;
  const isStrong = ratio > 0.25;

  // 오행 과다/부족
  const avgEl = totalEl / 5;
  const excessive = Object.entries(elements).filter(([k, v]) => v > avgEl * 1.5).map(([k]) => k);
  const lacking = Object.entries(elements).filter(([k, v]) => v < avgEl * 0.5).map(([k]) => k);

  // 용신 추천 (간략화)
  const SANG_SAENG = { '목': '화', '화': '토', '토': '금', '금': '수', '수': '목' };
  const SANG_GEUK = { '목': '토', '화': '금', '토': '수', '금': '목', '수': '화' };
  const MY_GEUK = { '목': '금', '화': '수', '토': '목', '금': '화', '수': '토' };

  let yongsin = '';
  if (isStrong) {
    yongsin = SANG_SAENG[dayElement]; // 신강하면 설기하는 오행
  } else {
    yongsin = dayElement; // 신약하면 자신의 오행 보충
  }

  let interpretation = `## ${personality.title}\n\n${personality.desc}\n\n`;
  interpretation += `### 사주 강약 분석\n`;
  interpretation += isStrong
    ? `일간의 기운이 비교적 강한 '신강(身强)' 사주입니다. 자기 주장이 뚜렷하고 추진력이 있습니다. 재성(재물)과 관성(사회적 지위)으로 에너지를 쓰는 것이 좋습니다.`
    : `일간의 기운이 비교적 약한 '신약(身弱)' 사주입니다. 인성(학문, 자격)과 비겁(도움, 협력)의 기운이 도움이 됩니다. 무리한 도전보다 준비를 철저히 하는 것이 중요합니다.`;

  interpretation += `\n\n### 용신(用神)\n`;
  interpretation += `이 사주의 용신은 '${yongsin}(${OHENG_ORDER.indexOf(yongsin) >= 0 ? ['木','火','土','金','水'][OHENG_ORDER.indexOf(yongsin)] : ''})'입니다. ${yongsin} 기운이 강해지는 계절, 방향, 색상을 활용하면 운이 좋아집니다.`;

  if (excessive.length > 0) {
    interpretation += `\n\n### 오행 과다\n${excessive.join(', ')} 기운이 과다합니다. `;
    excessive.forEach(el => {
      if (el === '목') interpretation += '자기 주장이 지나치게 강할 수 있으니 유연성을 기르세요. ';
      if (el === '화') interpretation += '급한 성격을 다스리고 인내심을 길러야 합니다. ';
      if (el === '토') interpretation += '걱정이 많을 수 있으니 행동으로 옮기는 습관을 들이세요. ';
      if (el === '금') interpretation += '지나친 완벽주의를 버리고 타협을 배우세요. ';
      if (el === '수') interpretation += '생각이 많아 우유부단해질 수 있으니 결단력을 기르세요. ';
    });
  }

  if (lacking.length > 0) {
    interpretation += `\n\n### 오행 부족\n${lacking.join(', ')} 기운이 부족합니다. `;
    lacking.forEach(el => {
      if (el === '목') interpretation += '초록색 옷이나 동쪽 방향이 도움이 됩니다. 나무와 관련된 환경이 좋습니다. ';
      if (el === '화') interpretation += '붉은색이나 남쪽 방향이 도움이 됩니다. 적극적인 활동이 필요합니다. ';
      if (el === '토') interpretation += '노란색이나 중앙이 도움이 됩니다. 안정적인 기반을 다지세요. ';
      if (el === '금') interpretation += '흰색이나 서쪽 방향이 도움이 됩니다. 결단력을 키우세요. ';
      if (el === '수') interpretation += '검정/파란색이나 북쪽 방향이 도움이 됩니다. 유연한 사고를 기르세요. ';
    });
  }

  return interpretation;
}
