// ============================================================
// Core Saju Calculation
// ============================================================
import { CHEONGAN, JIJI, JIJANGGAN, SIPSUNG_NAMES, SHIP2_TABLE } from '../data/pillarData.js';
import { JEOLGI_BASE } from '../data/jeolgiData.js';
import { lunarToSolar } from './lunar.js';
import { getJeolgiMonth } from './calendar.js';
import { getShinsal, getCheonelGwiin, getFullShinsal } from './shinsal.js';
import { analyzeYongsin, analyzeDayMasterStrength, getLifeRoadmap, detectPartialCombinations } from './advanced.js';
import { getDecadeFortuneFlow } from './fortune.js';

// 연주 계산 (입춘 기준)
export function getYearPillar(year, month, day) {
  let adjYear = year;
  // 입춘 전이면 전년도
  const ipchunMonth = 2, ipchunDay = 4;
  const yearMod = year % 4;
  let ipDay = ipchunDay;
  if (yearMod === 0) ipDay -= 1;

  if (month < ipchunMonth || (month === ipchunMonth && day < ipDay)) {
    adjYear = year - 1;
  }

  const stemIdx = (adjYear - 4) % 10;
  const branchIdx = (adjYear - 4) % 12;
  return { stem: ((stemIdx % 10) + 10) % 10, branch: ((branchIdx % 12) + 12) % 12 };
}

// 월주 계산
export function getMonthPillar(year, month, day) {
  const yearPillar = getYearPillar(year, month, day);
  const jm = getJeolgiMonth(year, month, day);

  // 월지: 인월(1)=2, 묘월(2)=3, ... , 축월(12)=1
  const branchIdx = (jm + 1) % 12;

  // 월간: 년간에 따른 월간 산출 (년간×2 + 월지수) % 10
  // 갑기년 → 병인월(丙寅月) 시작
  const yearStem = yearPillar.stem;
  const monthBase = [2, 4, 6, 8, 0][yearStem % 5]; // 갑기→병(2), 을경→무(4), 병신→경(6), 정임→임(8), 무계→갑(0)
  const stemIdx = (monthBase + jm - 1) % 10;

  return { stem: stemIdx, branch: branchIdx };
}

// 일주 계산 (기준일법)
export function getDayPillar(year, month, day) {
  const jd = julianDay(year, month, day);
  const base2000 = julianDay(2000, 1, 1);
  const diff = jd - base2000;
  const stemIdx = ((diff % 10) + 10) % 10; // 갑=0 기준
  const branchIdx = ((diff + 6) % 12 + 12) % 12; // 오=6 기준에서 보정
  // 2000.1.1이 갑오이므로: stem offset=0, branch offset=6
  // diff=0 → stem=0(갑), branch=6(오) ✓

  return { stem: stemIdx, branch: ((diff % 12 + 6) % 12 + 12) % 12 };
}

