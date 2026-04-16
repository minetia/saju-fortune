// ============================================================
// Shinsal (Spirit Stars) Functions
// ============================================================
import { CHEONGAN, JIJI, JIJANGGAN } from '../data/pillarData.js';

// 신살 계산
export function getShinsal(yearBranch, monthBranch, dayBranch, hourBranch) {
  const result = [];

  // 도화살 (桃花殺)
  const doHwaGroups = [[2,6,10],[5,9,1],[8,0,4],[11,3,7]];
  const doHwaTargets = [3,6,9,0];
  doHwaGroups.forEach((group, i) => {
    if (group.includes(yearBranch) || group.includes(dayBranch)) {
      if ([monthBranch, dayBranch, hourBranch].includes(doHwaTargets[i])) {
        result.push({ name: '도화살', hanja: '桃花殺', desc: '매력적이고 예술적 감각이 뛰어나며 이성에게 인기가 많습니다. 연예, 예술, 서비스업에서 두각을 나타냅니다.', type: 'mixed' });
      }
    }
  });

  // 역마살 (驛馬殺)
  const yeokmaTargets = [8, 11, 2, 5];
  doHwaGroups.forEach((group, i) => {
    if (group.includes(yearBranch) || group.includes(dayBranch)) {
      if ([yearBranch, monthBranch, dayBranch, hourBranch].includes(yeokmaTargets[i])) {
        result.push({ name: '역마살', hanja: '驛馬殺', desc: '활동적이고 변화를 좋아하며 이동, 여행이 잦습니다. 무역, 외교, 운송업에 적합합니다.', type: 'mixed' });
      }
    }
  });

  // 화개살 (華蓋殺)
  const hwagaeTargets = [10, 1, 4, 7];
  doHwaGroups.forEach((group, i) => {
    if (group.includes(yearBranch) || group.includes(dayBranch)) {
      if ([yearBranch, monthBranch, dayBranch, hourBranch].includes(hwagaeTargets[i])) {
        result.push({ name: '화개살', hanja: '華蓋殺', desc: '학문과 종교, 예술에 뛰어난 재능이 있습니다. 영적 감수성이 강하고 고독을 즐기는 면이 있습니다.', type: 'good' });
      }
    }
  });

  // 귀문관살 (鬼門關殺)
  if ((dayBranch === 5 && hourBranch === 11) || (dayBranch === 11 && hourBranch === 5)) {
    result.push({ name: '귀문관살', hanja: '鬼門關殺', desc: '직감력과 영적 감수성이 매우 뛰어납니다. 심리학, 종교학 등 정신세계 분야에서 재능을 발휘합니다.', type: 'mixed' });
  }

  return result;
}

// 천을귀인 별도 함수
export function getCheonelGwiin(dayStem, branches) {
  const map = {
    0: [1,7], 1: [0,8], 2: [9,11], 3: [9,11], 4: [1,7],
    5: [0,8], 6: [7,1], 7: [6,2], 8: [3,5], 9: [3,5]
  };
  const targets = map[dayStem] || [];
  const found = branches.filter(b => targets.includes(b));
  if (found.length > 0) {
    return { name: '천을귀인', hanja: '天乙貴人', desc: '가장 큰 귀인성입니다. 어려울 때 도움을 주는 사람이 나타나며, 위기를 기회로 바꾸는 운이 있습니다.', type: 'good' };
  }
  return null;
}

