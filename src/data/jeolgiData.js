// 절기 데이터 (입춘 기준 월 구분)
// 각 월의 절기 시작점 (절입일)
// 간단한 근사 공식 사용
export const JEOLGI_BASE = [
  { name: '입춘', month: 1, baseDay: 4, baseMon: 2 },
  { name: '경칩', month: 2, baseDay: 6, baseMon: 3 },
  { name: '청명', month: 3, baseDay: 5, baseMon: 4 },
  { name: '입하', month: 4, baseDay: 6, baseMon: 5 },
  { name: '망종', month: 5, baseDay: 6, baseMon: 6 },
  { name: '소서', month: 6, baseDay: 7, baseMon: 7 },
  { name: '입추', month: 7, baseDay: 8, baseMon: 8 },
  { name: '백로', month: 8, baseDay: 8, baseMon: 9 },
  { name: '한로', month: 9, baseDay: 8, baseMon: 10 },
  { name: '입동', month: 10, baseDay: 7, baseMon: 11 },
  { name: '대설', month: 11, baseDay: 7, baseMon: 12 },
  { name: '소한', month: 12, baseDay: 6, baseMon: 1 }
];