export function julianDay(y, m, d) {
  if (m <= 2) { y -= 1; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;
}

// 시주 계산
export function getHourPillar(dayStem, hour, minute) {
  let hourBranch;
  const totalMinutes = hour * 60 + (minute || 0);

  if (totalMinutes >= 1380 || totalMinutes < 60) hourBranch = 0;      // 자시 23:00~01:00
  else if (totalMinutes < 180) hourBranch = 1;  // 축시 01:00~03:00
  else if (totalMinutes < 300) hourBranch = 2;  // 인시 03:00~05:00
  else if (totalMinutes < 420) hourBranch = 3;  // 묘시 05:00~07:00
  else if (totalMinutes < 540) hourBranch = 4;  // 진시 07:00~09:00
  else if (totalMinutes < 660) hourBranch = 5;  // 사시 09:00~11:00
  else if (totalMinutes < 780) hourBranch = 6;  // 오시 11:00~13:00
  else if (totalMinutes < 900) hourBranch = 7;  // 미시 13:00~15:00
  else if (totalMinutes < 1020) hourBranch = 8; // 신시 15:00~17:00
  else if (totalMinutes < 1140) hourBranch = 9; // 유시 17:00~19:00
  else if (totalMinutes < 1260) hourBranch = 10;// 술시 19:00~21:00
  else hourBranch = 11;                          // 해시 21:00~23:00

  // 시간: 일간에 따른 시간 산출
  // 갑기일 → 갑자시 시작, 을경일 → 병자시 시작, ...
  const hourBase = [0, 2, 4, 6, 8][dayStem % 5];
  const hourStem = (hourBase + hourBranch) % 10;

  return { stem: hourStem, branch: hourBranch };
}

// 십성 계산 (일간 기준)
export function getSipsung(dayStem, targetStem) {
  const dayEl = Math.floor(dayStem / 2); // 오행 인덱스 (0=목,1=화,2=토,3=금,4=수)
  const targetEl = Math.floor(targetStem / 2);
  const dayYin = dayStem % 2;
  const targetYin = targetStem % 2;
  const sameYin = dayYin === targetYin;

  const diff = ((targetEl - dayEl) + 5) % 5;

  let baseIdx;
  if (diff === 0) baseIdx = 0; // 비겁
  else if (diff === 1) baseIdx = 2; // 식상 (내가 생)
  else if (diff === 2) baseIdx = 4; // 재성 (내가 극의 극 = 2칸)
  else if (diff === 3) baseIdx = 6; // 관성
  else baseIdx = 8; // 인성

  return baseIdx + (sameYin ? 0 : 1);
}

// 대운 계산
export function getDaeun(yearStem, yearBranch, monthStem, monthBranch, gender, year, month, day) {
  const yearYin = CHEONGAN[yearStem].yin;
  const isMale = gender === 'male';

  // 양남음녀 → 순행, 음남양녀 → 역행
  const forward = (isMale && !yearYin) || (!isMale && yearYin);

  // 대운수 계산 (생일에서 가까운 절기까지의 일수 / 3)
  const birthDate = new Date(year, month - 1, day);
  let targetDate;

  if (forward) {
    // 다음 절기 찾기
    for (let i = 0; i < 24; i++) {
      const jm = Math.floor(i / 2);
      const jIdx = i % 12;
      let testYear = year;
      if (month >= 11 && jIdx < 2) testYear = year + 1;

      const jBase = JEOLGI_BASE[jIdx];
      let jDay = jBase.baseDay;
      if (testYear % 4 === 0) jDay -= 1;
      const jDate = new Date(testYear, jBase.baseMon - 1, jDay);

      if (jDate > birthDate) {
        targetDate = jDate;
        break;
      }
    }
    if (!targetDate) targetDate = new Date(year + 1, 1, 4);
  } else {
    // 이전 절기 찾기
    for (let i = 23; i >= 0; i--) {
      const jIdx = i % 12;
      let testYear = year;
      if (month <= 2 && jIdx >= 10) testYear = year - 1;

      const jBase = JEOLGI_BASE[jIdx];
      let jDay = jBase.baseDay;
      if (testYear % 4 === 0) jDay -= 1;
      const jDate = new Date(testYear, jBase.baseMon - 1, jDay);

      if (jDate < birthDate) {
        targetDate = jDate;
        break;
      }
    }
    if (!targetDate) targetDate = new Date(year - 1, 11, 7);
  }

  const diffDays = Math.abs(Math.floor((birthDate - targetDate) / 86400000));
  const daeunAge = Math.round(diffDays / 3);

  // 대운 기둥 생성 (월주에서 순행/역행)
  const pillars = [];
  for (let i = 1; i <= 12; i++) {
    let stemI, branchI;
    if (forward) {
      stemI = (monthStem + i) % 10;
      branchI = (monthBranch + i) % 12;
    } else {
      stemI = ((monthStem - i) % 10 + 10) % 10;
      branchI = ((monthBranch - i) % 12 + 12) % 12;
    }
    pillars.push({
      stem: stemI,
      branch: branchI,
      startAge: daeunAge + (i - 1) * 10,
      endAge: daeunAge + i * 10 - 1
    });
  }

  return { startAge: daeunAge, forward, pillars };
}

// 종합 사주 계산
export function calculateSaju(year, month, day, hour, minute, gender, isLunar, isLeapMonth) {
  let solarYear = year, solarMonth = month, solarDay = day;

  if (isLunar) {
    const solar = lunarToSolar(year, month, day, isLeapMonth);
    solarYear = solar.year;
    solarMonth = solar.month;
    solarDay = solar.day;
  }

  const yearP = getYearPillar(solarYear, solarMonth, solarDay);
  const monthP = getMonthPillar(solarYear, solarMonth, solarDay);
  const dayP = getDayPillar(solarYear, solarMonth, solarDay);
  const hourP = getHourPillar(dayP.stem, hour, minute);

  const pillars = [yearP, monthP, dayP, hourP];

  // 오행 분석
  const elements = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  pillars.forEach(p => {
    elements[CHEONGAN[p.stem].element] += 1;
    elements[JIJI[p.branch].element] += 1;
  });

  // 지장간 포함 오행
  const detailedElements = { '목': 0, '화': 0, '토': 0, '금': 0, '수': 0 };
  pillars.forEach(p => {
    detailedElements[CHEONGAN[p.stem].element] += 1.5;
    const jjg = JIJANGGAN[p.branch];
    jjg.forEach(j => {
      detailedElements[CHEONGAN[j.s].element] += j.w / 10;
    });
  });

  // 십성
  const sipsung = pillars.map(p => ({
    stem: getSipsung(dayP.stem, p.stem),
    branch: JIJANGGAN[p.branch].map(j => getSipsung(dayP.stem, j.s))
  }));

  // 십이운성
  const ship2 = pillars.map(p => SHIP2_TABLE[dayP.stem][p.branch]);

  // 대운
  const daeun = getDaeun(yearP.stem, yearP.branch, monthP.stem, monthP.branch, gender, solarYear, solarMonth, solarDay);

  // 신살
  const shinsal = getShinsal(yearP.branch, monthP.branch, dayP.branch, hourP.branch);
  const chunel = getCheonelGwiin(dayP.stem, [yearP.branch, monthP.branch, dayP.branch, hourP.branch]);
  if (chunel) shinsal.push(chunel);

  // 세운 (올해 운세)
  const currentYear = new Date().getFullYear();
  const seunStem = ((currentYear - 4) % 10 + 10) % 10;
  const seunBranch = ((currentYear - 4) % 12 + 12) % 12;

  // === 신규 분석 ===
  // 용신 정밀 분석
  const yongsinAnalysis = analyzeYongsin(pillars, dayP.stem, detailedElements);

  // 일간 강약 분석
  const dayMasterStrength = analyzeDayMasterStrength(pillars, dayP.stem, detailedElements);

  // 확장 신살 (30+ 종류)
  const fullShinsal = getFullShinsal(yearP.branch, monthP.branch, dayP.branch, hourP.branch, dayP.stem, yearP.stem, monthP.stem);

  // 세운 10년 흐름
  const decadeFortune = getDecadeFortuneFlow(dayP.stem);

  // 인생 로드맵
  const lifeRoadmap = getLifeRoadmap(pillars, dayP.stem, daeun, gender);

  // 삼합 반합 감지
  const partialCombinations = detectPartialCombinations(pillars);

  return {
    pillars,
    elements,
    detailedElements,
    sipsung,
    ship2,
    daeun,
    shinsal,
    seun: { stem: seunStem, branch: seunBranch, year: currentYear },
    dayStem: dayP.stem,
    solarDate: { year: solarYear, month: solarMonth, day: solarDay },
    gender,
    // 신규 분석 결과
    yongsinAnalysis,
    dayMasterStrength,
    fullShinsal,
    decadeFortune,
    lifeRoadmap,
    partialCombinations
  };
}