// 확장 신살
export function getExtendedShinsal(yearBranch, monthBranch, dayBranch, hourBranch, dayStem, yearStem) {
  const result = [];
  const branches = [yearBranch, monthBranch, dayBranch, hourBranch];

  // 백호살
  const baekhoMap = { 0:6, 1:7, 2:8, 3:9, 4:10, 5:11, 6:0, 7:1, 8:2, 9:3, 10:4, 11:5 };
  if (branches.some(b => b === baekhoMap[dayBranch])) {
    result.push({ name:'백호살', hanja:'白虎殺', desc:'강한 에너지로 위기 상황에서 큰 힘을 발휘합니다. 수술, 사고 등에 주의가 필요하지만, 의료인이나 군인에게는 오히려 좋은 기운입니다.', type:'mixed' });
  }

  // 양인살
  const yanginMap = { 0:3, 1:2, 2:6, 3:5, 4:6, 5:5, 6:9, 7:8, 8:0, 9:11 };
  if (branches.includes(yanginMap[dayStem])) {
    result.push({ name:'양인살', hanja:'羊刃殺', desc:'강인한 결단력과 추진력을 상징합니다. 칼날처럼 날카로운 기운으로 군인, 외과의사, 운동선수에게 유리합니다.', type:'mixed' });
  }

  // 원진살
  const wonginMap = { 0:7, 1:6, 2:5, 3:4, 4:3, 5:2, 6:1, 7:0, 8:11, 9:10, 10:9, 11:8 };
  if (branches.some((b,i) => i !== 2 && b === wonginMap[dayBranch])) {
    result.push({ name:'원진살', hanja:'怨嗔殺', desc:'서로 만나면 반가우면서도 미워지는 기운입니다. 가까운 사이에서 갈등이 생기기 쉬우니 인내와 이해가 필요합니다.', type:'bad' });
  }

  // 겁살
  const geobsalTargets = [5,8,11,2];
  const doHwaGroups2 = [[2,6,10],[5,9,1],[8,0,4],[11,3,7]];
  doHwaGroups2.forEach((group, i) => {
    if (group.includes(dayBranch)) {
      if (branches.some(b => b === geobsalTargets[i])) {
        result.push({ name:'겁살', hanja:'劫殺', desc:'예상치 못한 재물 손실에 주의가 필요합니다. 그러나 위기를 기회로 바꾸는 돌파력도 가지고 있습니다.', type:'bad' });
      }
    }
  });

  // 문창귀인
  const munchangMap = { 0:5, 1:6, 2:8, 3:9, 4:8, 5:9, 6:11, 7:0, 8:2, 9:3 };
  if (branches.includes(munchangMap[dayStem])) {
    result.push({ name:'문창귀인', hanja:'文昌貴人', desc:'학문과 문장에 뛰어난 재능이 있습니다. 시험운이 좋고 글쓰기, 학업에서 좋은 성과를 거둡니다.', type:'good' });
  }

  // 천덕귀인
  const cheondeokMap = { 0:3, 1:8, 2:9, 3:0, 4:1, 5:6, 6:7, 7:2, 8:3, 9:4, 10:5, 11:0 };
  if (branches.includes(cheondeokMap[monthBranch])) {
    result.push({ name:'천덕귀인', hanja:'天德貴人', desc:'하늘의 은덕이 있어 위기에서도 구원을 받습니다. 사고나 질병을 피해가며 자연스럽게 좋은 결과를 얻습니다.', type:'good' });
  }

  // 월덕귀인
  const woldeokMap = { 0:2, 1:6, 2:0, 3:4, 4:2, 5:6, 6:0, 7:4, 8:2, 9:6, 10:0, 11:4 };
  if ([yearStem, dayStem].includes(woldeokMap[monthBranch])) {
    result.push({ name:'월덕귀인', hanja:'月德貴人', desc:'달의 은덕이 있어 주변으로부터 도움을 많이 받습니다. 성품이 온화하여 많은 사람에게 사랑받습니다.', type:'good' });
  }

  // 학당귀인
  const hakdangMap = { 0:11, 1:6, 2:2, 3:9, 4:2, 5:9, 6:5, 7:0, 8:8, 9:3 };
  if (branches.includes(hakdangMap[dayStem])) {
    result.push({ name:'학당귀인', hanja:'學堂貴人', desc:'학문의 전당에 있는 기운으로, 공부를 하면 뛰어난 성과를 거둡니다. 학업, 자격증, 연구에 유리합니다.', type:'good' });
  }

  return result;
}

