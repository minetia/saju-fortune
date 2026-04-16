// ============================================================
// Jeolgi and Date Functions
// ============================================================
import { JEOLGI_BASE } from '../data/jeolgiData.js';

// 절기 날짜 계산 (근사값 - 년도별 미세 조정)
export function getJeolgiDate(year, idx) {
  const j = JEOLGI_BASE[idx];
  let y = year;
  let m = j.baseMon;
  let d = j.baseDay;

  // 년도별 보정 (4년 주기 윤년 보정)
  const yearMod = year % 4;
  if (yearMod === 0) d -= 1;
  if (yearMod === 1) d += 0;
  if (yearMod === 2) d += 0;
  if (yearMod === 3) d += 0;

  // 세기별 보정
  const century = Math.floor(year / 100);
  if (century >= 20) d += Math.floor((year - 2000) / 100);

  if (idx === 11 && m === 1) y = year + 1; // 소한은 다음해 1월

  return new Date(y, m - 1, d);
}

// 주어진 양력 날짜의 절기월 구하기 (인월=1, 묘월=2, ...)
export function getJeolgiMonth(year, month, day) {
  const date = new Date(year, month - 1, day);

  // 소한(12월 절기)은 이전해 12월~올해 1월
  // 입춘(1월 절기)부터 시작

  for (let i = 11; i >= 0; i--) {
    let jYear = year;
    if (i === 11) { // 소한은 당해 1월
      // 소한 체크
      const sohan = new Date(year, 0, 6);
      if (date >= sohan) {
        // 입춘 전인지 확인
        const ipchun = new Date(year, 1, 4);
        if (date < ipchun) return 12; // 축월
      }
      // 전년도 소한 ~ 올해 소한 사이
      continue;
    }

    const jBase = JEOLGI_BASE[i];
    let jMonth = jBase.baseMon;
    let jDay = jBase.baseDay;

    const yearMod = year % 4;
    if (yearMod === 0) jDay -= 1;

    const jeolgiDate = new Date(year, jMonth - 1, jDay);

    if (date >= jeolgiDate) {
      return (i + 1); // 절기월 (인월=1 → 지지 인=2)
    }
  }

  // 입춘 이전이면 전년도 12월(축월)
  return 12;
}

export function getDayOfYear(year, month, day) {
  const date = new Date(year, month - 1, day);
  const start = new Date(year, 0, 0);
  return Math.floor((date - start) / 86400000);
}
