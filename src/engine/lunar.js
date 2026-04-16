// ============================================================
// Lunar Calendar Functions
// ============================================================
import { LUNAR_DATA } from '../data/lunarData.js';

// 음력 변환 함수들
export function lunarMonthDays(y, m) {
  const idx = y - 1900;
  if (idx < 0 || idx >= LUNAR_DATA.length) return 29;
  return (LUNAR_DATA[idx] & (0x10000 >> m)) ? 30 : 29;
}

export function lunarLeapMonth(y) {
  const idx = y - 1900;
  if (idx < 0 || idx >= LUNAR_DATA.length) return 0;
  return LUNAR_DATA[idx] & 0xf;
}

export function lunarLeapDays(y) {
  if (lunarLeapMonth(y)) {
    const idx = y - 1900;
    return (LUNAR_DATA[idx] & 0x10000) ? 30 : 29;
  }
  return 0;
}

export function lunarYearDays(y) {
  let sum = 348;
  const idx = y - 1900;
  if (idx < 0 || idx >= LUNAR_DATA.length) return 365;
  for (let i = 0x8000; i > 0x8; i >>= 1) {
    sum += (LUNAR_DATA[idx] & i) ? 1 : 0;
  }
  return sum + lunarLeapDays(y);
}

// 양력 → 음력 변환
export function solarToLunar(sy, sm, sd) {
  const baseDate = new Date(1900, 0, 31);
  const targetDate = new Date(sy, sm - 1, sd);
  let offset = Math.floor((targetDate - baseDate) / 86400000);

  let ly = 1900, lm = 1, ld = 1;
  let isLeap = false;

  for (ly = 1900; ly < 2101 && offset > 0; ly++) {
    let daysInYear = lunarYearDays(ly);
    if (offset < daysInYear) break;
    offset -= daysInYear;
  }

  let leapM = lunarLeapMonth(ly);
  let leap = false;

  for (lm = 1; lm < 13 && offset > 0; lm++) {
    if (leapM > 0 && lm === (leapM + 1) && !leap) {
      --lm;
      leap = true;
      let dm = lunarLeapDays(ly);
      if (offset < dm) { isLeap = true; break; }
      offset -= dm;
      leap = false;
    } else {
      let dm = lunarMonthDays(ly, lm);
      if (offset < dm) break;
      offset -= dm;
    }
  }
  ld = offset + 1;
  return { year: ly, month: lm, day: ld, isLeap: isLeap };
}

// 음력 → 양력 변환
export function lunarToSolar(ly, lm, ld, isLeap) {
  let offset = 0;
  for (let y = 1900; y < ly; y++) {
    offset += lunarYearDays(y);
  }
  let leapM = lunarLeapMonth(ly);
  for (let m = 1; m < lm; m++) {
    offset += lunarMonthDays(ly, m);
    if (m === leapM) {
      offset += lunarLeapDays(ly);
    }
  }
  if (isLeap && lm === leapM) {
    offset += lunarMonthDays(ly, lm);
  }
  offset += ld - 1;
  const base = new Date(1900, 0, 31);
  const result = new Date(base.getTime() + offset * 86400000);
  return { year: result.getFullYear(), month: result.getMonth() + 1, day: result.getDate() };
}