// 확장 신살 (총 30+ 종류)
export function getFullShinsal(yearBranch, monthBranch, dayBranch, hourBranch, dayStem, yearStem, monthStem) {
  const result = [];
  const branches = [yearBranch, monthBranch, dayBranch, hourBranch];
  const doHwaGroups = [[2,6,10],[5,9,1],[8,0,4],[11,3,7]];

  // === 기존 신살 ===
  // 도화살
  const doHwaTargets = [3,6,9,0];
  doHwaGroups.forEach((group, i) => {
    if (group.includes(yearBranch) || group.includes(dayBranch)) {
      if ([monthBranch, dayBranch, hourBranch].includes(doHwaTargets[i])) {
        result.push({ name:'도화살', hanja:'桃花殺', desc:'매력과 예술적 감각이 뛰어나며 이성에게 인기가 많습니다. 연예, 예술, 서비스업에서 두각을 나타냅니다.', type:'mixed', category:'살' });
      }
    }
  });

  // 역마살
  const yeokmaTargets = [8,11,2,5];
  doHwaGroups.forEach((group, i) => {
    if (group.includes(yearBranch) || group.includes(dayBranch)) {
      if (branches.includes(yeokmaTargets[i])) {
        result.push({ name:'역마살', hanja:'驛馬殺', desc:'활동적이고 변화를 좋아하며 이동·여행이 잦습니다. 무역, 외교, 물류업에 적합합니다.', type:'mixed', category:'살' });
      }
    }
  });

  // 화개살
  const hwagaeTargets = [10,1,4,7];
  doHwaGroups.forEach((group, i) => {
    if (group.includes(yearBranch) || group.includes(dayBranch)) {
      if (branches.includes(hwagaeTargets[i])) {
        result.push({ name:'화개살', hanja:'華蓋殺', desc:'학문·종교·예술에 뛰어난 재능이 있습니다. 영적 감수성이 강하고 깊은 사유를 즐깁니다.', type:'good', category:'살' });
      }
    }
  });

  // 천을귀인
  const chunelMap = { 0:[1,7], 1:[0,8], 2:[9,11], 3:[9,11], 4:[1,7], 5:[0,8], 6:[7,1], 7:[6,2], 8:[3,5], 9:[3,5] };
  if (branches.some(b => (chunelMap[dayStem]||[]).includes(b))) {
    result.push({ name:'천을귀인', hanja:'天乙貴人', desc:'가장 큰 귀인성입니다. 어려울 때 도움이 나타나며 위기를 기회로 바꾸는 운이 있습니다.', type:'good', category:'귀인' });
  }

  // 귀문관살
  if ((dayBranch === 5 && hourBranch === 11) || (dayBranch === 11 && hourBranch === 5) ||
      (dayBranch === 2 && hourBranch === 7) || (dayBranch === 7 && hourBranch === 2)) {
    result.push({ name:'귀문관살', hanja:'鬼門關殺', desc:'직감력과 영적 감수성이 매우 뛰어납니다. 심리학, 종교학 등 정신세계 분야에서 재능을 발휘합니다.', type:'mixed', category:'살' });
  }

  // === 확장 신살 ===
  // 백호살
  const baekhoMap = {0:6,1:7,2:8,3:9,4:10,5:11,6:0,7:1,8:2,9:3,10:4,11:5};
  if (branches.some(b => b === baekhoMap[dayBranch])) {
    result.push({ name:'백호살', hanja:'白虎殺', desc:'강한 에너지로 위기 상황에서 큰 힘을 발휘합니다. 의료인이나 군인에게는 오히려 좋은 기운입니다. 수술·사고에 주의하세요.', type:'mixed', category:'살' });
  }

  // 양인살
  const yanginMap = {0:3,1:2,2:6,3:5,4:6,5:5,6:9,7:8,8:0,9:11};
  if (branches.includes(yanginMap[dayStem])) {
    result.push({ name:'양인살', hanja:'羊刃殺', desc:'강인한 결단력과 추진력을 상징합니다. 칼날처럼 날카로운 기운으로 군인, 외과의사, 운동선수에게 유리합니다.', type:'mixed', category:'살' });
  }

  // 원진살
  const wonginMap = {0:7,1:6,2:5,3:4,4:3,5:2,6:1,7:0,8:11,9:10,10:9,11:8};
  if (branches.some((b,i) => i !== 2 && b === wonginMap[dayBranch])) {
    result.push({ name:'원진살', hanja:'怨嗔殺', desc:'가까운 사이에서 만나면 반가우면서도 미워지는 기운입니다. 인내와 이해가 필요합니다.', type:'bad', category:'살' });
  }

  // 겁살
  const geobsalTargets = [5,8,11,2];
  doHwaGroups.forEach((group, i) => {
    if (group.includes(dayBranch)) {
      if (branches.some(b => b === geobsalTargets[i])) {
        result.push({ name:'겁살', hanja:'劫殺', desc:'예상치 못한 재물 손실에 주의가 필요합니다. 그러나 위기를 기회로 바꾸는 돌파력도 가집니다.', type:'bad', category:'살' });
      }
    }
  });

  // 문창귀인
  const munchangMap = {0:5,1:6,2:8,3:9,4:8,5:9,6:11,7:0,8:2,9:3};
  if (branches.includes(munchangMap[dayStem])) {
    result.push({ name:'문창귀인', hanja:'文昌貴人', desc:'학문과 문장에 뛰어난 재능이 있습니다. 시험운이 좋고 글쓰기·학업에서 좋은 성과를 거둡니다.', type:'good', category:'귀인' });
  }

  // 천덕귀인
  const cheondeokMap = {0:3,1:8,2:9,3:0,4:1,5:6,6:7,7:2,8:3,9:4,10:5,11:0};
  if (branches.includes(cheondeokMap[monthBranch])) {
    result.push({ name:'천덕귀인', hanja:'天德貴人', desc:'하늘의 은덕이 있어 위기에서도 구원을 받습니다. 자연스럽게 좋은 결과를 얻습니다.', type:'good', category:'귀인' });
  }

  // 월덕귀인
  const woldeokMap = {0:2,1:6,2:0,3:4,4:2,5:6,6:0,7:4,8:2,9:6,10:0,11:4};
  if ([yearStem, dayStem].includes(woldeokMap[monthBranch])) {
    result.push({ name:'월덕귀인', hanja:'月德貴人', desc:'달의 은덕이 있어 주변으로부터 도움을 많이 받습니다. 성품이 온화하여 사랑받습니다.', type:'good', category:'귀인' });
  }

  // 학당귀인
  const hakdangMap = {0:11,1:6,2:2,3:9,4:2,5:9,6:5,7:0,8:8,9:3};
  if (branches.includes(hakdangMap[dayStem])) {
    result.push({ name:'학당귀인', hanja:'學堂貴人', desc:'학문의 전당에 있는 기운으로 공부·자격증·연구에서 뛰어난 성과를 거둡니다.', type:'good', category:'귀인' });
  }

  // 금여록
  const geumyeoMap = {0:4,1:5,2:7,3:8,4:7,5:8,6:10,7:11,8:1,9:2};
  if (branches.includes(geumyeoMap[dayStem])) {
    result.push({ name:'금여록', hanja:'金輿祿', desc:'금으로 만든 수레를 탄 격으로, 배우자 복이 좋고 물질적으로 풍요로운 삶을 누립니다.', type:'good', category:'귀인' });
  }

  // 복성귀인
  const bokseongMap = {0:2,1:3,2:5,3:6,4:5,5:6,6:8,7:9,8:11,9:0};
  if (branches.includes(bokseongMap[dayStem])) {
    result.push({ name:'복성귀인', hanja:'福星貴人', desc:'복의 별이 비추어 의식주가 풍족하고 평생 큰 고난 없이 지냅니다.', type:'good', category:'귀인' });
  }

  // 천주귀인
  const cheonjuMap = {0:5,1:6,2:5,3:8,4:5,5:6,6:11,7:0,8:5,9:6};
  if (branches.includes(cheonjuMap[dayStem])) {
    result.push({ name:'천주귀인', hanja:'天廚貴人', desc:'하늘의 주방을 가진 격으로, 먹을 복이 크고 식도락을 즐기며 요식업에 재능이 있습니다.', type:'good', category:'귀인' });
  }

  // 반안살
  const bananMap = {0:3,1:2,2:5,3:4,4:7,5:6,6:9,7:8,8:11,9:10,10:1,11:0};
  if (branches.includes(bananMap[dayBranch])) {
    result.push({ name:'반안살', hanja:'攀鞍殺', desc:'안장에 오르는 격으로, 타인으로부터 인정을 받고 사회적 지위가 높아지는 기운입니다.', type:'good', category:'살' });
  }

  // 천라지망
  if (branches.includes(4) && branches.includes(10)) {
    result.push({ name:'천라지망', hanja:'天羅地網', desc:'하늘과 땅의 그물에 걸린 격입니다. 구속이나 속박감이 있을 수 있으나, 끈질긴 인내력으로 결국 벗어납니다.', type:'bad', category:'살' });
  }
  if (branches.includes(5) && branches.includes(11)) {
    result.push({ name:'천라지망', hanja:'天羅地網', desc:'하늘과 땅의 그물에 걸린 격입니다. 법적 문제나 구설에 주의하되, 정의로운 일에는 강한 힘을 발휘합니다.', type:'bad', category:'살' });
  }

  // 혈인살
  const hyeorinMap = {0:9,1:6,2:3,3:0,4:9,5:6,6:3,7:0,8:9,9:6,10:3,11:0};
  if (branches.includes(hyeorinMap[dayBranch])) {
    result.push({ name:'혈인살', hanja:'血刃殺', desc:'피와 관련된 기운으로 수술이나 출혈에 주의가 필요합니다. 의료인에게는 오히려 유리합니다.', type:'mixed', category:'살' });
  }

  // 고란살
  const goranPairs = [[0,2],[1,5],[2,0],[3,3],[4,2],[5,5],[6,8],[7,11],[8,8],[9,11]];
  if (goranPairs.some(([s,b]) => dayStem === s && dayBranch === b)) {
    result.push({ name:'고란살', hanja:'孤鸞殺', desc:'고독한 난새의 격으로, 배우자와의 인연이 늦거나 독립적인 삶을 추구합니다. 예술적 재능이 뛰어납니다.', type:'mixed', category:'살' });
  }

  // 괴강살
  const goegang = [[6,4],[6,10],[8,4],[8,10]];
  if (goegang.some(([s,b]) => dayStem === s && dayBranch === b)) {
    result.push({ name:'괴강살', hanja:'魁罡殺', desc:'북두칠성의 머리와 꼬리에 해당하는 강력한 기운입니다. 리더십과 카리스마가 뛰어나며 결단력이 강합니다.', type:'mixed', category:'살' });
  }

  // 장성살
  const jangsungTargets = [6,9,0,3];
  doHwaGroups.forEach((group, i) => {
    if (group.includes(yearBranch) || group.includes(dayBranch)) {
      if (branches.includes(jangsungTargets[i])) {
        result.push({ name:'장성살', hanja:'將星殺', desc:'장군의 별로 리더십이 탁월하고 조직을 이끄는 능력이 있습니다. 군인, 경찰, CEO에게 유리합니다.', type:'good', category:'살' });
      }
    }
  });

  // 암록
  const geonrokBranch2 = [2,3,5,6,4,5,8,9,11,0];
  let hasAmrok = false;
  branches.forEach((br, idx) => {
    if (hasAmrok) return;
    const jjg = JIJANGGAN[br];
    jjg.forEach(j => {
      if (!hasAmrok && j.s === dayStem && br !== geonrokBranch2[dayStem]) {
        result.push({ name:'암록', hanja:'暗祿', desc:'숨겨진 녹봉이 있어 예상치 못한 재물이나 도움이 옵니다. 보이지 않는 곳에서 복이 들어옵니다.', type:'good', category:'귀인' });
        hasAmrok = true;
      }
    });
  });

  // 중복 제거
  const seen = new Set();
  return result.filter(item => {
    if (seen.has(item.name)) return false;
    seen.add(item.name);
    return true;
  });
}
